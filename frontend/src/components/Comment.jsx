import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ time, username, text, userProfile, onDelete, currentUser, commentUserId }) => {
  console.log('Comment Props:', { currentUser, commentUserId });  // Check props in Comment component
  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-2xl mb-4">
      <img
        className="w-10 h-10 object-cover rounded-full"
        alt=""
        src={userProfile ? `http://localhost:8000${userProfile}` : "/profile@2x.png"}
      />
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <div>
            <span className="justify-start font-medium">{username}</span>
            <div className="text-sm font-light text-gray-500">{time}</div>
          </div>
          {currentUser && currentUser.user_id === commentUserId && (
            <button onClick={onDelete} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          )}
        </div>
        <span className="text-md mt-2">{text}</span>
      </div>
    </div>
  );
};

Comment.propTypes = {
  time: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  userProfile: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  commentUserId: PropTypes.number.isRequired
};

Comment.defaultProps = {
  username: 'Anonymous',
  userProfile: '/profile@2x.png'
};

export default Comment;
