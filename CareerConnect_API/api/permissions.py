from rest_framework import permissions


class IsOwnerOnly(permissions.BasePermission):
    """
    Object-level permission to only allow the owner of an object to edit or delete it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to the owner of the object only.
        if request.method in permissions.SAFE_METHODS:
            return obj.employer_profile.user == request.user

        # Write permissions are only allowed to the owner of the object.
        return obj.employer_profile.user == request.user


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


class IsStudentAndOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method in ['POST'] and request.user.is_authenticated \
                and hasattr(request.user, 'student_profile'):
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'DELETE'] and request.user.is_authenticated \
                and hasattr(request.user, 'student_profile') and obj.application_package.student_profile == request.user.student_profile:
            return True
        return False
