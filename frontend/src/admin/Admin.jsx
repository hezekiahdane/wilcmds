import React, { useState, useEffect } from 'react';
import {client} from '../Url';


const Admin = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.get('/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => console.error('Error fetching posts: ', error));
  }, []);


  return (
    <div className="container mx-auto p-4">
        <div className='ml-96 mt-16'>
        {posts.map(post => (
          <div key={post.post_id} className="mt-4 p-4 shadow-lg rounded-lg">
            <h3>{post.caption}</h3>
            <p>{post.description}</p>
            {post.image_file && <img src={post.image_file} alt="Post" className="max-w-xs" />}
            <p>Likes: {post.likes}, Dislikes: {post.dislikes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Admin
