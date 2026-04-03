import { useEffect, useState } from 'react';
import API from '../src/api';
import { Navigate, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function SignUp(){
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "",
        field: "",
        location: "",
    });
    const {setUser} = useAuth()

    const [errors, setErrors] = useState({})
    const [roleOptions, setRoleOptions] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])   
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(()=> {
        API.get("user-choices").then(res=> {
            setRoleOptions(res.data.roles);
            setFieldOptions(res.data.fields);
        });
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev)=>{
            const newData = {...prev, [name]: value};
            
            if (name === 'role' && value !== 'field_officer'){
                newData.field = '';
            }
            return newData;
        });

        

        setErrors({})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)


        try {
            const res = await API.post('register/', formData);
            //log the user in
            setUser(res.data)

            const userRole = res.data.role
            {/*alert */}
            //alert('account created successfully')
            //toast sonner
            toast.success('Account Created Successfully')
            {/*redirect */}
            {/*clear formdata */}
            setFormData({})
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
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }else{
                setErrors({ non_field_errors: 'An unexpected error occurred'})
            }
        }
    };

    const ringGlow = 'bg-background border border-input text-foreground rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all'

    return(
        <div className='p-2 flex min-h-screen items-center justify-center'>
        <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 md:space-x-2 lg:py-0 bg-card border-border rounded-lg shadow'>
            <div className=''>
                <p className='text-xl font-bold text-center leading-tight tracking-tight p-2'>Create an account</p>
            </div>
            <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                { errors.non_field_errors && (
                    <p className='text-destructive text-sm text-center mb-2'>{errors.non_field_errors}</p>
                )}
                <div>
                    <input className={ringGlow} type="text" name="first_name" placeholder="first name" onChange={handleChange} />
                </div>
                <div>
                    <input className={ringGlow} type="text" name="last_name" placeholder="last name" onChange={handleChange} />
                </div>
                <div>
                    <input className={ringGlow} type="email" name="email" placeholder="email" onChange={handleChange} required autoComplete='email' />
                </div>
                <div className='relative'>
                    {errors.password && (
                        <p className='text-destructive text-sm text-center mb-2'>{errors.password?.[0]}</p>
                    ) }
                    <input className={`${ringGlow} ${errors.password ? 'border-destructive': 'border-input'}`} type={showPassword ? "text" : "password"} name="password" placeholder="password" onChange={handleChange} required autoComplete='new-password'/>
                    <Button
                    type = 'button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-2 top-2 h-8 w-8 items-center justify-centre hover:bg-transparent bg-secondary'
                    onClick={()=> setShowPassword((prev) => !prev)}
                    >{showPassword ? (
                        <EyeOff className='h-4 w-4'/>
                    ): (
                        <Eye className='h-4 w-4'/>
                    )}</Button>

                </div>
                <div className='relative w-full'>
                    <select className={`${ringGlow} appearance-none pr-10`} name="role" value={formData.role} onChange={handleChange}>
                        <option value="">Select Role</option>
                        {roleOptions.map((r)=> (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <div className='pointer-events-none absolute flex right-2 rounded-sm top-2 h-8 w-8 items-center justify-center bg-secondary'>
                        <ChevronDown className='h-4 w-4'/>
                    </div>
                </div>
                <div>
                    {formData.role === 'field_officer' && (
                    <select className={ringGlow} name="field" value={formData.field} onChange={handleChange}>
                        <option value="">Select Field</option>
                        {fieldOptions.map((f)=> (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                    )}
                </div>

                <div>
                    <input className={ringGlow} type="text" name="location" placeholder="location" onChange={handleChange} />
                </div>
                <div>
                    <button className='bg-primary w-full rounded-lg text-primary-foreground hover:opacity-90 transition-colors text-[14px] px-5 py-2.5 text-center hover:cursor-pointer' type='submit' disabled={loading}>
                        {loading ? (
                            <>
                            <Loader2/>
                            </>
                        ):(
                            "Register"
                        )}
                        </button>
                </div>
            </form>
            <div className='p-2'>
                <p className='text-sm font-light text-muted-foreground'>Already have an account? <Link to='/login' className='text-sm font-medium text-primary'>Login here</Link></p>
            </div>
        </div>
        </div>
    )

}