import React, { useContext, useEffect, useState } from "react";
import { client } from "./Url";
import { UserContext } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import profileIcon from '../images/profile_placeholder.jpg'

const ManageProfile = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [userProfile, setUserProfile] = useState("");
  
  // Declares the path of the avatar placeholder
  const profilePlaceholder = profileIcon;

  const baseUrl = "http://localhost:8000";

  //The profile placeholder is displayed if the user did not upload a profile
  const imagePath = userProfile ? userProfile : profilePlaceholder;

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    user_profile: null,
  });


  const fetchUserData = async () => {
    try {
      const response = await client.get("/user");
      const userData = response.data;

      console.log("User:", userData);
      setUserProfile(userData.user_profile);

      setFormData({
        username: userData.username,
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        password: userData.password,
      });

    } catch (error) {
      console.error("Error fetching the data: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "user_profile" && files) {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: files[0] }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    //Conditionally append the formData if the value is null or not
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" || value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      //gets the token from the browser

      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        .split("=")[1];

      const response = await client.put("/user/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });

      window.location.reload(); //reloads the page after update
    } catch (error) {
      console.error("Error updating the profile: ", error);
    }
  };

  return (
    <>
      <div className="flex ml-96 mt-24">
        <div className="mt-20 text-lg ">
          <div className="text-lg font-bold 2xl:text-xl mb-20">Profile Settings</div>
          <form
            onSubmit={handleSubmit}
            className="flex justify-center gap-10"
          >
            <div className="flex flex-col items-start space-y-16">
              <div className="relative flex gap-10">
                {/* Username */}
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="px-4 py-3 mt-8 border rounded-lg peer focus:outline-none focus:border-yellow"
                />
                <label
                  htmlFor="username"
                  className="absolute left-0 text-sm font-light -top-3 peer-focus:text-yellow"
                >
                  Username
                </label>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-3 mt-8 border rounded-lg peer focus:outline-none focus:border-yellow"
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 text-sm font-light -top-3 peer-focus:text-yellow"
                  >
                    Email
                  </label>
                </div>
              </div>

              {/* Firstname */}
              <div className="relative flex flex-row items-start gap-10">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="px-4 py-3 mt-8 border rounded-lg peer focus:outline-none focus:border-yellow"
                />
                <label
                  htmlFor="firstname"
                  className="absolute left-0 text-sm font-light -top-3 peer-focus:text-yellow"
                >
                  First Name
                </label>

               {/* Lastname */}
                <div className="relative ">
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="px-4 py-3 mt-8 border rounded-lg peer focus:outline-none focus:border-yellow"
                  />
                  <label
                    htmlFor="lastname"
                    className="absolute left-0 text-sm font-light -top-3 peer-focus:text-yellow"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="relative flex flex-row items-start gap-10">
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="px-4 py-3 mt-8 border rounded-lg peer focus:outline-none focus:border-yellow"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 text-sm font-light -top-3 peer-focus:text-yellow"
                  >
                    Password
                  </label>
                </div>
              </div> 

              <button
                type="submit"
                className="px-16 py-3 mt-8 text-sm border-none rounded outline-none justify-start text-yellow ring-1 ring-yellow hover:bg-yellow hover:text-white "
              >
                Confirm Changes
              </button>

            </div>

            <div className="flex flex-col gap-10 ml-20">
              <label htmlFor="user_profile">Change Profile</label>
              <label
                htmlFor="user_profile"
                className="flex flex-col gap-8 cursor-pointer"
              >
                {formData.user_profile ? (
                  <img
                    src={URL.createObjectURL(formData.user_profile)}
                    alt="profile picture"
                    className="rounded-full object-cover cursor-pointer w-[150px] h-[150px] border border-yellow hover:border-black"
                  />
                ) : (
                  <img
                    src={baseUrl + imagePath}
                    alt="profile picture"
                    className="rounded-full object-cover cursor-pointer w-[150px] h-[150px] border border-yellow hover:border-black"
                  />
                )}
                
                <span className="duration-75 hover:border-b-2 hover:text-yellow hover:border-b-yellow">
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Upload Profile
                </span>
                <input
                  id="user_profile"
                  type="file"
                  name="user_profile"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageProfile;
