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
      <div className="fixed h-full w-[15%] bg-white flex flex-col pt-8 shadow-lg">
        <div className="ml-6 w-56 text-center mb-8">
          <Link to="/admin/home">
            <img src={Logo} alt="WIL Logo" />
          </Link>
        </div>

        <nav className="flex flex-col flex-grow">
          {nav.map((item, index) => (
            <Link key={index} to={item.href} className="flex-grow">
              <div
                className={`flex items-center justify-center py-8 mx-8 my-4 rounded-lg ${
                  isActive(item.href)
                    ? "text-white bg-yellow shadow-md rounded-2xl"
                    : "text-gray-700 hover:text-yellow hover:bg-gray-100"
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div className="ml-[15%]">
        <Outlet />
      </div>
    </>
  );
};

export default AdminNavbar;
