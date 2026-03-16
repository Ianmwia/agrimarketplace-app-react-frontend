import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import API from '@/api'


export default function PickUpSelectDialog({orderId, userLocation}){
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleUserLocation = async () => {
        if(!userLocation){
            toast.error('No account location found , please select on map')
            return
        }
        setLoading(true)
        try {
            const [lat, lon] = userLocation.split(',').map(coord => parseFloat(coord.trim()))

           await API.post('logistics/', {
            order: Number(orderId), 
            dropoff_lat: lat,
            dropoff_lon: lon})
           toast.success('delivery location saved')
           navigate('/market')
           setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('failed to add location')
        } finally{
            setLoading(false)
        }
    }

    //navigate to map select
    const handleSelectOnMap = () => {
        navigate(`/pickup/${orderId}`)
    }

    return(
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline'> Select delivery Location</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select  A pick up point</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col gap-3'>
                        <Button
                        onClick={handleUserLocation}
                        disabled={loading}
                        >
                            {loading ? 'Saving...': 'Use Account Location'}
                        </Button>
                        <Button
                        onClick={handleSelectOnMap}
                        >
                            Select on map
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}