from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . models import Post, Comments, Analytics
import facebook as fb
from django.core.files.base import ContentFile


UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ['email', 'username', 'password', 'firstname', 'lastname']
		
	def create(self, validated_data):
		user_obj = UserModel.objects.create_user(
			email=validated_data['email'],
			username=validated_data['username'],
			password=validated_data['password'],
			firstname=validated_data.get('firstname', ''),
			lastname=validated_data.get('lastname', '')
		)
		return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        email = clean_data['email']
        password = clean_data['password']
        user = authenticate(username=email, password=password)

        if not user:
            raise ValidationError('User does not exist.')

        if not user.check_password(password):
            raise ValidationError('Incorrect password. Please try again.')

        # Include is_staff in the returned user data
        return {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff  # Include this to check if the user is an admin
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('user_id', 'email', 'username', 'firstname', 'lastname', 'user_profile')
        
        def update(self, instance, validated_data):
            user_profile_data = validated_data.pop('user_profile', None)
            if user_profile_data is not None:
                instance.user_profile = user_profile_data
            return super().update(instance, validated_data)
 
class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    likes = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['post_id', 'caption', 'description', 'image_file', 'timestamp', 'user', 'likes', 'is_liked']
        read_only_fields = ['post_id', 'timestamp', 'user', 'likes', 'is_liked']

    def get_user(self, obj):
        return {
            "username": obj.user.username,
            "user_profile": obj.user.user_profile.url if obj.user.user_profile else None
        }

    def get_is_liked(self, obj):
        request = self.context.get('request')
        return obj.likes.filter(user_id=request.user.user_id).exists() if request and request.user else False
    
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        post = Post.objects.create(user=user, **validated_data)
        
        caption = validated_data.get('caption', '')
        description = validated_data.get('description', '')
        message = f"{caption}\n\n{description}" if caption and description else caption or description
        image_path = post.image_file.path

        api = "EAAQVwk33L4ABOZCGqYh0lHozrOgeuyiX3uABALxbHqze4xij6RLMXh6S4oPGeUzyj6uAACnpoGRX3ZCU4KsV051ttVVZAuS5DJ2ifVaC4UkHiitfWtIvluxJdWGxBI2jlKV0tXRUIoJFyjSE9ZC91QfP0Gue8MBlxXNR0HKR7ZBtt9STYj2XhfNyJ6R7ILW90qrKja3NZC5Y8ZBDoa5dYgbOano"
        wilcmds = fb.GraphAPI(api)

        try:
            # Open the image file in binary mode
            with open(image_path, 'rb') as image_file:
                # Upload the photo to Facebook
                wilcmds.put_photo(image=image_file, message=message)
        
        except Exception as e:
            print(f"An error occurred while posting to Facebook: {e}")

        return post

    

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()

    class Meta:
        model = Comments
        fields = ['id', 'user', 'post', 'content', 'timestamp', 'username', 'user_profile']

    def get_username(self, obj):
        return obj.user.username

    def get_user_profile(self, obj):
        return obj.user.user_profile.url if obj.user.user_profile else None

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)

            if user:
                if user.is_staff:
                    return user
                else:
                    raise serializers.ValidationError("You do not have permission to access the admin panel.")
            else:
                raise serializers.ValidationError("Invalid email or password.")
        else:
            raise serializers.ValidationError("Both email and password are required fields.")
