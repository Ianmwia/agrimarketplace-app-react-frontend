
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../src/api'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProduceList(){
    const [produce, setProduce] = useState([])
    const unitLabels = {
        kg: 'Kilograms',
        litre: 'Litres',
        unit: 'Units'
    }
    const navigate = useNavigate()

    const fetchProduce = useCallback(async () => {
        try {
            const res = await API.get('produce/')
            //console.log('data', res.data)
            //console.log('data', res.data.produce_list)
            setProduce(res.data.produce_list || [])
        } catch {
            toast.error('failed to load produce')
        }    
    },[])

    useEffect(()=>{
        const load = async () => {
            await fetchProduce()
        }
            load();
    },[fetchProduce]);

    //delete produce
    const deleteProduce = async(id) => {
        if (!confirm("Are You Sure You want to delete this produce")) return

        try {
            await API.delete(`produce/${id}`)
            toast.success('produce deleted Successfully')
        } catch {
            toast.error('Failed to delete Produce')
        }
    }
   

    return(
        <div className='space-y-4'>
            <div>
                <p className='text-xl font-bold mb-6 text-center'> My Harvest Listings</p>
            </div>

            {produce.length === 0 ? (
                <div className='text-center text-muted-foreground py-20'>
                    You have not Created any produce Yet
                </div>
            ): (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {produce.map((item) => (
                        <Card key={item.id} 
                        className='border-border bg-card shadow-sm pt-0'>

                            {/*image*/}
                            <div className='aspect-square bg-muted overflow-hidden rounded-t-lg'>
                                <img src={item.image} alt={item.name} className='object-cover w-full h-full' loading='lazy'/>

                            </div>
                            <CardHeader className='p-5 border-b bg-muted/30'>
                            <div className='flex justify-between items-start gap-2'>
                            <CardTitle>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Name</p>
                                    <p className='text-lg font-bold'>{item.name}</p>
                                </div>
                                
                            </CardTitle>
                            <div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Category</p>
                                    <p className='text-lg font-bold'>{item.category}</p>
                                </div>
                            </div>
                            </div>
                            </CardHeader>

                            <CardContent className='p-5 space-y-1'>
                                {/* <div className='flex gap-2  justify-between'>
                                    <p className='text-sm text-muted-foreground'>Farmer</p>
                                    <p className='text-lg font-bold'>{item.farmer_name}</p>
                                </div> */}
                                <div className='flex gap-2 justify-between'>
                                    <p className='text-sm text-muted-foreground'>Description:</p>
                                    <p className='text-lg font-bold'>{item.description}</p>
                                </div>
                                {item.batches && item.batches.length > 0 ? (
                                    <div className='space-y-3 mt-3 '>
                                        {item.batches.map(batch =>(
                                            <div key={batch.id} className='rounded-md'>
                                                <div className='flex justify-between'>
                                                    <p className='text-sm text-muted-foreground'>Batch Number:</p>
                                                    <p className='text-lg font-bold'>#{batch.batch_number}</p>
                                                </div>
                                                <div className='flex gap-2 justify-between'>
                                                    <p className='text-sm text-muted-foreground'>Quantity:</p>
                                                    <p className='text-lg font-semibold'>{batch.quantity} {unitLabels[batch.unit]}</p>
                                                </div>
                                                <div className='flex gap-2 justify-between'>
                                                    <p className='text-sm text-muted-foreground'>Price:</p>
                                                    <p className='text-lg font-bold'>Ksh {batch.price_per_unit}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className='flex gap-4'>
                                        <Button
                                        onClick={()=> deleteProduce(item.id)}
                                        variant='destructive'
                                        >
                                            Delete Produce
                                        </Button>

                                        <Button
                                        onClick={()=> navigate(`/produce/update/${item.id}`)}
                                        variant='outline'
                                        >
                                            Update Produce
                                        </Button>
                                        </div>
                                    </div>
                                ):(
                                    <p className='text-xl py-8'>No batches Available</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
        </div>
        
    )
    
}