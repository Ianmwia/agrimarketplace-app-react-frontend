import { useState } from 'react';
import API from '../src/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

import { Toast } from 'radix-ui';
import { toast } from 'sonner';

import { Link } from 'react-router-dom';

export default function Login(){
    const {setUser} = useAuth()

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
            const res = await API.post('login/', formData);
            setUser(res.data)

            const userRole = res.data.role
            {/*alert */}
            //alert('Logged In Successfully')
            //toast
            toast.success('Logged in Successfully')
            {/*redirect navigate */}
            if (userRole === 'farmer'){
                navigate('/farmer')
            } else if (userRole === 'field_officer'){
                navigate('/field_officer')
            } else if (userRole === 'buyer'){
                navigate('/market')
            } else {
            navigate('/profile') //fallback default
            }

        } catch (error) {
            
            setErrors(error.response?.data || {detail: "invalid credentials"});
           
        }
    };

    const inputClass = 'bg-background border border-input text-foreground rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all'


    return (
        <div className='p-2 flex min-h-screen items-center justify-center'>
        <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 bg-card rounded-lg shadow md:space-x-2 lg:py-0'>
            <div className='mt-3'>
                <p className='text-xl font-bold text-center leading-tight tracking-tight text-foreground p-2'>Login</p>
            </div>
            <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                { errors.detail &&(
                    <p className='text-destructive text-sm text-center'>{errors.detail}</p>
                )}
                <div>
                    <input className={inputClass} type="email" name="email" placeholder="email" onChange={handleChange} />
                </div>
                <div>
                    <input className={inputClass} type="password" name="password" placeholder="password" onChange={handleChange} />
                </div>
                <div>
                    <button className='bg-primary w-full rounded-lg text-primary-foreground text-[14px] px-5 py-2.5 text-center' type='submit'>Login</button>
                </div>
            </form>
            <div className='flex flex-col md:flex-row md:items-center md:mx-auto'>
            <div className='p-2'>
                <p className='text-sm font-light text-muted-foreground'>Don't have an account? <Link to="/signup" className='text-sm font-medium text-primary'>Sign Up here</Link></p>
            </div>
            <div className='pl-2'>
                <p className='text-sm font-light text-muted-foreground'><Link to="/forgot-password" className='text-sm font-medium text-primary'>Forgot Password?</Link></p>
            </div>
            </div>
        </div>
        </div>
    )
}