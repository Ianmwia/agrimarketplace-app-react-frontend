import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        old_password:'',
        new_password1: '',
        new_password2: '',
    })
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.new_password1 !== formData.new_password2){
            return toast.error ("The passwords do not match")
        }

        try {
            await API.post('auth/password/change', formData)
            toast.success('Password Updated SuccessFully')
            navigate('/profile')
        } catch (error){
            const data = error.response?.data
            const message = 
                data?.old_password?.[0] ||
                data?.new_password1?.[0] ||
                data?.new_password2?.[0] ||
                'Password update failed'
            toast.error(message) 
        }
    }

    return(
        <div className='p-2 flex min-h-screen items-center justify-center'>
            <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 bg-card rounded-lg shadow md:space-x-2 lg:py-0'>
                <h2 className='text-xl font-bold text-center leading-tight tracking-tight text-foreground p-2'>Change Password</h2>

                <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                    <Input
                    type='password'
                    placeholder='Current Password'
                    required
                    onChange={(e)=> setFormData({...formData, old_password : e.target.value})}
                    />
                    <Input
                    type='password'
                    placeholder='New Password'
                    required
                    onChange={(e)=> setFormData({...formData, new_password1 : e.target.value})}
                    />
                    <Input
                    type='password'
                    placeholder='Confirm New Password'
                    required
                    onChange={(e)=> setFormData({...formData, new_password2 : e.target.value})}
                    />
                    <Button
                    type='submit'
                    >
                    Update Password
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword