from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.utils.decorators import jwt_required
from api.utils.responses import api_response
from schemes.services.scheme_service import SchemeService
from schemes.services.recommendation_service import RecommendationService
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
def list_schemes(request):
    """
    GET /api/v1/schemes/
    Returns paginated list of government schemes with filters, sorting, and search.
    Query params: search, state, category, ministry, sort_by, sort_order, page, page_size
    """
    search = request.query_params.get('search', None)
    state = request.query_params.get('state', None)
    category = request.query_params.get('category', None)
    ministry = request.query_params.get('ministry', None)
    sort_by = request.query_params.get('sort_by', 'schemeName')
    sort_order_str = request.query_params.get('sort_order', 'asc')
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))

    # Clamp page_size
    page_size = min(max(page_size, 1), 100)
    page = max(page, 1)

    sort_order = 1 if sort_order_str == 'asc' else -1

    # Validate sort_by field
    allowed_sort = ['schemeName', 'category', 'updatedAt', 'createdAt', 'state', 'ministry']
    if sort_by not in allowed_sort:
        sort_by = 'schemeName'

    filters = {}
    if state:
        filters['state'] = state
    if category:
        filters['category'] = category
    if ministry:
        filters['ministry'] = ministry

    schemes, total = SchemeService.get_all_schemes(
        filters=filters if filters else None,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
        search=search
    )

    return api_response(
        success=True,
        message="Schemes retrieved successfully",
        data={
            "schemes": schemes,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": (total + page_size - 1) // page_size if page_size > 0 else 0
            }
        },
        status_code=status.HTTP_200_OK
    )


@api_view(['GET'])
def scheme_detail(request, scheme_id):
    """
    GET /api/v1/schemes/<scheme_id>/
    Returns details of a single scheme.
    """
    scheme = SchemeService.get_scheme_details(scheme_id)

    if not scheme:
        return api_response(
            success=False,
            message="Scheme not found",
            errors={"error": "No scheme found with the given ID"},
            status_code=status.HTTP_404_NOT_FOUND
        )

    return api_response(
        success=True,
        message="Scheme details retrieved successfully",
        data=scheme,
        status_code=status.HTTP_200_OK
    )


@api_view(['GET'])
@jwt_required
def recommended_schemes(request):
    """
    GET /api/v1/schemes/recommended/
    Returns personalized scheme recommendations based on farmer profile.
    Requires JWT authentication.
    """
    user_id = request.user_payload.get('user_id')

    schemes, message = RecommendationService.get_recommendations(user_id)

    return api_response(
        success=True,
        message=message,
        data={"schemes": schemes},
        status_code=status.HTTP_200_OK
    )


@api_view(['POST'])
@jwt_required
def refresh_schemes(request):
    """
    POST /api/v1/admin/refresh-schemes/
    Triggers a manual refresh of all scheme sources.
    Requires JWT with admin role.
    """
    role = request.user_payload.get('role', '')
    if role != 'admin':
        return api_response(
            success=False,
            message="Forbidden: Admin access required",
            errors={"error": "You do not have admin privileges"},
            status_code=status.HTTP_403_FORBIDDEN
        )

    result = SchemeService.refresh_all_schemes()

    if not result.get("success"):
        return api_response(
            success=False,
            message=result.get("error", "Refresh failed"),
            errors={"error": result.get("error")},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return api_response(
        success=True,
        message=f"Refresh complete. {result['inserted']} inserted, {result['updated']} updated.",
        data=result,
        status_code=status.HTTP_200_OK
    )


@api_view(['GET'])
def system_status(request):
    """
    GET /api/v1/admin/system-status/
    Returns system status: connected sources, total schemes, last refresh time.
    """
    status_data = SchemeService.get_system_status()

    return api_response(
        success=True,
        message="System status retrieved",
        data=status_data,
        status_code=status.HTTP_200_OK
    )
