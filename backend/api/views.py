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
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.db.models import Count
from django.conf import settings
import facebook 

User = get_user_model()



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

@method_decorator(csrf_exempt, name='dispatch')
class PostView(APIView):
    permission_classes = [AllowAny]
 
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
 
    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'pk'

class PostComments(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        comments = Comments.objects.filter(post_id=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(post_id=post_id)  
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'content': request.data.get('content'),
            'user': request.user.user_id,  
            'post': post.post_id 
        }
        
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id, comment_id):
        try:
            comment = Comments.objects.get(post_id=post_id, id=comment_id, user=request.user)
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comments.DoesNotExist:
            return Response({'error': 'Comment not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)
	
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
    def get(self, request, post_id):
        comments = Comments.objects.filter(post_id=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LikePost(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        if user in post.likes.all():
            post.likes.remove(user)
            status_message = 'unliked'
        else:
            post.likes.add(user)
            status_message = 'liked'

        post.save()
        return Response({'status': status_message, 'likes': post.likes.count()})
    

class TotalLikesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_likes = Post.objects.annotate(like_count=Count('likes')).aggregate(total_likes=Sum('like_count')).get('total_likes', 0)
        return Response({'total_likes': total_likes})

