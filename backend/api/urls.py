from django.conf import settings
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import UserRegister, UserLogin, UserLogout, UserView, PostView, UpdatePost, UserProfileUpdate, LikePost, PostDetail, PostComments, TotalLikesView, IncrementDownloadCount, TotalDownloadsView, TotalCommentsView, TotalGraphView

urlpatterns = [
    path('register', UserRegister.as_view(), name='register'),
    path('login', UserLogin.as_view(), name='login'),
    path('logout', UserLogout.as_view(), name='logout'),
    path('user', UserView.as_view(), name='user'),
    path('posts', PostView.as_view(), name='posts'),
    path('posts/<int:pk>', PostDetail.as_view(), name='post-detail'), 
    path('posts/update/<int:pk>', UpdatePost.as_view(), name='update-post'),  # Change the URL pattern
    path('posts/<int:post_id>/comments', PostComments.as_view(), name='post-comments'),
    path('posts/<int:post_id>/comments/<int:comment_id>', PostComments.as_view(), name='delete-comment'), 
    path('posts/<int:post_id>/like', LikePost.as_view(), name='like-post'),
    path('user/profile', UserProfileUpdate.as_view(), name='user-profile-update'),
    path('total-likes', TotalLikesView.as_view(), name='total-likes'),
    path('posts/<int:post_id>/increment-download', IncrementDownloadCount.as_view(), name='increment-download'),
    path('total-downloads', TotalDownloadsView.as_view(), name='total-downloads'),
    path('total-comments', TotalCommentsView.as_view(), name='total-comments'),
    path('total-graph/', TotalGraphView.as_view(), name='total_graph'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
