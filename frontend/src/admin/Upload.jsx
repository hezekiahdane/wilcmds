import React, { useState } from 'react';
import { client } from '../Url';

function Upload() {
  const [formData, setFormData] = useState({
    caption: '',
    description: '',
    image_file: null
  });

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
  }

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

    const csrftoken = getCookie('csrftoken');

    client.post('http://localhost:8000/posts', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken
      }
    })
    .then(response => {
      setFormData({
        caption: '',
        description: '',
        image_file: null
      });
      console.log('Post added:', response.data);
      alert('Post added successfully!');
    })
    .catch(error => {
      console.error('Error adding post:', error);
      alert('Failed to add post');
    });
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex justify-center items-center">
      <div className="w-full max-w-2xl p-8 shadow-lg border rounded-2xl flex flex-col items-center relative bg-white">
        <div className='mb-12'>
          <img
            className="cursor-pointer absolute top-4 right-4"
            alt="Close"
            src="/close-button.svg"
            onClick={() => alert('Close button clicked!')}
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-8">
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Enter title here..."
              className="w-full px-2 py-4 text-xl border-b font-semibold text-black text-solid"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter your content details here..."
              rows="5"
              className="w-full px-2 py-1 text-lg h-[400px] border-black outline-none"
              required
            ></textarea>
          </div>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="image_file" className="cursor-pointer flex items-center">
                <img src="/upload-image-icon.svg" alt="Upload" className="w-8 h-8 mr-2" />
                <span>{formData.image_file ? formData.image_file.name : 'No file chosen'}</span>
              </label>
              <input
                type="file"
                id="image_file"
                name="image_file"
                onChange={handleChange}
                className="hidden"
              />
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-2xl font-medium">
              Post
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Upload;
