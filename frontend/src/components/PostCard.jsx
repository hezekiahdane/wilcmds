import React, { useState, useEffect } from 'react';
import { client } from '../Url';
import { formatDistanceToNow } from 'date-fns';

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    client.get('/posts')
      .then(response => {
        setPosts(response.data);
        return client.get('/user');
      })
      .then(userResponse => {
        setUser(userResponse.data);
      })
      .catch(error => console.log('Failed to fetch data:', error));
  }, []);

  const handleLike = (postId) => {
    client.post(`/posts/${postId}/like`)
      .then(response => {
        setPosts(posts.map(post => 
          post.post_id === postId ? { ...post, likes: response.data.status === 'liked' ? post.likes + 1 : post.likes - 1, is_liked: response.data.status === 'liked' } : post
        ));
      })
      .catch(error => console.log('Failed to like/unlike post:', error));
  };

  if (!posts.length) {
    return <div className='mt-96'>No posts to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-44 hover:cursor-pointer">
      {posts.map((post) => (
        <div key={post.post_id} className="relative rounded-xl bg-white border border-solid border-gray-300 p-4 mb-6 shadow-lg overflow-hidden">
          <div className="flex justify-between items-center text-lg mb-4 p-4 rounded-t-xl bg-gray-100">
            <div className="flex items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={post.user.user_profile ? `http://localhost:8000${post.user.user_profile}` : 'fallback-profile-image-url'}
                alt={post.user.username}
                onError={(e) => {
                  console.log(`Profile image failed to load: ${post.user.user_profile}`);
                  e.target.src = 'fallback-profile-image-url'; // Provide a fallback image URL
                }}
              />
              <div className='text-left'>
                <div className="text-lg font-semibold">{post.user.username}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 text-left bg-gray-50 rounded-b-xl">
            <div className="text-xl mb-12 font-semibold">{post.caption}</div>
            <div className="text-gray-700 mt-2">{post.description}</div>
          </div>
          
          {post.image_file && (
            <img
              src={`http://localhost:8000${post.image_file}`}
              alt='post image'
              className="w-full h-auto object-cover self-center my-2 rounded-xl"
              style={{ maxHeight: '300px' }}
              onError={(e) => {
                console.log(`Image failed to load: ${post.image_file}`);
                e.target.src = 'fallback-image-url'; // Provide a fallback image URL
              }}
            />
          )}
          
          <div className="flex justify-around items-center p-4 bg-white rounded-b-xl">
            <button
              className={`flex items-center ${post.is_liked ? 'text-red-500' : 'text-blue-500'}`}
              onClick={() => handleLike(post.post_id)}
            >
              <img src="/like-icon.svg" alt="Like" className="w-5 h-5 mr-2" />
              {post.likes} Likes
            </button>
            <button className="flex items-center text-gray-500">
              <img src="/comment-icon.svg" alt="Comment" className="w-5 h-5 mr-2" />
              {post.comments && post.comments.length > 0 ? `${post.comments.length} Comments` : 'Comments'}
            </button>
            <button className="flex items-center text-gray-500">
              <img src="/download-icon.svg" alt="Download" className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostCard;
