import datetime
import logging
from bson.objectid import ObjectId
from api.database.mongodb import get_db
from schemes.adapters.pm_kisan_adapter import PMKisanAdapter
from schemes.adapters.pmfby_adapter import PMFBYAdapter
from schemes.adapters.pm_kusum_adapter import PMKusumAdapter
from schemes.adapters.soil_health_adapter import SoilHealthAdapter
from schemes.adapters.enam_adapter import ENAMAdapter
from schemes.adapters.agriinfra_adapter import AgriInfraAdapter
from schemes.adapters.nfsm_adapter import NFSMAdapter

logger = logging.getLogger(__name__)

COLLECTION_NAME = "government_schemes"

# Registry of all scheme adapters
ADAPTER_REGISTRY = [
    PMKisanAdapter,
    PMFBYAdapter,
    PMKusumAdapter,
    SoilHealthAdapter,
    ENAMAdapter,
    AgriInfraAdapter,
    NFSMAdapter,
]


class SchemeService:
    """
    Orchestrates fetching from all adapters, normalizes data,
    removes duplicates, and performs upserts into MongoDB.
    """

    @staticmethod
    def _get_collection():
        db = get_db()
        if db is not None:
            return db[COLLECTION_NAME]
        return None

    @classmethod
    def fetch_from_all_sources(cls):
        """
        Instantiate every registered adapter and collect normalized scheme data.
        Returns a list of scheme dicts and a list of source statuses.
        """
        schemes = []
        source_statuses = []

        for adapter_cls in ADAPTER_REGISTRY:
            adapter = adapter_cls()
            status_entry = {
                "source": adapter.scheme_id,
                "official_url": adapter.official_url,
                "status": "unknown",
                "timestamp": datetime.datetime.now(datetime.timezone.utc)
            }
            try:
                result = adapter.get_normalized_scheme()
                if result:
                    schemes.append(result)
                    status_entry["status"] = "success"
                else:
                    status_entry["status"] = "empty_response"
            except Exception as e:
                logger.error(f"Adapter {adapter.scheme_id} failed: {e}")
                status_entry["status"] = f"error: {str(e)[:100]}"

            source_statuses.append(status_entry)

        return schemes, source_statuses

    @classmethod
    def normalize(cls, scheme_data):
        """
        Ensure every scheme has all required fields with sensible defaults.
        """
        now = datetime.datetime.now(datetime.timezone.utc)
        defaults = {
            "schemeId": "",
            "schemeName": "",
            "category": "",
            "description": "",
            "benefits": "",
            "eligibility": "",
            "requiredDocuments": [],
            "applicationProcess": "",
            "officialWebsite": "",
            "state": "",
            "ministry": "",
            "source": "",
            "lastUpdated": now.strftime("%Y-%m-%d"),
            "createdAt": now,
            "updatedAt": now
        }
        normalized = defaults.copy()
        for key, val in scheme_data.items():
            if val is not None and val != "":
                normalized[key] = val
        return normalized

    @classmethod
    def remove_duplicates(cls, schemes):
        """
        Deduplicates schemes by schemeId, keeping the last occurrence.
        """
        seen = {}
        for scheme in schemes:
            sid = scheme.get("schemeId", "")
            if sid:
                seen[sid] = scheme
        return list(seen.values())

    @classmethod
    def update_existing_records(cls, collection, scheme):
        """
        Upserts a single scheme: update if exists, insert if new.
        Returns 'updated' or 'inserted'.
        """
        now = datetime.datetime.now(datetime.timezone.utc)
        existing = collection.find_one({"schemeId": scheme["schemeId"]})

        if existing:
            update_data = {k: v for k, v in scheme.items() if k not in ("_id", "createdAt")}
            update_data["updatedAt"] = now
            collection.update_one(
                {"schemeId": scheme["schemeId"]},
                {"$set": update_data}
            )
            return "updated"
        else:
            scheme["createdAt"] = now
            scheme["updatedAt"] = now
            collection.insert_one(scheme)
            return "inserted"

    @classmethod
    def refresh_all_schemes(cls):
        """
        Full refresh pipeline: fetch → normalize → deduplicate → upsert.
        Returns summary dict with counts and source statuses.
        """
        collection = cls._get_collection()
        if collection is None:
            return {
                "success": False,
                "error": "Database connection not available",
                "inserted": 0,
                "updated": 0,
                "sources": []
            }

        schemes, source_statuses = cls.fetch_from_all_sources()

        # Normalize all schemes
        normalized = [cls.normalize(s) for s in schemes]

        # Remove duplicates
        unique_schemes = cls.remove_duplicates(normalized)

        inserted = 0
        updated = 0

        for scheme in unique_schemes:
            if not scheme.get("schemeId") or not scheme.get("schemeName"):
                continue  # skip empty records
            result = cls.update_existing_records(collection, scheme)
            if result == "inserted":
                inserted += 1
            else:
                updated += 1

        # Create indexes for performance
        collection.create_index("schemeId", unique=True)
        collection.create_index("category")
        collection.create_index("state")
        collection.create_index("ministry")

        logger.info(f"Scheme refresh complete: {inserted} inserted, {updated} updated")

        return {
            "success": True,
            "inserted": inserted,
            "updated": updated,
            "total": inserted + updated,
            "sources": source_statuses,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

    @classmethod
    def get_all_schemes(cls, filters=None, sort_by="schemeName", sort_order=1, page=1, page_size=20, search=None):
        """
        Retrieve all schemes with optional filters, sorting, pagination, and search.
        """
        collection = cls._get_collection()
        if collection is None:
            return [], 0

        query = {}

        if filters:
            if filters.get("state"):
                query["state"] = {"$regex": filters["state"], "$options": "i"}
            if filters.get("category"):
                query["category"] = {"$regex": filters["category"], "$options": "i"}
            if filters.get("ministry"):
                query["ministry"] = {"$regex": filters["ministry"], "$options": "i"}

        if search:
            query["$or"] = [
                {"schemeName": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"benefits": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}}
            ]

        total = collection.count_documents(query)
        skip = (page - 1) * page_size

        cursor = collection.find(query).sort(sort_by, sort_order).skip(skip).limit(page_size)

        schemes = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            schemes.append(doc)

        return schemes, total

    @classmethod
    def get_scheme_details(cls, scheme_id):
        """
        Retrieve a single scheme by its schemeId or MongoDB _id.
        """
        collection = cls._get_collection()
        if collection is None:
            return None

        # Try by schemeId first
        doc = collection.find_one({"schemeId": scheme_id})

        # Try by _id if not found
        if not doc:
            try:
                doc = collection.find_one({"_id": ObjectId(scheme_id)})
            except Exception:
                return None

        if doc:
            doc["_id"] = str(doc["_id"])

        return doc

    @classmethod
    def get_system_status(cls):
        """
        Returns system status: total schemes, categories, last refresh info.
        """
        collection = cls._get_collection()
        if collection is None:
            return {
                "connected": False,
                "total_schemes": 0,
                "connected_sources": 0,
                "last_refresh": None,
                "failed_sources": []
            }

        total = collection.count_documents({})
        categories = collection.distinct("category")

        # Get the most recently updated scheme as proxy for last refresh
        last_updated_doc = collection.find_one(
            {},
            sort=[("updatedAt", -1)]
        )
        last_refresh = None
        if last_updated_doc and last_updated_doc.get("updatedAt"):
            last_refresh = last_updated_doc["updatedAt"].isoformat() if hasattr(last_updated_doc["updatedAt"], 'isoformat') else str(last_updated_doc["updatedAt"])

        return {
            "connected": True,
            "total_schemes": total,
            "connected_sources": len(ADAPTER_REGISTRY),
            "categories": categories,
            "last_refresh": last_refresh,
            "failed_sources": []
        }
