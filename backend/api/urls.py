from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('posts', views.PostView.as_view(), name='posts'),
    path('posts/<int:pk>', views.UpdatePost.as_view(), name='post-detail'),
    path('user/profile', views.UserProfileUpdate.as_view(), name='user-profile-update'),
]
