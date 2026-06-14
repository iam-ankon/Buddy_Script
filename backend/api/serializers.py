from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Comment, Reply, PostLike, CommentLike, ReplyLike

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'username']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user

class ReplyLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ReplyLike
        fields = ['id', 'user', 'created_at']

class ReplySerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()
    likes = ReplyLikeSerializer(source='likes.all', many=True, read_only=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'author', 'content', 'created_at', 'updated_at', 'likes_count', 'user_has_liked', 'likes']
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()
    replies = ReplySerializer(many=True, read_only=True)
    replies_count = serializers.IntegerField(source='replies.count', read_only=True)
    likes = CommentLikeSerializer(source='likes.all', many=True, read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at', 'updated_at', 'likes_count', 'user_has_liked', 'replies', 'replies_count', 'likes']
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class PostLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    user_has_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    likes = PostLikeSerializer(source='likes.all', many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'image', 'privacy', 'created_at', 'updated_at', 'likes_count', 'comments_count', 'user_has_liked', 'comments', 'likes']
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False