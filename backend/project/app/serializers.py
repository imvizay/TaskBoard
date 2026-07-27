from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Task
from datetime import date

from django.db.models import Max

class TaskViewSerializer(ModelSerializer):
    position  = serializers.IntegerField(required=False)
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
            'position'
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





