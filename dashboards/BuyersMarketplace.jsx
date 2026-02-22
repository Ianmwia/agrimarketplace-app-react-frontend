import { useEffect, useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Leaf, ShoppingCart, User } from 'lucide-react';

export default function Marketplace(){
    const [tab, setTab] = useState('market') // tab switching marketplace or orders
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([])
    const [orderQuantity, setOrderQuantity] = useState({}); //stores productId and quantity


   

    const fetchMarketData = async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                API.get('produce/'),
                API.get('order/')
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (error) {
            toast.error('Failed to fetch data')
        }
    };
    
    useEffect(()=>{
        fetchMarketData();
    },[]);

    const handlePlaceOrder = async (product) => {
        const quantity = orderQuantity[product.id] || 1;

        try {
            await API.post('order/', {
                produce: product.id,
                quantity: quantity,
                //status: 'pending'
            });
            toast.success(`Order for ${product.name} placed, you ordered ${quantity} Units`);
        } catch (error) {
            toast.error('Error placing an order')
            console.log(error.response?.data?.detail)            
        }
    };


    return(
        <div className='container mx-auto px-4 py-6 md:py:10 max-w-7xl'>
            {/*tabs */}
            <div className='flex justify-center gap-4 mb-10'>
                <Button onClick={()=> setTab('market')}
                    className={`px-6 font-bold ${tab === 'market' ? 'bg-[#4a6d31]' : 'bg-muted text-foreground'}`}>
                        <Leaf className='mr-2 h-4 w-4'/>Marketplace
                </Button>

                <Button onClick={()=> setTab('orders')}
                    className={`px-6 font-bold ${tab === 'orders' ? 'bg-[#4a6d31]' : 'bg-muted text-foreground'}`}>
                        <Leaf className='mr-2 h-4 w-4'/>My Orders
                </Button>
            </div>

            {/*market tab */}
            {tab === 'market' && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {products.map((item)=>(
                        <Card key={item.id} 
                            className='border-border bg-card shadow-sm hover:shadow-md transition:shadow'>
                                <div className='aspect-square bg-muted overflow-hidden rounded-t-lg'>
                                    <img src={item.image} 
                                    className='object-cover w-full h-full'
                                    alt={item.name}  loading='lazy'/>
                                </div>
                                <CardHeader className='p-5 border-b bg-muted/30'>
                                    <div className='flex justify-between items-start gap-2'>
                                        <CardTitle className='text-lg font-bold truncate leading-tight'>
                                            {item.name}
                                        </CardTitle>
                                        <Badge variant='outline' 
                                        className='shrink-0'
                                        >KSH {item.price}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className='p-5 space-y-3'>
                                    <div className='text-sm space-y-1'>
                                        <p><span className='text-muted-foreground font-semibold uppercase text-[10px] tracking-wider'>Farmer: </span> {item.farmer_name}</p>
                                        <p><span className='text-muted-foreground font-semibold uppercase text-[10px] tracking-wider'>Available: </span> {item.quantity} KG</p>
                                    </div>

                                    <div className='pt-4 flex flex-col gap-3'>
                                        <div className='space-y-1'>
                                            <p className=' text-[10px] cont-bold text-muted-foreground uppercase tracking-widest'>Order Amount - KG</p>
                                            <Input type='number' min='1' max={item.quantity} placeholder='Enter Quantity'
                                            onChange={(e)=> setOrderQuantity({...orderQuantity, [item.id]: e.target.value})}
                                            className='bg-background'
                                            />

                                        </div>

                                        <Button
                                        onClick={()=> handlePlaceOrder(item)}
                                        className='w-full'
                                        >
                                            <ShoppingCart className='mr-2 h-4 w-4'/> Place Order
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                    ))}

                </div>
            )}

            {/*Orders Tab */}
            
            
        </div>
    )
}