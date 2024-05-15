import React, { useState, useEffect } from 'react';
import {client} from '../Url';

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    client.get('/posts')
      .then(response => {
        setPosts(response.data);
        setUser(response.data);
      })
      .catch(error => console.log('Failed to fetch posts:', error));
  }, []);


  return (
<div className="relative top-36">
  { posts.map((post, user) => (
    <div key={post.post_id} className="flex flex-col rounded-3xl border-2 border-dimgray mb-11 shadow-lg w-[960px] h-[496px] mx-auto overflow-hidden">
      <div className="flex items-center space-x-4 p-4 bg-white">
        <img
          className="w-14 h-14 rounded-full object-cover"
          src={user.user_profile}
          alt={post.user.username}
        />
        <div>
          <div className="text-xl font-semibold">{post.user.username}</div>
          <div className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
      <div className="p-4 bg-gray-50">
        <div className="text-lg font-medium">{post.caption}</div>
        <div className="text-gray-700 mt-2">{post.description}</div>
      </div>

      {post.image_file && (
        <img
          src={post.image_file}
          alt='post image'
          className="w-[800px] h-[240px] object-cover self-center" // 
        />
      )}


      <div className="flex justify-between items-center p-4 bg-white">
        <button className="flex items-center text-blue-500">
          <img src="/like-icon.svg" alt="Like" className="w-6 h-6 mr-2"/>
          {post.likes} Likes
        </button>
        <button className="text-gray-500">Comment</button>
        <button className="text-gray-500">Download</button>
      </div>
    </div>
  ))} 
</div>

  )
}

export default PostCard;

