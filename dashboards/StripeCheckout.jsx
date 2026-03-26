import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';

import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


export default function StripeCheckout(){
    const location = useLocation()
    const {clientSecret} = location.state || {} //store backend

    const {theme, resolvedTheme} = useTheme()
    const isDark = (resolvedTheme || theme) === 'dark'
    const navigate = useNavigate()

    if (!clientSecret){
        return(
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <p>No active Session</p>
                <Button onClick={()=>navigate(-1)}>Go Back</Button>
            </div>
        )
    }

    //themes for stripe
    const appearance = {
        theme: isDark ? 'night' : 'stripe',
        variables: {
            colorPrimary: isDark ? '#eceef2' : '#46a758',
            colorBackground: isDark ? '#1a1d23' : '#1a1d23',
            colorText: isDark ? '#f8fafc' : '#1a1d23',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '10px',
        }
    } 

    // stripe embed ui
    return(

        <div className='min-h-screen bg-background text-foreground flex flex-col'>
            <div className='p-4 border-b flex items-center gap-3'>
                <Button
                onClick={()=> navigate(-1)}
                >
                    <ArrowLeft className='h-5 w-5'/>
                <p className='font-bold text-lg'>Complete Payment</p>
                </Button>

            </div>

                <main className='flex-1 flex justify-center p-4 md:p-8'>
                    <div className='w-full max-w-3xl'>
                    <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{clientSecret}}
                    appearance={appearance}
                    key={`${clientSecret}-${isDark}`}
                    >
                    <EmbeddedCheckout/>
                    </EmbeddedCheckoutProvider>
                    </div>
                </main>
        </div>
    )
}
