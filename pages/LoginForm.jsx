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
        <div>
            <div>
                <p>Login</p>
            </div>
            <form action="" onSubmit={handleSubmit}>
                { errors.detail &&(
                    <p className='text-red-500 text-sm text-center'>{errors.detail}</p>
                )}
                <div>
                    <input type="email" name="email" placeholder="email" onChange={handleChange} />
                </div>
                <div>
                    <input type="password" name="password" placeholder="password" onChange={handleChange} />
                </div>
                <div>
                    <button type='submit'>Login</button>
                </div>
            </form>
        </div>
    )
}