# Generated by Django 5.0.6 on 2024-05-20 13:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_post_image_file'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='comment_id',
            new_name='comments_id',
        ),
    ]
