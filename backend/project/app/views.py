from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,action
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate,login
from rest_framework.permissions import IsAdminUser


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
    permission_classes = [IsAdminUser]
    queryset = Task.objects.all()
    serializer_class = TaskViewSerializer 
    
    def list(self, request, *args, **kwargs):
      print("User:", request.user)
      print("Authenticated:", request.user.is_authenticated)
      print("Is Staff:", getattr(request.user, "is_staff", None))
      return super().list(request, *args, **kwargs)

    @action(detail=False,methods=["patch"],url_path="reorder")
    def reorder(self,request):

        print("REQ DATA:",request.data)

        positions = request.data
       

        if not positions:
            return Response({
                "error":"No positions provided"
            },status=400)

        for item in positions:
            Task.objects.filter(id=item["id"]).update(position=item["position"])

        return Response({
            "message":"Task order updated successfully."
        },status=200)

 