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
                <Button onClick={()=>navigate('/market')}>Go Back</Button>
            </div>
        )
    }

    //themes for stripe
    const appearance = {
        theme: isDark ? 'night' : 'stripe',
        variables: {
            colorPrimary: isDark ? '#eceef2' : '#46a758',
            colorBackground: isDark ? '#1a1d23' : '#ffffff',
            colorText: isDark ? '#f8fafc' : '#1a1d23',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '10px',
        }
    } 

    // stripe embed ui
    return(

        <div className='min-h-screen bg-background text-foreground flex flex-col'>
            <div className='p-2 flex items-center gap-2'>
                <Button
                onClick={()=> navigate('/market')}
                >
                    <ArrowLeft className='h-5 w-5'/>
                </Button>

            </div>

                <main className={`flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-1 md:p-2 mt-2 ${isDark ? 'dark' : ''}`}>
                    <div className='w-full max-w-6xl bg-background [&iframe]:bg-transparent!'>
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
