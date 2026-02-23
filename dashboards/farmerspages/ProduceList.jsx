
import { useEffect, useState } from 'react'
import API from '../../src/api'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProduceList(){
    const [produce, setProduce] = useState([])

    const fetchProduce = async () => {
        try {
            const res = await API.get('produce/')
            setProduce(res.data.produce_list || [])
        } catch (error) {
            toast.error('failed to load produce')
        }    
    }

    useEffect(()=> {
            fetchProduce()
        }, [])

    return(
        <div className='space-y-4'>
            <div>
                <p className='text-xl font-bold mb-6 text-center'> My Produce Listings</p>
            </div>

            {produce.length === 0 ? (
                <div className='text-center text-muted-foreground py-20'>
                    You have not Created any produce Yet
                </div>
            ): (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {produce.map((item) => (
                        <Card key={item.id} 
                        className='border-border bg-card shadow-sm'>

                            {/*image*/}
                            <div className='aspect-square bg-muted overflow-hidden rounded-t-lg'>
                                <img src={item.image} alt={item.name} className='object-cover w-full h-full' loading='lazy'/>

                            </div>
                            <CardHeader className='p-5 border-b bg-muted/30'>
                            <div className='flex justify-between items-start gap-2'>
                            <CardTitle className='text-lg font-bold'>
                                Create New Produce
                            </CardTitle>
                            <div className='text-xl tracking-tighter'>
                                Ksh {item.price}
                            </div>
                            </div>
                            </CardHeader>

                            <CardContent className='p-5 space-y-1'>
                                <div className='text-sm space-y-1'>
                                    <p>
                                <span className='text-muted-foreground font-semibold uppercase tracking-wider text-[10px]'>
                                    Available: 
                                </span>{" "}
                                {item.quantity} KG
                                    </p>
                                    <p>
                                <span className='text-muted-foreground font-semibold uppercase tracking-wider text-[10px]'>
                                    Available: 
                                </span>{" "}
                                {item.quantity > 0 ? "In Stock" : "Out Of Stock"}
                                    </p>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
        </div>
    )
    
}