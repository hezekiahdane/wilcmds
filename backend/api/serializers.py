from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

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
		print(email)
		print(password)
		user = authenticate(username=email, password=password)
		print('Authenticated:', user)
		if not user:
			raise ValidationError('User does not exist.')
			
		if not user.check_password(password):
			raise ValidationError('Incorrect password. Please try again.')
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username', 'firstname', 'lastname', 'user_profile')

		def update(self, instance, validated_data):
			user_profile_data = validated_data.pop('user_profile', None)
			if user_profile_data is not None:
				instance.user_profile = user_profile_data
			return super().update(instance, validated_data)
