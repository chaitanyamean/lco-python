from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from .models import CustomUser
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout
import re
# Create your views here.
import random
# /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}
def generate_session_token(length=10):
    return ''.join(random.SystemRandom().choice([chr(i) for i in range(97, 123)] + [str(i) for i in range(10)]) for _ in range(10))

@csrf_exempt
def signin(request):
    if not request.method == 'POST':
        return JsonResponse({'Error': 'Send a post request'})
    
    username = request.POST['email']
    password = request.POST['password']
    print(request)
    # valiidation Part
    if not re.match("^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$", username):
        return JsonResponse({'error': 'Enter valid Email'})
    
    if len(password) < 3:
        return JsonResponse({'Error': 'Password need to be atleast 3 Chars'})

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=username)
        if user.check_password(password):
            user_dict = UserModel.objects.filter(email=username).values().first()
            print(user_dict)
            user_dict.pop('password')

            if user.session_token != "0":
                user.session_token = '0'
                user.save()
                return JsonResponse({"Error": 'Previous session exists'})
            
            token = generate_session_token()
            user.session_token = token
            user.save()
            login(request,user)
            return JsonResponse({'token': token, 'user': user_dict})
        else:
            return JsonResponse({"Error": 'Invalid Password'})


    except UserModel.DoesNotExist:
        return JsonResponse({'Error': 'Invalid email'})

def signout(request, id):
    logout(request)

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(pk=id)
        user.session_token = '0'
        user.save()
    except UserModel.DoesNotExist:
        return JsonResponse({'Error': 'Invalid User Id'})

    return JsonResponse({'Success': 'Logged out successful'})

def getUserSessionId(request,id):
    # print(id, request)

    UserModel = get_user_model()

    try:
        user = UserModel.objects.filter(pk=id).values().first()
        print('UserModel', user)
        user.pop('password')

        # serializer = self.get_serializer(user) 
        # print(serializer)                                                                                                                                                                                                                                                                                                                                                   

        return JsonResponse({'token': user})
    except UserModel.DoesNotExist:
        return JsonResponse({'Error': 'Error while fetching session'})


class UserViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {'create': [AllowAny]}

    queryset = CustomUser.objects.all().order_by('id')
    serializer_class = UserSerializer

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


