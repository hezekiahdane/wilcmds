import React from 'react';
import PropTypes from 'prop-types';


const AdminAnalytics = ({ totalLikes }) => {
  return (
    <div className="min-h-screen overflow-hidden text-left text-xl text-dimgray">
      <div className="flex flex-wrap justify-center gap-28 mt-14 mx-16">
        {[
          { label: 'Followers', value: '3.1k', src: '/group-19.svg' },
          { label: 'Likes', value: totalLikes, src: '/iconparkoutlinelike.svg' },
          { label: 'Impressions', value: '5.6k', src: '/group-24.svg' },
        ].map((stat, index) => (
          <div key={index} className="w-[256px] h-[256px] shadow-lg rounded-2xl bg-white flex flex-col items-center justify-center">
            <img className="w-24 h-24" alt={stat.label} src={stat.src} />
            <div className="mt-4">{stat.value} {stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex mt-8 justify-center w-full">
        <div className="w-[90%] md:w-[990px] h-[500px] shadow-lg rounded-2xl bg-white relative">
          <b className="absolute top-6 left-8">Facebook followers</b>
        </div>
      </div>
    </div>
  );
};

AdminAnalytics.propTypes = {
  totalLikes: PropTypes.number.isRequired,
};

export default AdminAnalytics;
