import logging
from bson.objectid import ObjectId
from api.database.mongodb import get_db
from schemes.services.scheme_service import SchemeService

logger = logging.getLogger(__name__)


# Mapping of crops to relevant scheme categories and IDs
CROP_SCHEME_RELEVANCE = {
    # Cash crops / commercial crops benefit from insurance, solar, infrastructure
    "cotton": ["pmfby", "pm-kusum", "agri-infra-fund", "pm-kisan", "nfsm"],
    "sugarcane": ["pmfby", "pm-kusum", "agri-infra-fund", "pm-kisan", "nfsm"],
    "tobacco": ["pmfby", "pm-kisan", "agri-infra-fund"],
    "jute": ["pmfby", "pm-kisan", "nfsm"],

    # Food grains
    "rice": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "wheat": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "maize": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "bajra": ["pmfby", "pm-kisan", "nfsm", "soil-health-card"],
    "jowar": ["pmfby", "pm-kisan", "nfsm", "soil-health-card"],
    "ragi": ["pmfby", "pm-kisan", "nfsm", "soil-health-card"],

    # Pulses
    "tur": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "moong": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "urad": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "chana": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "masoor": ["pmfby", "pm-kisan", "nfsm", "soil-health-card"],

    # Oilseeds
    "groundnut": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "soybean": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "mustard": ["pmfby", "pm-kisan", "nfsm", "soil-health-card", "e-nam"],
    "sunflower": ["pmfby", "pm-kisan", "nfsm", "soil-health-card"],

    # Horticulture
    "mango": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
    "banana": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
    "onion": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
    "potato": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
    "tomato": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],

    # Spices
    "turmeric": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
    "chilli": ["pmfby", "pm-kisan", "agri-infra-fund", "e-nam"],
}

# Farm-size based relevance: smaller farms get more subsidy-focused schemes
SMALL_FARM_PRIORITY = ["pm-kisan", "pmfby", "soil-health-card", "nfsm"]
LARGE_FARM_PRIORITY = ["pm-kusum", "agri-infra-fund", "e-nam", "pmfby"]


class RecommendationService:
    """
    Recommends government schemes based on farmer profile:
    state, district, main_crop, farm_size.
    """

    @staticmethod
    def get_farmer_profile(user_id):
        """
        Fetches the farmer's profile from the users collection.
        """
        db = get_db()
        if db is None:
            return None

        try:
            user = db["users"].find_one({"_id": ObjectId(user_id)})
            if user:
                return {
                    "state": user.get("state", ""),
                    "district": user.get("district", ""),
                    "main_crop": user.get("main_crop", ""),
                    "farm_size": user.get("farm_size", 0),
                }
        except Exception as e:
            logger.error(f"Error fetching farmer profile: {e}")

        return None

    @classmethod
    def get_recommendations(cls, user_id):
        """
        Returns a scored list of schemes recommended for the given farmer.
        """
        profile = cls.get_farmer_profile(user_id)
        if not profile:
            # If no profile, return all schemes without personalized scoring
            schemes, _ = SchemeService.get_all_schemes(page_size=4)
            return schemes, "No profile found. Showing popular schemes."

        # Get all schemes from DB
        all_schemes, total = SchemeService.get_all_schemes(page_size=100)
        if not all_schemes:
            return [], "No schemes available."

        scored_schemes = []

        crop = (profile.get("main_crop") or "").lower().strip()
        state = (profile.get("state") or "").lower().strip()
        farm_size = float(profile.get("farm_size") or 0)

        for scheme in all_schemes:
            score = 0
            scheme_id = scheme.get("schemeId", "")
            scheme_state = (scheme.get("state") or "").lower()

            # State relevance: central schemes apply to everyone,
            # state-specific schemes match only if state matches
            if "central" in scheme_state or "all states" in scheme_state:
                score += 10
            elif state and state in scheme_state:
                score += 15  # higher score for state-specific match
            elif state and state not in scheme_state and "central" not in scheme_state:
                score -= 5  # not relevant to this state

            # Crop relevance
            crop_relevant_schemes = CROP_SCHEME_RELEVANCE.get(crop, [])
            if scheme_id in crop_relevant_schemes:
                score += 20

            # Farm size relevance
            if farm_size > 0:
                if farm_size <= 5:  # Small / marginal farmer
                    if scheme_id in SMALL_FARM_PRIORITY:
                        score += 15
                else:  # Larger farmer
                    if scheme_id in LARGE_FARM_PRIORITY:
                        score += 15

            # Base score: every valid scheme gets minimum points
            score += 5

            scheme["_relevance_score"] = score
            scored_schemes.append(scheme)

        # Sort by relevance score descending
        scored_schemes.sort(key=lambda x: x.get("_relevance_score", 0), reverse=True)

        # Only return the top 4 most highly recommended schemes
        top_recommendations = scored_schemes[:4]

        return top_recommendations, f"Personalized for {profile.get('state', 'N/A')}, {profile.get('main_crop', 'N/A')}, {profile.get('farm_size', 'N/A')} acres"
