import { useState } from 'react';
import API from '../src/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    {/*navigate e.g navigate('/signup'); */}
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        {/*clear errors on type */}
        if (errors.detail) setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         try {
            await API.post('login/', formData);
            {/*alert */}
            alert('Logged In Successfully')
            {/*redirect navigate */}
            navigate('/dashboard')

        } catch (error) {
            
            setErrors(error.response?.data || {detail: "invalid credentials"});
           
        }
    };


    return (
        <div className='p-2 flex min-h-screen items-center justify-center'>
        <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 bg-gray-50 rounded-lg shadow md:space-x-2 lg:py-0'>
            <div>
                <p className='text-xl font-bold text-center leading-tight tracking-tight p-2'>Login</p>
            </div>
            <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                { errors.detail &&(
                    <p className='text-red-500 text-sm text-center'>{errors.detail}</p>
                )}
                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="email" name="email" placeholder="email" onChange={handleChange} />
                </div>
                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="password" name="password" placeholder="password" onChange={handleChange} />
                </div>
                <div>
                    <button className='bg-green-500 w-full rounded-lg text-white text-[14px] px-5 py-2.5 text-center' type='submit'>Login</button>
                </div>
            </form>
        </div>
        </div>
    )
}