import React, { useState } from 'react';
import { client } from '../Url';
import { formatDistanceToNow } from 'date-fns';

const AdminPost = ({ posts, setPosts }) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({ caption: '', description: '', image_file: null });

  const handleEdit = (post) => {
    setEditingPostId(post.post_id);
    setEditFormData({ caption: post.caption, description: post.description, image_file: null });
  };

  const handleDelete = async (postId) => {
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
      await client.delete(`/posts/${postId}`, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      alert('Post deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_file') {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
      const formData = new FormData();
      formData.append('caption', editFormData.caption);
      formData.append('description', editFormData.description);
      if (editFormData.image_file) {
        formData.append('image_file', editFormData.image_file);
      }

      const response = await client.put(`/posts/${editingPostId}`, formData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'multipart/form-data',
        }
      });

      setPosts(posts.map(post => post.post_id === editingPostId ? response.data : post));
      setEditingPostId(null);
      alert('Post edited successfully!');
      window.location.reload();
    } catch (error) {
      console.log('Error updating post:', error);
    }
  };

  if (!posts.length) {
    return <div className='mt-96'>No posts to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 p-16 hover:cursor-pointer">
      {posts.map((post) => (
        <div key={post.post_id} className="relative rounded-xl bg-white  border-solid border-gray-300 p-4 mb-6 shadow-lg overflow-hidden">
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
            <div className="flex space-x-2">
              <img 
                className="w-8 h-8 cursor-pointer" 
                alt="Edit icon" 
                src="/edit-icon.svg" 
                onClick={() => handleEdit(post)} 
              />
              <img 
                className="w-8 h-8 cursor-pointer" 
                alt="Delete icon" 
                src="/delete-icon.svg" 
                onClick={() => handleDelete(post.post_id)} 
              />
            </div>
          </div>

          {editingPostId === post.post_id ? (
            <form onSubmit={handleEditSubmit} className="w-full p-4 text-left bg-gray-50 rounded-b-xl">
              <div className="mb-8">
                <input
                  type="text"
                  name="caption"
                  value={editFormData.caption}
                  onChange={handleEditChange}
                  placeholder="Enter title here..."
                  className="w-full py-4 text-xl border-b font-semibold text-black text-solid"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  placeholder="Enter your content details here..."
                  rows="5"
                  className="w-full text-lg h-[400px] border-black outline-none"
                  required
                ></textarea>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <label htmlFor="image_file" className="cursor-pointer flex items-center">
                    <img src="/upload-image-icon.svg" alt="Upload" className="w-8 h-8 mr-2" />
                    <span>{editFormData.image_file ? editFormData.image_file.name : 'No file chosen'}</span>
                  </label>
                  <input
                    type="file"
                    id="image_file"
                    name="image_file"
                    onChange={handleEditChange}
                    className="hidden"
                  />
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                    Save
                  </button>
                  <button 
                    type="button" 
                    className="px-3 py-2 bg-gray text-white rounded-lg"
                    onClick={() => setEditingPostId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
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
                <button className="flex items-center text-blue-500">
                  <img src="/like-icon.svg" alt="Like" className="w-5 h-5 mr-2" />
                  {post.likes} Likes
                </button>
                <button className="flex items-center text-gray-500">
                  <img src="/comment-icon.svg" alt="Comment" className="w-5 h-5 mr-2" />
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
