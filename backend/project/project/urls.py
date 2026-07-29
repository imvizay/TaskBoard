"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

from django.conf import settings
from django.conf.urls.static import static
from app import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/',views.login_view),
    path('api/signup/',views.signup_view),
   
    path('api/',include('app.routers')),
    path('api/tasks/export/pdf/',views.ExportPDFView.as_view()),
    path("api/tasks/export/excel/",views.ExportExcelView.as_view()),
    path("api/user/tasks/",views.TaskStatusAPIView.as_view()),
    path("api/tasks/comment/<int:pk>",views.add_comments)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)