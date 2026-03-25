import { useState } from 'react';
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
            }, 4000);
            onClose()
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
            if (res.data.url){
                //redirect to 200k url
                window.location.href = res.data.url
            }
        } catch{
            toast.error('Could Not Reach stripe Checkout')
            
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className='fixed inset-0  backdrop-blur-sm items-center justify-center z-50 p-4'>
            <Card className=''>
                <Button
                variant='ghost'
                size='icon'
                className='absolute right-2 top-2'
                onClick={onClose}
                disabled={loading}
                >
                    <X className='h-3 w-4'/>
                </Button>
                <CardHeader>
                    <CardTitle>
                        Select Payment Method
                    </CardTitle>
                    <p>Order #{order.id} Total: Ksh {order.total_price}</p>
                </CardHeader>
                <CardContent>
                    {/* mpesa button */}
                    <Button
                    variant='outline'
                    onClick={handleMpesaPayment}
                    disabled={loading}
                    >
                        <div>
                            <Phone size={24}/>
                        </div>
                        <div>
                            <p>M-PESA</p>
                        </div>

                    </Button>
                    {/* stripe button */}
                    <Button
                    variant='outline'
                    onClick={handleStripePayment}
                    disabled={loading}
                    >
                        <div>
                            <CreditCard size={24}/>
                        </div>
                        <div>
                            <p>Card / Paypal</p>
                        </div>

                    </Button>
                    {/* {loading &&(
                        <div className='flex items-center justify-center gap-2 text-sm'>
                            <Loader2 className='w-4 h-4 animate-spin'/> Processing request ...
                        </div>
                    )} */}
                </CardContent>
                <CardFooter>
                    <Button
                    variant='ghost'
                    onClick={onClose}
                    disabled={loading}
                    >

                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}