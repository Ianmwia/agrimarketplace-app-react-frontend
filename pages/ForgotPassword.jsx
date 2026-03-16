import { useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPassword(){
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await API.post('auth/password/reset', {email})
            toast.success('Reset Link has been sent to your email')
        } catch {
            toast.error('Something Went Wrong, link not sent')       
        }finally {
            setLoading(false)
        }
    }

    return(
        <div className='p-2 flex min-h-screen items-center justify-center'>
            <div className='w-full m-2 md:w-1/2 lg:w-3/7 flex flex-col p-2 space-y-2 bg-card rounded-lg shadow md:space-x-2 lg:py-0'>
                <h2 className='text-xl font-bold text-center leading-tight tracking-tight text-foreground p-2'>Reset Password</h2>
                <p className='text-center'>Enter Your Email to receive a reset link</p>

                <form className='p-3 space-y-4' action="" onSubmit={handleSubmit}>
                    <Input
                    type='email'
                    placeholder='enter your email'
                    required
                    onChange={(e)=> setEmail(e.target.value)}
                    />
                    <Button
                    disabled={loading}>
                    {loading ? 'Sending...' : "Send Reset Link"}

                    </Button>
                </form>
            </div>
        </div>
    )
}