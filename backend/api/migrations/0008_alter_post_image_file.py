# Generated by Django 5.0.6 on 2024-05-21 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_rename_comment_id_comments_comments_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image_file',
            field=models.ImageField(blank=True, upload_to='post_images/'),
        ),
    ]
