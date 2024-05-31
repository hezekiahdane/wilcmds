import React, { useState, useEffect } from 'react';
import { client } from '../Url';
import AdminAnalytics from '../analytics/AdminAnalytics';

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
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

    const fetchTotalLikes = async () => {
      try {
        const response = await client.get('/total-likes');
        setTotalLikes(response.data.total_likes);
      } catch (err) {
        console.error('Failed to fetch total likes:', err);
      }
    };

    const fetchTotalDownloads = async () => {
      try {
        const response = await client.get('/total-downloads');
        setTotalDownloads(response.data.total_downloads);
      } catch (err) {
        console.error('Failed to fetch total downloads:', err);
      }
    };

    fetchPosts();
    fetchTotalLikes();
    fetchTotalDownloads();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); 
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
    <div className="min-h-screen bg-silver text-black">
      <div className="relative text-left text-xl pt-12 pl-16 -mb-8">
        <b>Welcome, Admin</b>
        <div className="text-[15px] text-dimgray">
          Today is {formattedDate}, {formattedTime}
        </div>
      </div>
      <AdminAnalytics totalLikes={totalLikes} totalDownloads={totalDownloads} />
    </div>
  );
};

export default Analytics;
