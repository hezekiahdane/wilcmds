import { useState, useEffect } from 'react';
import { client } from '../Url';
import AdminPost from './AdminPost';

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await client.get('/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="relative text-center text-lg bg-silver text-black">
      <div className="relative text-left text-xl pt-12 pl-16 -mb-8">
        <b>Welcome, Admin</b>
        <div className="text-[15px] text-dimgray">
          Today is {formattedDate}, {formattedTime}
        </div>
      </div>
      <AdminPost posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default Admin;
