import React, { useState, useEffect } from 'react';
import {client} from '../Url';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    caption: '',
    description: '',
    image_file: null
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image_file") {
      setFormData({ ...formData, image_file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('caption', formData.caption);
    data.append('description', formData.description);
    if (formData.image_file) {
      data.append('image_file', formData.image_file);
    }

    client.post('/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setPosts([...posts, response.data]);
      setFormData({
        caption: '',
        description: '',
        image_file: null
      });
      console.log('Post added:', response.data);
    })
    .catch(error =>  { console.error('Error adding post:', error);
    alert('Failed to add post');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Add a New Post</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Caption:</label>
          <input
            type="text"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            name="image_file"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit Post
        </button>
      </form>
    </div>
  );
}

export default Posts;
