import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const ProfileSettings = () => {

  const location = useLocation();
  const isActive = (itemHref) => location.pathname === itemHref;
  const nav = [
    { name: "Manage Profile", href: "/account-settings" },
  ];
  return (
    <>
      {/* Sidebar */}
      <div className="absolute h-[100%] top-20 w-[15%] 2xl:text-lg bg-black flex flex-col pt-8 ">
        {nav.map((item, index) => (
          <ul key={index}>
            <li>
            <Link to={item.href}>
            <div className={`text-center py-4 text-white hover:text-yellow 
                ${isActive(item.href) ? 'text-yellow bg-black-2 border-l-2 border-yellow' : ''}`}>
              {item.name}
            </div>
          </Link>
            </li>
          </ul>
        ))}
      </div>
      <Outlet />
    </>
  );
};

export default ProfileSettings;
