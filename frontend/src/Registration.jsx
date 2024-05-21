import { useState } from 'react';
import { client } from './Url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import check from '/Check.svg'


const Registration = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [toast, setToast] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    function submitRegistration(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            handleToast("Passwords do not match.");
            setIsError(true);
            return;
        }
        try {
            client.post(
                "/register",
                {
                    email: email,
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    password: password
                }
            ).then((response) => {
                if (response.status === 201) {
                    alert('Account created successfully!');
                    navigate("/login");
                }
            }).catch((error) => {
                console.error(error.response.data);
                if (error.response.data && error.response) {
                    const invalidToast = error.response.data;
                    handleToast(invalidToast);
                    setIsError(true);
                }
            });
        } catch (error) {
            console.error("An unexpected error occured during the HTTP request.", error);
        }
    }

    function handleToast(toast) {
        setToast(toast);
    }

    return (
        <>
            <div className='flex items-center justify-center h-screen w-full'>
                <div className='border-2 border-black rounded-xl z w-96'>
                    <div className='flex flex-col p-8 space-y-6'>
                        <div className='text-2xl font-medium pb-4'>
                            Sign up
                        </div>
                        <span id='span_toast' className={`text-[12px] w-full py-1  ${isError ? 'border-red-600 text-red-600' : 'border-green-600 text-green-600'}  text-center rounded border ${toast ? '' : 'hidden'}`}>{toast}</span>

                        <form className='grid gap-4' onSubmit={e => submitRegistration(e)}>

                            {/* Email Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faEnvelope} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder='Email' />
                            </div>

                            {/* Username Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faUser} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='text'
                                    name='username'
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder='Username' />
                            </div>

                            {/* Password Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faLock} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='password'
                                    name='password'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder='Password' />
                            </div>

                            {/* Confirm Password Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faLock} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='password'
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm Password' />
                            </div>

                            {/* Firstname Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faUser} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='text'
                                    name='firstname'
                                    value={firstname}
                                    onChange={e => setFirstname(e.target.value)}
                                    placeholder='First Name' />
                            </div>

                            {/* Lastname Field */}
                            <div className='border-2 border-black w-full rounded-xl flex flex-row relative'>
                                <FontAwesomeIcon icon={faUser} className='absolute top-[14px] left-[12px] text-custom-gray' />
                                <input
                                    className=' text-sm pl-10 py-3 placeholder-custom-gray peer bg-inherit w-full border-none rounded text-custom-gray focus:outline-none'
                                    type='text'
                                    name='lastname'
                                    value={lastname}
                                    onChange={e => setLastname(e.target.value)}
                                    placeholder='Last Name' />
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
                                className='py-2 mt-4 border-none rounded-xl text-white bg-yellow hover:bg-black hover:text-white'>Sign Up</button>
                        </form>


                    </div>
                </div>
            </div>
        </>
    )
}

export default Registration;
