import { useEffect, useState } from 'react';
import API from '../src/api';

import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

    const [errors, setErrors] = useState({})
    const [roleOptions, setRoleOptions] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])   

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


        try {
            await API.post('register/', formData);
            {/*alert */}
            //alert('account created successfully')
            //toast sonner
            toast.success('Account Created Successfully')
            {/*redirect */}
            {/*clear formdata */}
            setFormData({})

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
                <div>
                    {errors.password && (
                        <p className='text-destructive text-sm text-center mb-2'>{errors.password?.[0]}</p>
                    ) }
                    <input className={`${ringGlow} ${errors.password ? 'border-destructive': 'border-input'}`} type="password" name="password" placeholder="password" onChange={handleChange} required autoComplete='new-password'/>
                </div>
                <div>
                    <select className={ringGlow} name="role" value={formData.role} onChange={handleChange}>
                        <option value="">Select Role</option>
                        {roleOptions.map((r)=> (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
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
                    <button className='bg-primary w-full rounded-lg text-primary-foreground hover:opacity-90 transition-colors text-[14px] px-5 py-2.5 text-center' type='submit'>Register</button>
                </div>
            </form>
            <div className='p-2'>
                <p className='text-sm font-light text-mutes-foreground'>Already have an account? <Link to='/login' className='text-sm font-medium text-primary'>Login here</Link></p>
            </div>
        </div>
        </div>
    )

}