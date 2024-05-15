from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation
from django.contrib.auth import update_session_auth_hash
from rest_framework.generics import UpdateAPIView
from rest_framework import status
from django.http import Http404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from . models import Post, Comments, Analytics
from .serializers import PostSerializer, AdminLoginSerializer, CommentSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate


# Create your views here.
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		try:
			clean_data = custom_validation(request.data)
			serializer = UserRegisterSerializer(data=clean_data)
			if serializer.is_valid():
				user = serializer.create(clean_data)
				user.save()
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except ValidationError as e:
			error_message = e.message if hasattr(e, 'message') else str(e)
			return Response(error_message, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        try:
            data = request.data
            clean_data = {
                'email': data.get('email', '').strip(),
                'password': data.get('password', '').strip()
            }
            serializer = UserLoginSerializer(data=clean_data)
            if serializer.is_valid():
                user_data = serializer.check_user(clean_data)
                user = authenticate(username=user_data['email'], password=clean_data['password'])
                login(request, user)
                return Response(user_data, status=status.HTTP_200_OK)  # Return user data including is_staff
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            error_message = e.message if hasattr(e, 'message') else str(e)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,) 	
	
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
class AdminLoginView(APIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            # Your logic for what to do after successful login
            return Response({"message": "Login successful", "user_id": user.user_id}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfileUpdate(UpdateAPIView):
	serializer_class = UserSerializer
	permission_classes = (permissions.IsAuthenticated,)

	def get_object(self):
		return self.request.user
	
	def update(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		update_session_auth_hash(request, instance)
		return Response(serializer.data)

class PostView(APIView):
	@method_decorator(csrf_exempt)
	def get(self, request):
		post = Post.objects.all()
		serializer = PostSerializer(post, many=True)
		return Response (serializer.data)
	
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = PostSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdatePost(APIView):
	def get_object(self, pk):
		try:
			return Post.objects.get(pk=pk)
		except Post.DoesNotExist:
			raise Http404
		
	def put(self, request, pk):
		post = self.get_object(pk)
		serializer = PostSerializer(post, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response (serializer.data)
		return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request, pk):
		post = self.get_object(pk)
		post.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class CommentsView(APIView):
	def get(self, request):
		comment_objects = Comments.objects.all()

		serializer = CommentSerializer(comment_objects, many=True)
		return Response(serializer.data)
	
	def post(self, request):
		serializer = CommentSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response (serializer.data, status=status.HTTP_200_OK)
		return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)
