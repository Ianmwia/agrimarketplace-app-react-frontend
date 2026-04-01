import { useState} from 'react';
import API from '@/api';

import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CreditCard, Phone, Loader2 } from 'lucide-react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';



export default function PaymentMethod({order, onClose, User, fetchMarketData}){
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    //mpesa payment
    const handleMpesaPayment = async () => {
        
        if(!User?.phone){
            toast.error('Before paying, Please add a phone number to your profile account')
            setTimeout(() => {
                navigate('/profile')
                onClose()
            }, 4000);
            
            return
        }

        setLoading(true)
        try {
        toast.info("Check your phone for the M-Pesa prompt");
        const res = await API.post(`order/${order.id}/pay/`);

        if (res.data.CheckoutRequestID) {
            toast.success("STK Push sent successfully!");
            // Refresh to show any status changes
            fetchMarketData();
            onClose()
        }
        } catch (error) {
        toast.error(error.response?.data?.error || "Payment failed to initiate");
        }finally{
            setLoading(false)
        }
    };
    //handle stripe
    const handleStripePayment = async () => {
        setLoading(true)
        try {
            const res = await API.post(`stripe/pay/`, {order_id: order.id})
            if (res.data.clientSecret){
                navigate('/stripe-checkout', {
                    state: {
                        clientSecret: res.data.clientSecret,
                        orderId: order.id
                    }

                })
                onClose()
            }
        } catch{
            toast.error('Could Not Reach stripe Checkout')
            
        }finally{
            setLoading(false)
        }
    }


    return(
        <div className='flex items-center justify-center fixed inset-0  backdrop-blur-sm z-50 p-4'>
            <Card className='relative w-full max-w-md shadow-lg'>
                <Button
                variant='ghost'
                size='icon'
                className='absolute right-2 top-2 h-8 w-8'
                onClick={onClose}
                disabled={loading}
                >
                    <X className='h-3 w-4'/>
                </Button>
                <CardHeader className='space-y-4'>
                    <CardTitle>
                        <p className='text-center font-bold text-xl'>Select Payment Method</p>
                    </CardTitle>
                    <p>Order #{order.id} Total: Ksh {order.total_price}</p>
                </CardHeader>
                <CardContent className='pt-6'>
                    {/* mpesa button */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Button
                    variant='outline'
                    onClick={handleMpesaPayment}
                    className='flex items-center justify-center gap-3 h-10'
                    disabled={loading}
                    >
                        <div>
                            <Phone size={20} className='shrink-0'/>
                        </div>
                        <div>
                            <p className='font-medium'>M-PESA</p>
                        </div>

                    </Button>
                    {/* stripe button */}
                    <Button
                    variant='outline'
                    onClick={handleStripePayment}
                    className='flex items-center justify-center gap-3 h-10'
                    disabled={loading}
                    >
                        <div>
                            <CreditCard size={20} className='shrink-0'/>
                        </div>
                        <div>
                            <p className='font-medium'>Card / Paypal</p>
                        </div>

                    </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    
                </CardFooter>
            </Card>

        </div>
    )
}