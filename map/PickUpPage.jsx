import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Mappicker from './MapPicker';
import API from '@/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreatePickUpPoint(){

    const {orderId} = useParams()

    const [location, setLocation] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {

        if (!location) {
            toast.error('Please select a pick up point on map first')
            return
        }
        setIsSaving(true)
        try {
            await API.post("logistics/", {
                order: Number(orderId), 
                dropoff_lat: location.lat,
                dropoff_lon: location.lng
            })
            toast.success("Location Saved! We will deliver the produce and keep in contact")
            navigate('/market')
        } catch (error) {
            console.log(error)
            toast.error("Error saving location") 
        } finally{
            setIsSaving(false)
        }
    }

    return(
        <div className='max-w-xl mx-auto space-y-4 min-h-screen'>
            <h2 className='text-xl font-bold'>Schedule Delivery</h2>
            <div className='rounded-lg overflow-hidden border'>
            <Mappicker setLocation={setLocation}/>
            </div>

            <Button onClick={handleSubmit} disabled={isSaving}>
                Confirm Delivery Location
            </Button>
        </div>
    )
}