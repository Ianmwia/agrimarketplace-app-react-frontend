
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


        </div>
    )
    
}