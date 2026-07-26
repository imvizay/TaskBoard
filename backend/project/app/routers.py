from rest_framework.routers import DefaultRouter
from app.views import TaskViewSet
router = DefaultRouter()

router.register('tasks',TaskViewSet)

urlpatterns = router.urls