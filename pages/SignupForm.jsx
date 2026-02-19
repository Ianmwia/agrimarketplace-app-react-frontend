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

    const [roleOptions, setRoleOptions] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])   

    useEffect(()=> {
        API.get("user-choices").then(res=> {
            setRoleOptions(res.data.roles);
            setFieldOptions(res.data.fields);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            await API.post('register/', formData);
            {/*alert */}
            alert('account created successfully')
            {/*redirect */}
            {/*clear formdata */}
            setFormData({})

        } catch (error) {
            console.log(error)
        }
    };

    return(
        <div className='m-2 border flex flex-col'>
            <div className='bg-green-700/70'>
                <p className='text-[20px] text-white text-center p-2'>Register</p>
            </div>
            <form className='m-2' action="" onSubmit={handleSubmit}>
                <div>
                    <input className='w-full p-2 outline rounded-3xl' type="text" name="first_name" placeholder="first name" onChange={handleChange} />
                </div>
                <div>
                    <input type="text" name="last_name" placeholder="last name" onChange={handleChange} />
                </div>
                <div>
                    <input type="email" name="email" placeholder="email" onChange={handleChange} required />
                </div>
                <div>
                    <input type="password" name="password" placeholder="password" onChange={handleChange} required/>
                </div>
                <div>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="">Select Role</option>
                        {roleOptions.map((r)=> (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select name="field" value={formData.field} onChange={handleChange}>
                        <option value="">Select Field</option>
                        {fieldOptions.map((f)=> (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <input type="text" name="location" placeholder="location" onChange={handleChange} />
                </div>
                <div>
                    <button type='submit'>Register</button>
                </div>
            </form>
        </div>
    )

}