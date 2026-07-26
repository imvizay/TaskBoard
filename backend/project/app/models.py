from django.db import models
from django.conf import settings

# TASK MODEL
class Task(models.Model):

    task_name = models.CharField(max_length=256)
    task_code = models.CharField(max_length=10,unique=True,db_index=True,editable=False)

    task_priority = models.CharField(
        max_length=15,
        choices=[
            ("low","LOW"),
            ("medium","MEDIUM"),
            ("high","HIGH")
        ],
        default="medium"
        )
    
    task_status = models.CharField(
        max_length=15,
        choices=[
            ("pending","PENDING"),
            ("in-progress","IN PROGRESS"),
            ("completed","COMPLETED")
        ],
        default="pending"
        )

    task_description = models.TextField(null=True,blank=True)

    due_date = models.DateField(blank=False,null=False)

    task_image = models.ImageField(upload_to='tasks/',blank=True,null=True)

    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return f"{self.task_name}"

    def save(self, *args, **kwargs):

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.task_code:
            self.task_code = f"TASK-{self.pk:03d}"
            super().save(update_fields=["task_code"])




class TaskComment(models.Model):

    task = models.ForeignKey(Task,on_delete=models.CASCADE,related_name="comments")
    user  = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="task_comments")
    comment = models.TextField(blank=True,null=True)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user} - {self.task}"
    

    

