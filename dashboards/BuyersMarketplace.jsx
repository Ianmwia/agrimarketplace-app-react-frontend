import { useCallback, useEffect, useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, Leaf, ShoppingCart, User } from 'lucide-react';
import SearchMarketplace from '../components/SearchMarketplace';
import DeliveryLocationDialog from '../map/SelectDialog';
import { useNavigate } from 'react-router-dom';

export default function Marketplace(){
    const [tab, setTab] = useState('market') // tab switching marketplace or orders
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([])
    const [orderQuantity, setOrderQuantity] = useState({}); //stores productId and quantity
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()


   

    const fetchMarketData = useCallback(async () => {
        try {
            const query = (typeof searchQuery === 'string') ? searchQuery:''
            const url =  searchQuery ? `order/?q=${encodeURIComponent(query)}` : 'order/';
            const res = await API.get(url)

            setProducts(res.data.available_batches || []);
            setOrders(res.data.orders || []);
            // console.log(res.data)
        } catch {
            //toast.error('Failed to fetch data')
        }
    },[searchQuery]);
    
    useEffect(()=>{
        const load = async () => {
            await fetchMarketData()
        }
            load();
        //poll to refresh cook to waiter
        const interval = setInterval(()=>{
            if (tab === 'orders'){
                load()
            }

        }, 5000)

        return () => clearInterval(interval)
    },[fetchMarketData, tab]);

    const handlePlaceOrder = async (product) => {
        const quantity = parseInt(orderQuantity[product.id]) || 1;
        const price = parseFloat(product.price_per_unit) || 0
        const totalAmount = quantity * price

        try {
            await API.post('order/', {
                batch: product.id,
                quantity: quantity,
                //status: 'pending'
            });
            toast.success(`Order for ${product.produce_name} placed, you ordered ${quantity} Kilograms for the, Total Amount of Ksh ${totalAmount}`);
            fetchMarketData()
        } catch (error) {
            toast.error('Error placing an order')
            console.log(error.response?.data?.detail)            
        }
    };

    //mpesa payment
    const handleMpesaPayment = async (order) => {
        
        if(!User?.phone){
            toast.error('Before paying, Please add a phone number to your profile account')
            setTimeout(() => {
                navigate('/profile')
            }, 4000);
            return
        }

        try {
        toast.info("Check your phone for the M-Pesa prompt");
        const res = await API.post(`order/${order.id}/pay/`);

        if (res.data.CheckoutRequestID) {
        toast.success("STK Push sent successfully!");
        // Refresh to show any status changes
        fetchMarketData();
        }
        } catch (error) {
        toast.error(error.response?.data?.error || "Payment failed to initiate");
        }
        };



    return(
        <div className='container mx-auto px-4 py-6 md:py:10 max-w-7xl'>
            {/*tabs */}
            <div className='flex justify-center gap-4 mb-10'>
                <Button onClick={()=> setTab('market')}
                    className={`px-6 font-bold ${tab === 'market'}`}>
                        <ShoppingCart className='mr-2 h-4 w-4'/>Marketplace
                </Button>

                <Button onClick={()=> setTab('orders')}
                    className={`px-6 font-bold ${tab === 'orders'}`}>
                        <Leaf className='mr-2 h-4 w-4'/>My Orders
                </Button>
            </div>
            {/* search bar */}
            <div>
                {tab === 'market' &&(
                    <div>
                        <SearchMarketplace onSearch={setSearchQuery}/>
                    </div>
                )}

            </div>

            {/*market tab */}
            {tab === 'market' && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {products.map((item)=>(
                        <Card key={item.id} 
                            className='pt-0 border-border bg-card shadow-sm hover:shadow-md transition:shadow'>
                                <div className='aspect-square bg-muted overflow-hidden rounded-t-lg'>
                                    <img src={item.produce_image} 
                                    className='object-cover w-full h-full'
                                    alt={item.produce_name}  loading='lazy'/>
                                </div>
                                <CardHeader className='p-3 border-b bg-muted/30'>
                                    <div className='flex justify-between items-start gap-2'>
                                        <CardTitle className='text-lg font-bold truncate leading-tight'>
                                            <div>
                                                <p className='text-primary'>{item.produce_name}</p>
                                            </div>
                                        </CardTitle>
                                        <div variant='outline' 
                                        className='shrink-0 font-semibold'
                                        >KSH {item.price_per_unit}</div>
                                    </div>
                                </CardHeader>
                                <CardContent className='p-5 space-y-2'>
                                    <div className='text-sm space-y-1'>
                                        <p className='text-lg font-medium'><span className='text-muted-foreground font-semibold uppercase text-xl tracking-wider'>Farmer: </span> {item.farmer_first_name} {item.farmer_last_name}</p>
                                        <p className='text-lg font-medium'><span className='text-muted-foreground font-semibold uppercase text-xl tracking-wider'>Available: </span> {item.quantity} KG</p>
                                        <p className='text-lg font-medium'><span className='text-muted-foreground font-semibold uppercase text-xl tracking-wider'>Location: </span> {item.farmer_location}</p>
                                    </div>

                                    <div className='pt-4 flex flex-col gap-3'>
                                        <div className='space-y-1'>
                                            <p className=' text-sm cont-bold text-muted-foreground uppercase tracking-widest'>Order Amount - KG</p>
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
            <Card className='border-border bg-card shadow-sm pt-0'>
                <CardHeader className='border p-2 bg-muted/30 '>
                    <CardTitle className='text-center text-xl'>Purchase order History</CardTitle>
                </CardHeader>

                <CardContent className='p-0'>
                    <div className='divide-y divide-border'>
                        {orders.map((order) => (
                            <div key={order.id} className='p-4 md:p-6 flex flex-col justify-between items-center gap-4 hover:bg-muted/10'>
                                <div className='text-center md:text-left'>
                                    <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Order # {order.id}</p>
                                    <p className='text-lg font-medium'>{order.produce_name || order.produce_details?.name}</p>
                                </div>

                                <div className='flex gap-8'>
                                    <div className='text-center'>
                                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Quantity of Items Ordered</p>
                                        <p className='font-medium'>{order.quantity} KG</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Amount</p>
                                        <p className='font-medium'>{order.total_price || 0}</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>Status</p>
                                        <p className='font-medium'>{order.status}</p>
                                    </div>

                                </div>
                                <div className='mt-3 text-sm'>
                                    <p className='text-lg md:text-2xl font-medium text-center mb-2'>Order Summary</p>
                                    <p className=' text-center text-sm font-bold text-muted-foreground uppercase tracking-widest leading-relaxed'>
                                    You placed an Order for <strong>{order.quantity} kg</strong> of <strong>{order.produce_name}</strong> sourced from farmer <strong>{order.farmer_first_name} {order.farmer_last_name} </strong>   
                                     Totalling <span className='font-bold text-primary'>Ksh {order.total_price}</span></p>
                                </div>
                                <div className='flex flex-col items-center gap-2'>
                                    <Badge 
                                    fontVariant={
                                        order.status === 'pending' ? 'secondary':
                                        order.status === 'accepted' ? 'outline':
                                        order.status === 'paid' ? 'default': 'destructive'

                                    }>
                                        {order.status.toUpperCase()}
                                    </Badge>
                                    {order.status === 'accepted' && (
                                        <div className=' flex flex-col items-center gap-2'>
                                        <Button
                                        size='sm'
                                        className='bg-primary'
                                        onClick={()=> handleMpesaPayment(order)}
                                        >Pay Ksh {order.total_price}
                                        </Button>

                                        {order.delivery ? (
                                            <div className='flex flex-col md:flex-row md:gap-3 items-center p-2 rounded-lg  border'>
                                                <p>Delivery Status :</p>
                                                <p>{order.delivery.status.replace('_', '').toUpperCase()}</p>
                                            </div>
                                        ):(
                                            <>
                                        <DeliveryLocationDialog orderId={order.id} />
                                        </>
                                    )}
                                    </div>
                                    )}
                                </div>
                                {order.status === 'rejected' && order.rejection_reason &&(
                                    <p className='mt-2 text-sm text-destructive text-center max-w-xs'>
                                        <strong>Reason:</strong> {order.rejection_reason}
                                    </p>
                                )}
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