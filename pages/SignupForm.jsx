import { useEffect, useState } from 'react';
import API from '../src/api';

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
            alert('account created successfully')
            {/*redirect */}
            {/*clear formdata */}
            setFormData([])

        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }else{
                setErrors({ non_field_errors: 'An unexpected error occurred'})
            }
        }
    };

    return(
        <div className='p-2 flex min-h-screen items-center justify-center'>
        <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 md:space-x-2 lg:py-0 bg-gray-50 rounded-lg shadow'>
            <div className=''>
                <p className='text-xl font-bold text-center leading-tight tracking-tight p-2'>Create an account</p>
            </div>
            <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                { errors.non_field_errors && (
                    <p className='text-red-600 text-sm text-center mb-2'>{errors.non_field_errors}</p>
                )}
                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="text" name="first_name" placeholder="first name" onChange={handleChange} />
                </div>
                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="text" name="last_name" placeholder="last name" onChange={handleChange} />
                </div>
                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="email" name="email" placeholder="email" onChange={handleChange} required autoComplete='email' />
                </div>
                <div>
                    {errors.password && (
                        <p className='text-red-600 text-sm text-center mb-2'>{errors.password?.[0]}</p>
                    ) }
                    <input className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5 ${errors.password ? 'border-red-500': 'border-gray-300'}`} type="password" name="password" placeholder="password" onChange={handleChange} required autoComplete='new-password'/>
                </div>
                <div>
                    <select className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' name="role" value={formData.role} onChange={handleChange}>
                        <option value="">Select Role</option>
                        {roleOptions.map((r)=> (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <div>
                    {formData.role === 'field_officer' && (
                    <select className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' name="field" value={formData.field} onChange={handleChange}>
                        <option value="">Select Field</option>
                        {fieldOptions.map((f)=> (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                    )}
                </div>

                <div>
                    <input className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5' type="text" name="location" placeholder="location" onChange={handleChange} />
                </div>
                <div>
                    <button className='bg-green-500 w-full rounded-lg text-white text-[14px] px-5 py-2.5 text-center' type='submit'>Register</button>
                </div>
            </form>
            <div className='p-2'>
                <p className='text-sm font-light text-gray-500'>Already have an account? <a href="" className='text-sm font-medium text-green-500'>Register here</a></p>
            </div>
        </div>
        </div>
    )

}