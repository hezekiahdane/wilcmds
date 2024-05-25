import React, { useContext, useState } from "react";
import { client } from "../Url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";
import check from '/Check.svg'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [toast, setToast] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [redirectToAdminDashboard, setRedirectToAdminDashboard] = useState(false);

  function submitLogin(e) {
    e.preventDefault();
    client.post("/login", {
      email: email,
      password: password,
    })
    .then(function (res) {
      console.log(res.data);
      setCurrentUser(res.data); // Assuming res.data contains the user data
      if (res.data.is_staff) {
        setRedirectToAdminDashboard(true); // Redirect to admin dashboard if is_staff is true
      } else {
        setCurrentUser(true); // Set user logged in state
      }
    })
    .catch((error) => {
      console.error(error.response.data);
      const invalidToast = error.response.data.detail || 'User does not exist.';
      handleToast(invalidToast);
      setIsError(true);
    });
  }

  if (redirectToAdminDashboard) {
    return <Navigate to="/admin/home" />; // Redirect to the admin dashboard
  }

  if (currentUser && !redirectToAdminDashboard) {
    return <Navigate to="/" />; // Redirect to the home page for regular users
  }

  function handleToast(toast) {
    setToast(toast);
  }
  
  return (
    <>
      <div className="flex items-center justify-center h-screen w-full">
        <div className="border-2 border-black rounded-2xl w-96">
          <div className="flex flex-col p-8 space-y-6">
            <div className="text-2xl font-semibold">
              Sign In
            </div>
            <span
              id="span_toast"
              className={`text-[12px] w-full py-1 ${
                isError ? "border-red-600" : "hidden"
              }  text-center rounded border text-red-600 ${
                toast ? "" : "hidden"
              }`}
            >
              {toast}
            </span>

            <form className="grid gap-4" onSubmit={(e) => submitLogin(e)}>
              {/* Email Field */}
              <div className="border-2 border-black w-full rounded-xl flex flex-row relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute top-[14px] left-[12px]"
                />
                <input
                  className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none' 
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              {/* Password Field */}
              <div className="border-2 border-black w-full rounded-xl flex flex-row relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute top-[14px] left-[12px] text-custom-gray"
                />
                <input
                  className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none' 
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div className="w-80 h-5 ml- justify-start items-center flex">
                <div>
                    <img src={check} alt="check mark" />
                </div>
                <span className="text-xs font-normal ml-4 mt-1 font-['Poppins']">I accept </span>
                <span className="text-yellow text-xs ml-1 mt-1 font-normal font-['Poppins']"> terms and conditions</span>
                <span className="text-xs ml-1 mt-1 font-normal font-['Poppins']"> & privacy policy</span>
              </div>


            
              <button
                type="submit"
                className="py-2 mt-4 border-none rounded-xl text-white bg-yellow hover:bg-black hover:text-white"
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
