import { useState } from 'react';
import API from '@/api';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PasswordResetConfirm(){
    const {uid, token} = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({new_password1:'', new_password2: ''})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.new_password1 !== formData.new_password2){
            return toast.error ("The passwords do not match")
        }
        setLoading(true)

        try {
            
            await API.post('api/password/reset/confirm/', {
                uid,
                token,
                ...formData
            })
            toast.success('Password reset Successful')
            navigate('/login')
        } catch (error){
            const data = error.response?.data
            const message = 
                data?.new_password1?.[0] ||
                data?.new_password2?.[0] ||
                'Link Expired or Invalid'
            toast.error(message)       
        }finally {
            setLoading(false)
        }
    }

    return(
        <div className='p-2 flex min-h-screen items-center justify-center'>
            <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 bg-card rounded-lg shadow md:space-x-2 lg:py-0'>
                <h2 className='text-xl font-bold text-center leading-tight tracking-tight text-foreground p-2'>Set A New Password</h2>

                <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
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
                    disabled={loading}>
                    {loading ? 'Resetting...' : "Update Password"}

                    </Button>
                </form>
            </div>
        </div>
    )
}