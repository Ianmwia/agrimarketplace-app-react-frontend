import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Mappicker from './MapPicker';
import API from '@/api';
import { Button } from '@/components/ui/button';

export default function CreatePickUpPoint(){

    const {orderId} = useParams()

    const [location, setLocation] = useState(null)

    const handleSubmit = async () => {

        if (!location) return
        try {
            await API.post("logistics/", {
                order: Number(orderId), 
                dropoff_lat: location.lat,
                dropoff_lon: location.lng
            })
        } catch (error) {
            console.log(error)
            
        }
    }

    return(
        <div className='max-w-xl mx-auto space-y-4'>
            <h2 className='text-xl font-bold'>Schedule Delivery</h2>
            <Mappicker setLocation={setLocation}/>

            <Button onClick={handleSubmit}>
                Confirm Delivery Location
            </Button>
        </div>
    )
}