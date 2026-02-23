import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import API from '@/api'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OrdersList(){
    const [orders, setOrders] = useState([])
    const [selectOrder, setSelectOrder] = useState(null)

    const fetchOrders = async () => {
        try {
            const res = await API.get('order/')
            setOrders(res.data.orders)
        } catch (error) {
            toast.error('failed to fetch Orders')
            }    
        }
    
        useEffect(()=> {
                fetchOrders()
            }, [])
            
            //accept orders
        const acceptOrder = async (id) => {
            try {
                const res = await API.post(`order/${id}/accept/`)
                    toast.success('order accepted')
                    fetchOrders()
                } catch (error) {
                    toast.error('failed to accept order')
                }    
            }

    return(
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
                            <p className='font-medium'>{order.quantity}</p>
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


                    </div>
                ))}

            </div>
        </CardContent>

       </Card>
    )
}