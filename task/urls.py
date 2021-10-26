from django.urls import path
from task import views


urlpatterns = [
	path('task/', views.TaskView.as_view()),
	path('task/<str:pk>/', views.TaskView.as_view()),
]
