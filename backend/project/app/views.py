from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate,login


from .models import Task
from .serializers import TaskViewSerializer


# AUTHENTICATION
@api_view(['GET','POST'])
def login_view(request):
    username =  request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response({
            "message":"Invalid Credentials",
            
        },status=404)

    login(request,user)

    return Response({
        "message":"Login Successfull",
        "user":{
            "id":user.id,
            "username":user.username,
            "is_admin":user.is_superuser
        }
    },status=200)


# ADMIN CRUD OPERATION ON TASK
class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskViewSerializer 
    
    
