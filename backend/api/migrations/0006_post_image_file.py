# Generated by Django 5.0.5 on 2024-05-13 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_comments_post_analytics'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image_file',
            field=models.ImageField(blank=True, upload_to='post_images'),
        ),
    ]
