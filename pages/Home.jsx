import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Check, ChevronRight, Users, Sprout, ShoppingBag, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home(){
return(
<div className='flex flex-col'>
    <div className='min-h-screen bg-[linear-gradient(1deg,rgba(42,123,155,0.37)_0%,rgba(242,242,242,1)_46%)] dark:bg-none dark:bg-background flex flex-col justify-center items-center p-6 text-center'>
        <div className='flex items-center justify-center px-6' >
            <div className='max-w-4xl text-center space-y-6'>
            <p className='text-4xl md:text-5xl lg:text-6xl font-bold tracking -tight '>Revolutionize Your Agricultural Value Chain with Kilimo</p>
            <p className='text-muted-foreground text-lg md:text-xl leading-relaxed'>Kilimo Agriculture MarketPlace redefines the agriculture value chain by seamlessly unifying a B2B marketplace
                with a dedicated help support ecosystem. Our platform streamlines every phase of the farm to sales journey - with tailored role based
                dashboards and transparent produce listings to help farmers sell their produce and buyers to buy produce
                without the hustle of middle men, helping both the farmer and the user get fair value of their sales and purchases. </p>
            </div>
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'> 
            <Button size='lg' className={`gap-2`}>
                <Link to='/signup'>Start Your Journey</Link></Button>
            <Button size='lg' variant='outline'
            onClick={()=>{document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}}
            >Explore Features</Button>
        </div>
    </div>

        {/*2nd min h screen */}
        <div className='py-20 px-6 bg-muted/40'>
        
            <div className='text-center space-y-4 max-w-3xl mx-auto'>
                <p className='text-3xl md:text-4xl font-bold'>Everything You need to grow and manage your harvest</p>
                <p className='text-muted-foreground text-lg'>Kilimo AgriMarket combines all the essential agricultural trading and support tools in 
                    one intuitive platform, helping you reach markets while optimizing your farms productivity
                </p>

            </div>
        </div>
    
            <div id='features' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8'>
            <Card className='hover:shadow-lg transition-all'>
                <CardHeader className={`flex flex-row items-center gap-3 border-b`}>
                    <Users className='w-6 h-6 text-pr'/>
                </CardHeader>
                <CardContent className={`space-y-3`}>
                    <div>
                        <p className='text-2xl font-bold mt-3'>Intelligent Role-Based Access</p>
                        <p className='text-muted-foreground'>Secure, customized dashboards tailored to your specific role in the ecosystem</p>
                    </div>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Personalized workspace</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Seamless Registration</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Data Privacy and secure profile management</span>
                        </div>
                    </div>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
            <Card className='hover:shadow-lg transition-all'>
                <CardHeader className={`flex flex-row items-center gap-3 border-b`}>
                    <ShoppingBag className='w-6 h-6 text-pr'/>
                </CardHeader>
                <CardContent className={`space-y-3`}>
                    <div>
                        <p className='text-2xl font-bold mt-3'>Dynamic B2B Marketplace</p>
                        <p className='text-muted-foreground'>Streamlines digital catalog connecting fresh produce directly with buyers</p>
                    </div>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Real Time Browsing</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Transparent Order Tracking</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Instant secure payments</span>
                        </div>
                    </div>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
            <Card className='hover:shadow-lg transition-all'>
                <CardHeader className={`flex flex-row items-center gap-3 border-b`}>
                    <Sprout className='w-6 h-6 text-pr'/>
                </CardHeader>
                <CardContent className={`space-y-3`}>
                    <div>
                        <p className='text-2xl font-bold mt-3'>Smart Harvest Management</p>
                        <p className='text-muted-foreground'>Empowering farmers to digitize their inventory and manage sales</p>
                    </div>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Effortless Creations and editing of produce</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Centralized Dashboard to view harvests</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>One tap acceptance and rejection</span>
                        </div>
                    </div>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
            <Card className='hover:shadow-lg transition-all'>
                <CardHeader className={`flex flex-row items-center gap-3 border-b`}>
                    <MessageCircle className='w-6 h-6 text-pr'/>
                </CardHeader>
                <CardContent className={`space-y-3`}>
                    <div>
                        <p className='text-2xl font-bold mt-3'>B2Help Technical Support</p>
                        <p className='text-muted-foreground'>Direct access to expert agricultural guidance and professional field services</p>
                    </div>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Instant Report generation</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Direct Connection to certified officers</span>
                        </div>
                        <div className='flex items-center gap-2'>
                        <Check/>
                        <span>Real time web socket chat for consultations and advice</span>
                        </div>
                    </div>

                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
            </div>

        
    
</div>
)
}