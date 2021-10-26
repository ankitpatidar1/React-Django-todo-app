from rest_framework.views import APIView
from rest_framework.response import Response
from task.serializers import TaskSerializer

from task.models import Task
# Create your views here.


class TaskView(APIView):

    def get(self,request):
        tasks = Task.objects.all()
        serialized = TaskSerializer(tasks,many=True)
        return Response({"tasks":serialized.data})
    
    def post(self,request):
        _response = {}
        try:
            task = request.data.get('task',None)
            if task:
                serialized = TaskSerializer(data=task)
                if serialized.is_valid(raise_exception=True):
                    instance = serialized.save()
                    _response.update({"status":200,"message":" successfully %s task created" % instance.title})
            else:
                _response.update({"status":400,"message":" author content not available in request"})
        except Exception as ex:
            _response.update({"status":503,"message":" Something wrong with Post function \n %s" % ex})
                    
        return Response(_response)


    
    def put(self,request,pk):
        saved_task = Task.objects.get(pk=pk)
        try:
            task = request.data.get('task',None)
            _response = {}
            if task:
                serialized = TaskSerializer(instance=saved_task,data=task)
                if serialized.is_valid(raise_exception=True):
                    _serialized = serialized.save()
                    _response.update({"status":200,"message":"successfully %s author updated" % _serialized.title})
            else:
                _response.update({"status":400,"message":" author content not available in request"})
        except Exception as ex:
            _response.update({"status":503,"message":" Something wrong with Post function \n %s" % ex})
                    
        return Response(_response)

        
    
    def delete(self,request,pk):
        task = Task.objects.get(id=pk)
        task.delete()
        return Response({"status":200,"message":" successfully delete %s author" % task.title})