import { useState } from 'react';
import API from '../src/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

import { toast } from 'sonner';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function Login(){
    const {setUser} = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    {/*navigate e.g navigate('/signup'); */}

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    

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
        setLoading(true)
        setErrors({})

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
            
            const backendError = error.response?.data?.detail || error.response?.data?.error || "Invalid credentials"
            setErrors({detail: backendError});
            
        } finally {
            setLoading(false)
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
                    <input className={inputClass} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete='email' disabled={loading} required/>
                </div>
                <div className='relative'>
                    <input className={inputClass} type={showPassword ? "text" : "password"} name="password" value={formData.password} placeholder="Password" onChange={handleChange} disabled={loading} autoComplete='current-password'/>
                    <Button
                    type = 'button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-2 top-2 h-8 w-8 items-center justify-center hover:bg-transparent bg-secondary'
                    onClick={()=> setShowPassword((prev) => !prev)}
                    >{showPassword ? (
                        <EyeOff className='h-4 w-4'/>
                    ): (
                        <Eye className='h-4 w-4'/>
                    )}</Button>
                </div>
                <div>
                    {/* <button className='bg-primary w-full rounded-lg text-primary-foreground text-[14px] px-5 py-2.5 text-center' type='submit'>Login</button> */}
                    <Button type='submit' className='w-full hover:cursor-pointer' disabled={loading}>
                        {loading ? (
                            <>
                            <Loader2 className='mx-auto h-5 w-5 animate-spin'/>
                            </>
                        ):(
                            "Login"
                        )}
                        </Button>
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