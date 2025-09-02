import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Other state for author, etc.

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  // Add other fields like author_uid, post_type, etc.
  
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await axios.post('http://localhost:8000/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Post created successfully!', response.data);
    // You can now clear the form or provide a success message
    
  } catch (error) {
    console.error('Error creating post:', error.response.data);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;