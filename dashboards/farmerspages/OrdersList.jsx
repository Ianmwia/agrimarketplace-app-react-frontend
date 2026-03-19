import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import API from '@/api'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from 'lucide-react'
import RejectDialog from './RejectDialogBox'

export default function OrdersList(){
    const [orders, setOrders] = useState([])
    const [selectOrder, setSelectOrder] = useState(null)
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)

    const fetchOrders = useCallback(async (endpoint) => {
        if (!endpoint) return;

        try {
            const res = await API.get(endpoint)
            if (!res.data.orders) return
            
            setOrders(res.data.orders)
            setNextPage(res.data.next || null)
            setPrevPage(res.data.previous || null)
        } catch {
            toast.error('failed to fetch Orders')
            }    
        },[])
        
        useEffect(()=>{
            const endpoint = 'order/?page=1&ordering=-created_at'

            const load = async () => {
                await fetchOrders(endpoint)
            }
            load();

            //poll to refresh cook to waiter
            const interval = setInterval(()=>{
                load()

            }, 5000)
            return () => clearInterval(interval)
            
         },[fetchOrders]);
        
            
            //accept orders
        const acceptOrder = async (id) => {
            try {
                const _res = await API.post(`order/${id}/accept/`)
                    toast.success('order accepted')
                    fetchOrders('order/?page=1&ordering=-created_at')
                } catch {
                    toast.error('failed to accept order')
                }    
            }

    return(
        <div>
       <Card className=''>
        <CardHeader>
            <CardTitle>
                Incoming Orders
            </CardTitle>
        </CardHeader>

        <CardContent>
            <div className='divide-y divide-border'>
                {orders.map((order)=> (
                    <div key={order.id} className='p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4'>
                        {/*order information */}
                        <div className='text-center md:text-left'>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'> Order # {order.id}</p>
                            <p className='text-lg font-medium'>{order.produce_name}</p>
                        </div>
                        {/*quantity */}
                        <div className='flex gap-8'>
                            <div className='text-center'>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'> Quantity</p>
                            <p className='font-medium'>{order.quantity} Kilograms</p>
                            </div>
                        </div>
                        {/*order information */}
                        <div className='text-center md:text-left'>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'> Order</p>
                            <p className='text-lg font-medium'>{order.produce_name}</p>
                        </div>
                        {/*ordered by */}
                        <div className='text-center md:text-left'>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'> Customer</p>
                            <p className='text-lg font-medium'>{order.buyer_first_name} {order.buyer_last_name}</p>
                        </div>
                        {/*date ordered */}
                        <div className='text-center md:text-left'>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'> Date of order</p>
                            <p className='text-lg font-medium'>{new Date(order.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                                }</p>
                        </div>

                        {/*status */}
                        <div className=' flex gap-3 flex-wrap justify-center'>
                            <Badge fontVariant={order.status === 'pending'
                                ? "secondary"
                                : order.status === "accepted" || order.status === 'paid'
                                ? "default"
                                : "destructive"
                            }
                            className='px-4 py-1'>
                                {order.status.toUpperCase()}
                            </Badge>

                            {order.status === 'pending' ? (
                                <div className='flex gap-x-2'>
                                    <Button size='sm'
                                    onClick={()=> acceptOrder(order.id)}
                                    >
                                        Accept
                                    </Button>

                                    <Button size='sm'
                                    variant='destructive'
                                    onClick={()=> setSelectOrder(order.id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            ) :(
                                <div className='text-center'>
                                    <p
                                    className={`text-sm font-bold ${
                                        order.status === 'accepted' ? 'text-primary': 
                                        order.status === 'paid' ? 'text-green-600' :
                                        'text-destructive'}`}
                                    >
                                        {order.status === 'accepted' && "Order Accepted"}
                                        {order.status === 'rejected' && "Order Rejected"}
                                        {order.status === 'paid' && "Order Paid"}

                                    </p>
                                </div>
                            )}
                        </div>


                    </div>
                ))}

                {/*empty state*/}
                {orders.length === 0 && (
                    <div className='p-20 text-center text-muted-foreground'>No Orders yet</div>
                )}

            </div>
        </CardContent>

        {/*reject dialog */}
        {selectOrder && (
            <RejectDialog
            order={orders.find(o => o.id === selectOrder)}
            open={true}
            setOpen={()=> setSelectOrder(null)}
            refresh={fetchOrders}
            />

        )}

       </Card>
       <div className='m-2 mt-4'>
        <Button
        variant='outline'
        disabled={!prevPage}
        onClick={()=> fetchOrders(prevPage)}
        className='mr-2'
        >
            Previous
        </Button>
        
        <Button
        variant='outline'
        disabled={!nextPage}
        onClick={()=>fetchOrders(nextPage)}
        className='ml-2'
        >
            Next Page</Button>
       </div>
       </div>
    )
}