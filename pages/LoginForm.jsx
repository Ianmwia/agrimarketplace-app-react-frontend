import { useState } from 'react';
import API from '../src/api';

export default function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

         try {
            await API.post('login/', formData);
            {/*alert */}
            alert('Logged In Successfully')

        } catch (error) {
            
        console.log(error, 'Invalid email or password')
           
        }
    };


    return (
        <div>
            <div>
                <p>Login</p>
            </div>
            <form action="" onSubmit={handleSubmit}>
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