import React from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../Url';

const Logout = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/admin/home'); // Redirect to admin dashboard or previous page
  };

  const handleLogout = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];

      await client.post('/logout', {}, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      // Clear any authentication tokens or user data here
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="absolute top-[184px] left-[600px] w-[873px] h-[588px]">
      <div className="absolute top-[0px] left-[0px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-2xl bg-white w-[873px] h-[588px]" />
      <div className="absolute top-[126px] left-[213px] w-[448px] h-[336px]">

        <div className="absolute top-[calc(50%_-_168px)] left-[calc(50%_-_224px)] w-[448px] h-[214px]">
          <img
            className="absolute ml-24 object-cover"
            alt="WIL logo"
            src="/WIL-logo-admin.png"
          />
          <div className="absolute top-[calc(50%_+_77px)] left-[calc(50%_-_170px)] text-lg font-medium">
            Are you sure you want to Log Out?
          </div>
        </div>

        <div className="absolute top-[280px] left-[51px] w-[345px] h-14 flex justify-between">
          <button
            onClick={handleCancel}
            className="rounded-lg border-[2px] border-solid border-dimgray w-32 h-14 flex items-center justify-center font-medium"
          >
            No
          </button>
          <button
            onClick={handleLogout}
            className="text-white rounded-lg bg-yellow border-[2px] border-solid border-yellow w-32 h-14 flex items-center justify-center font-medium"
          >
            Yes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Logout;
