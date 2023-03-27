from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `employer` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `employer`.
        if hasattr(obj, 'employer_profile'):
            return obj.employer_profile == request.user.employer_profile
        elif hasattr(obj, 'student_profile'):
            return obj.student_profile == request.user.student_profile


class CanCreateOrRemoveApplication(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method in ['POST', 'DELETE'] and request.user.is_authenticated and hasattr(request.user, 'student_profile'):
            return True

        return False
