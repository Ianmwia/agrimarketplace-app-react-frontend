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
            const res = await API.get('order/');
            setProducts(res.data.available_produce || []);
            setOrders(res.data.orders || []);
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
                    className={`px-6 font-bold ${tab === 'market'}`}>
                        <Leaf className='mr-2 h-4 w-4'/>Marketplace
                </Button>

                <Button onClick={()=> setTab('orders')}
                    className={`px-6 font-bold ${tab === 'orders'}`}>
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
                                <CardHeader className='p-3 border-b bg-muted/30'>
                                    <div className='flex justify-between items-start gap-2'>
                                        <CardTitle className='text-lg font-bold truncate leading-tight'>
                                            {item.name}
                                        </CardTitle>
                                        <div variant='outline' 
                                        className='shrink-0'
                                        >KSH {item.price}</div>
                                    </div>
                                </CardHeader>
                                <CardContent className='p-5 space-y-2'>
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
            
            {tab === 'orders' &&(
            <Card className='border-border bg-card shadow-lg'>
                <CardHeader className='border =b bg-muted/30'>
                    <CardTitle className='text-center text-xl'>Purchase order History</CardTitle>
                </CardHeader>

                <CardContent className='p-0'>
                    <div className='divide-y divide-border'>
                        {orders.map((order) => (
                            <div key={order.id} className='p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-muted/10'>
                                <div className='text-center md:text-left'>
                                    <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Order # {order.id}</p>
                                    <p className='text-lg font-medium'>{order.produce_name || order.produce_details?.name}</p>
                                </div>

                                <div className='flex gap-8'>
                                    <div className='text-center'>
                                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Quantity</p>
                                        <p className='font-medium'>{order.quantity}</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Amount</p>
                                        <p className='font-medium'>{order.total_amount || 0}</p>
                                    </div>

                                </div>
                                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}
                                    className='px-4 py-1'
                                    >
                                        {order.status.toUpperCase()}
                                    </Badge>
                                </div>
                            
                            ))}
                        {orders.length === 0 && (
                            <div className='p-20 text-center text-muted-foreground'>No Orders placed</div>
                        )}
                    </div>
                </CardContent>
            </Card>
            )} 
        </div>
    )
}