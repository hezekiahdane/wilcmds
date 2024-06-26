# Generated by Django 5.0.6 on 2024-05-25 13:42

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_post_liked_by_remove_post_likes_post_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='liked_by',
        ),
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]
