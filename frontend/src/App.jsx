import React, { createContext } from 'react';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import  Navbar from './components/Navbar'
import { client }  from './Url';
import Home from './User/Home';
import Login from './User/Login';
import Registration from './User/Registration';
import ProfileSettings from './components/ProfileSettings';
import ManageProfile from './User/ManageProfile';
export const UserContext = createContext();
import Admin from './admin/Admin';
import AdminNavbar from './admin/AdminNavbar'
import Upload from './admin/Upload';
import Analytics from './admin/Analytics';
import AdminSettings from './admin/AdminSettings'
import Logout from './admin/Logout';

function App() {

  const [currentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    client.get("/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);


  return (
    <div className='h-screen overflow-y-auto bg-black-2'>

      <UserContext.Provider value={[currentUser, setCurrentUser]}>




      <Routes>

      {/** Admin Route */}
        <Route path="/admin" element={<AdminNavbar />}>
            <Route path='/admin/upload' element={<Upload/>}/>
            <Route path='/admin/home' element={<Admin/>}/>
            <Route path='/admin/analytics' element={<Analytics/>}/>
            <Route path='/admin/settings' element={<AdminSettings/>}/>
            <Route path='/admin/log-out' element={<Logout/>}/>
          </Route>

        {/** User Route */}
          <Route path='/' element={<Navbar/>}>
            <Route index element={<Home/>}/>
            <Route path='/signup' element={<Registration/>}/>
            <Route path='/login' element={<Login />}/>

            <Route path='/account-settings' element={<ProfileSettings/>}>
              <Route index element={<ManageProfile/>}/>
            </Route>

          </Route>

        </Routes> 
      </UserContext.Provider>
    </div>
  );
}

export default App;
