import React, { useState } from 'react';
import { client } from '../Url';
import { formatDistanceToNow } from 'date-fns';

const AdminPost = ({ posts }) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({ caption: '', description: '' });

  const handleEdit = (post) => {
    setEditingPostId(post.post_id);
    setEditFormData({ caption: post.caption, description: post.description });
  };

  const handleDelete = async (postId) => {
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
      await client.delete(`/posts/${postId}`, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      // Remove the deleted post from the local state
      setPosts(posts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
      const response = await client.put(`/posts/${editingPostId}`, editFormData, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      // Update the edited post in the local state
      setPosts(posts.map(post => post.post_id === editingPostId ? response.data : post));
      setEditingPostId(null);
    } catch (error) {
      console.log('Error updating post:', error);
    }
  };

  if (!posts.length) {
    return <div className='mt-96'>No posts to display.</div>;
  }

  return (
    <div className="relative top-[50px] left-[200px] items-center space-y-6">
      {posts.map((post) => (
        <div key={post.post_id} className="relative rounded-3xl bg-white box-border max-w-7xl border border-solid border-black p-4 mb-11 shadow-lg overflow-hidden">
          <div className="flex justify-between items-center text-xl mb-4 bg-white p-4 rounded-t-3xl">
            <div className="flex items-center space-x-4">
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={post.user.user_profile ? `http://localhost:8000${post.user.user_profile}` : 'fallback-profile-image-url'}
                alt={post.user.username}
                onError={(e) => {
                  console.log(`Profile image failed to load: ${post.user.user_profile}`);
                  e.target.src = 'fallback-profile-image-url'; // Provide a fallback image URL
                }}
              />
              <div>
                <div className="text-xl font-semibold">{post.user.username}</div>
                <div className="text-sm text-gray-500 ml-6">
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <img 
                className="w-10 h-10 cursor-pointer" 
                alt="Edit icon" 
                src="/edit-icon.svg" 
                onClick={() => handleEdit(post)} 
              />
              <img 
                className="w-10 h-10 cursor-pointer" 
                alt="Delete icon" 
                src="/delete-icon.svg" 
                onClick={() => handleDelete(post.post_id)} 
              />
            </div>
          </div>

          {editingPostId === post.post_id ? (
            <form onSubmit={handleEditSubmit} className="p-4 text-left bg-gray-50">
              <input
                type="text"
                name="caption"
                value={editFormData.caption}
                onChange={handleEditChange}
                className="w-full mb-4 p-2 border rounded-lg"
              />
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg"
              />
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                Save
              </button>
              <button 
                type="button" 
                className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setEditingPostId(null)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div className="p-4 text-left bg-gray-50">
                <div className="text-lg font-medium">{post.caption}</div>
                <div className="text-gray-700 mt-2">{post.description}</div>
              </div>
              
              {post.image_file && (
                <img
                  src={`http://localhost:8000${post.image_file}`}
                  alt='post image'
                  className="w-full h-auto object-cover self-center my-4 rounded-2xl"
                  style={{ maxHeight: '600px' }}
                  onError={(e) => {
                    console.log(`Image failed to load: ${post.image_file}`);
                    e.target.src = 'fallback-image-url'; // Provide a fallback image URL
                  }}
                />
              )}
              
              <div className="flex justify-center gap-60 items-center p-4 bg-white rounded-b-3xl">
                <button className="flex items-center text-blue-500">
                  <img src="/like-icon.svg" alt="Like" className="w-6 h-6 mr-2" />
                  {post.likes} Likes
                </button>
                <button className="flex items-center text-gray-500">
                  <img src="/comment-icon.svg" alt="Comment" className="w-6 h-6 mr-2" />
                  {post.comments && post.comments.length > 0 ? `${post.comments.length} Comments` : 'Comments'}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPost;
