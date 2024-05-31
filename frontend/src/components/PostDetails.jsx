import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../Url';
import { formatDistanceToNow } from 'date-fns';
import Comment from './Comment';

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const csrfToken = getCookie('csrftoken');

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  const fetchPostDetails = () => {
    client.get(`/posts/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => console.log('Failed to fetch post details:', error));
  };

  const fetchComments = () => {
    client.get(`/posts/${postId}/comments`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => console.log('Failed to fetch comments:', error));
  };

  const fetchCurrentUser = () => {
    client.get('/user')
      .then(response => {
        console.log('Current User:', response.data);  // Check current user data
        setCurrentUser(response.data);
      })
      .catch(error => console.log('Failed to fetch current user:', error));
  };

  const handleLike = () => {
    client.post(`/posts/${postId}/like`, {}, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
      .then(response => {
        setPost(prevPost => ({
          ...prevPost,
          likes: response.data.likes,
        }));
      })
      .catch(error => console.log('Failed to like post:', error));
  };

  const handleCommentSubmit = () => {
    client.post(`/posts/${postId}/comments`, { content: newComment }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment("");
        setShowCommentForm(false);
      })
      .catch(error => console.log('Failed to submit comment:', error));
  };

  const handleDeleteComment = (commentId) => {
    client.delete(`/posts/${postId}/comments/${commentId}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    })
      .then(() => {
        setComments(comments.filter(comment => comment.id !== commentId));
      })
      .catch(error => console.log('Failed to delete comment:', error));
  };

  if (!post) {
    return <div className="mt-96">Loading...</div>;
  }

  return (
    <div className="relative bg-white text-center text-lg text-dimgray font-poppins">
      {/** User Profile */}
      <div className="flex items-center justify-start pt-32 px-40">
        <img
          className="w-14 h-14 object-cover rounded-full mr-4"
          alt=""
          src={post.user.user_profile ? `http://localhost:8000${post.user.user_profile}` : 'fallback-profile-image-url'}
        />
        <div className='text-start'>
          <div className="font-semibold justify-start">{post.user.username}</div>
          <div className="text-dimgray justify-start font-light text-sm">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </div>
        </div>
      </div>

      <div className='px-24'>
        <div className="text-left pt-10 px-40 text-xl font-bold">
          {post.caption}
        </div>

        <div className="text-left pt-10 px-40 text-md">
          {post.description}
        </div>
      </div>
        
      <div className="relative rounded-2xl mx-40 p-8">
        {/** Display the image here */}
        {post.image_file && (
          <img
            src={`${post.image_file}`}
            alt="Post image"
            className="max-h-96 mx-auto object-cover rounded-2xl"
            onError={(e) => {
              console.log(`Failed to load image: http://localhost:8000${post.image_file}`);
              e.target.src = 'fallback-image-url';
            }}
          />
        )}
      </div>

      <div className="flex items-center pt-8 mx-60 justify-start space-x-4 text-xl text-gray-100 mb-4">
        <button onClick={handleLike} className="flex items-center space-x-2">
          <img className="w-10 h-10" alt="" src="/like-icon.svg" />
          <span className="flex items-center">{post.likes}</span>
        </button>
        <button onClick={() => setShowCommentForm(!showCommentForm)} className="flex items-center space-x-2">
          <img className="w-10 h-10" alt="" src="/comment-icon.svg" />
          <span className="flex items-center">{comments.length}</span>
        </button>
      </div>

      {showCommentForm && (
        <div className="flex flex-col items-end px-60 pt-8">
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="4"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleCommentSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      )}

      <div className="pt-10 px-80">
        <div className="text-left mb-4">Comments:</div>
        {comments.map((comment, index) => (
          <Comment
            key={index}
            time={formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
            username={comment.username}
            text={comment.content}
            userProfile={comment.user_profile ? `${comment.user_profile}` : null}
            onDelete={() => handleDeleteComment(comment.id)}
            currentUser={currentUser}
            commentUserId={comment.user}
          />
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
