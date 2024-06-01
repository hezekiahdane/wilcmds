from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50, unique=True)
    firstname = models.CharField(max_length=50, blank=True)
    lastname = models.CharField(max_length=50, blank=True)
    is_staff = models.BooleanField(default=False)
    user_profile = models.ImageField(null=True, blank=True, upload_to='images/')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    def __str__(self):
        return self.username
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50, unique=True)
    firstname = models.CharField(max_length=50, blank=True)
    lastname = models.CharField(max_length=50, blank=True)
    is_staff = models.BooleanField(default=False)
    user_profile = models.ImageField(null=True, blank=True, upload_to='images/')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    def __str__(self):
        return self.username

class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    caption = models.CharField(max_length=255)
    description = models.TextField()
    likes = models.ManyToManyField(AppUser, related_name='liked_posts', blank=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    image_file = models.ImageField(blank=True, upload_to='post_images/')
    downloads = models.IntegerField(default=0)

class Comments(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments_set')
    content = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
	
class Analytics(models.Model):
	analytics_id = models.AutoField(primary_key=True)
	post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
	total_likes = models.IntegerField(default=0)
	action_timestamp = models.DateTimeField(auto_now_add=True)

