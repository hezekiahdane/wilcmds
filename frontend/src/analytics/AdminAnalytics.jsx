import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { client } from '../Url';
import Chart from 'chart.js/auto';

const AdminAnalytics = ({ totalLikes, totalDownloads }) => {
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    const fetchTotalComments = async () => {
      try {
        const response = await client.get('/total-comments');
        setTotalComments(response.data.total_comments);
      } catch (error) {
        console.log('Failed to fetch total comments:', error);
      }
    };

    fetchTotalComments();
  }, []);

  useEffect(() => {
    let myChart = null;

    const renderChart = () => {
      const ctx = document.getElementById('myChart').getContext('2d');
      if (myChart) {
        myChart.destroy(); // Destroy existing chart if it exists
      }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Likes', 'Downloads', 'Comments'],
          datasets: [{
            label: 'Count',
            data: [totalLikes, totalDownloads, totalComments],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)', // Blue for Likes
              'rgba(255, 99, 132, 0.5)', // Red for Downloads
              'rgba(255, 206, 86, 0.5)'  // Yellow for Comments
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    renderChart();

    return () => {
      if (myChart) {
        myChart.destroy(); // Cleanup: Destroy chart instance
      }
    };
  }, [totalLikes, totalDownloads, totalComments]);

  return (
    <div className="min-h-screen overflow-hidden text-left text-xl text-dimgray">
      <div className="flex flex-wrap justify-center gap-28 mt-14 mx-16">
        {[
          { label: 'Likes', value: totalLikes, src: '/like-icon.svg' },
          { label: 'Comments', value: totalComments, src: '/comment-icon.svg' },
          { label: 'Downloads', value: totalDownloads, src: '/download-icon.svg' },
        ].map((stat, index) => (
          <div key={index} className="w-[256px] h-[256px] shadow-lg rounded-2xl bg-white flex flex-col items-center justify-center">
            <img className="w-24 h-24" alt={stat.label} src={stat.src} />
            <div className="mt-4">{stat.value} {stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex mt-8 justify-center w-full">
        <div className="w-[90%] md:w-[990px] h-[500px] shadow-lg rounded-2xl bg-white relative">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </div>
  );
};

AdminAnalytics.propTypes = {
  totalLikes: PropTypes.number.isRequired,
  totalDownloads: PropTypes.number.isRequired,
};

export default AdminAnalytics;
