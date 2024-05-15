import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "/WIL-logo-admin.png";

const AdminNavbar = () => {

  const location = useLocation();
  const isActive = (itemHref) => location.pathname === itemHref;
  const nav = [
    { name: "Upload", href: "/admin/upload" },
    { name: "Home", href: "/admin/home" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Manage Profile", href: "/admin/settings" },
    { name: "Log Out", href: "/admin/log-out" },


  ];

  return (
    <>
    <div className="absolute h-[full] w-[15%] 2xl:text-lg bg-white flex flex-col pt-8 shadow-2xl">
        <div className="m-6 object-scale-down w-60 text-center justify-center">
            <Link to="/admin/home">
              <img src={Logo} alt="WIL Logo"/>
            </Link></div>

        {nav.map((item, index) => (
          <ul key={index}>
            <li>
              <Link to={item.href}>
                <div className={`text-center p-8 m-8 hover:text-yellow 
                  ${isActive(item.href) ? 'text-white border-2 bg-yellow rounded-2xl p-6 m-6 hover:text-black hover:border-none' : ''}`}>
                 {/* <img src={item.icon} alt={`${item.name} Icon`} className="inline-block h-6 w-6 mr-2" /> */ } 
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

export default AdminNavbar;
