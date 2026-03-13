from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, ActionItemViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'action-items', ActionItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
