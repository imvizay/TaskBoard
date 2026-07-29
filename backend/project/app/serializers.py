from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Task,TaskComment
from datetime import date

from django.db.models import Max

class TaskCommentSerializer(ModelSerializer):

    username = serializers.CharField(source="user.username",read_only=True)
    user_id = serializers.IntegerField(source="user.id",read_only=True)
    created_at = serializers.DateField(read_only=True)

    class Meta:
        model = TaskComment
        fields = ["user_id","username","comment","created_at"]


class TaskViewSerializer(ModelSerializer):
    task_image = serializers.SerializerMethodField()
    position  = serializers.IntegerField(required=False)
    comments = TaskCommentSerializer(read_only=True,many=True)
    class Meta:
        model = Task
        fields = [
            "id",
            "task_code",
            'task_name',
            'task_priority',
            'task_status',
            'task_image',
            'task_description',
            'due_date',
            'position',
            "comments"
        ]
        extra_kwargs = {
            "id":{"read_only":True},
            "task_code":{"read_only":True},
            "position":{"write_only":True}
        }

    def validate(self, attrs):
        error = {}
        task_name = attrs.get("task_name")
        task_image = attrs.get("task_image",None)
        due_date = attrs.get("due_date")

        if not task_name or not task_name.strip():
            error["task_name"] = "Task name required."

        if not due_date:
            error["due_date"] = "Due Date is required."

        if due_date < date.today():
            error["due_date"] = " Due Date cannot be a past date."

        if task_image:

            MAX_SIZE = 5*1024*1024 
            if task_image.size > MAX_SIZE :
                error["task_image"] = "Task Image cannot be more than 05 MB."


        if error:
            raise serializers.ValidationError(error)

        return attrs

    def create(self, validated_data):
        last_position = (
            Task.objects.aggregate(max_position=Max("position"))['max_position']
        )

        validated_data["position"] = (
           0 if last_position is None else last_position + 1
        )

        return Task.objects.create(**validated_data)

    def get_task_image(self,obj):

        request = self.context.get("request")

        if obj.task_image:
            return request.build_absolute_uri(obj.task_image.url)

        return None
        





