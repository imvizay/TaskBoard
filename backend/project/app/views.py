from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,action
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
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


#  EXPORT PDF/EXCEL
from reportlab.platypus import SimpleDocTemplate,Table,TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from django.http import HttpResponse

class ExportPDFView(APIView):

    def get(self,request):

        if not request.user.is_superuser:
            return Response({
                "message":"Access Forbidden"
            },status=403)

        res = HttpResponse(content_type="application/pdf")

        res["Content-Disposition"] = (
            'attachment;filename="tasks.pdf"'
        )

        doc = SimpleDocTemplate(res)

        data = [
            ["NAME","CODE","PRIORITY","STATUS","DUE_DATE"]
        ]

        tasks = Task.objects.all().order_by("position")

        for task in tasks:
            data.append([
                task.task_name,
                task.task_code,
                task.task_priority,
                task.task_status,
                
                task.due_date
            ])

        table = Table(data)

        table.setStyle(
            TableStyle([
                ("BACKGROUND", (0,0), (-1,0), colors.grey),
                ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                ("GRID", (0,0), (-1,-1), 1, colors.black),
                ("BACKGROUND", (0,1), (-1,-1), colors.beige),
                ("BOTTOMPADDING", (0,0), (-1,0), 10),
            ])
        )
        doc.build([table])
        return res



from openpyxl import Workbook
class ExportExcelView(APIView):

     def get(self, request):
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        response["Content-Disposition"] = (
            'attachment; filename="tasks.xlsx"'
        )

        wb = Workbook()
        ws = wb.active
        ws.title = "Tasks"

        ws.append([
            "ID",
            "Task",
            "Code",
            "Priority",
            "Status",
            "Due Date",
            "Description"
        ])

        for task in Task.objects.all().order_by("position"):

            ws.append([
                task.id,
                task.task_name,
                task.task_code,
                task.task_priority,
                task.task_status,
                str(task.due_date),
                task.task_description
            ])

        wb.save(response)

        return response