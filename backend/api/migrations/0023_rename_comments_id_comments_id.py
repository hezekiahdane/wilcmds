# Generated by Django 5.0.6 on 2024-05-27 17:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_comments_post'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='comments_id',
            new_name='id',
        ),
    ]
