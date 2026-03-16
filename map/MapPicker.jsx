import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

function LocationMarker({setLocation}){
    const [position, setPosition] = useState(null)

    useMapEvents({
        click(e){
            setPosition(e.latlng)
            setLocation(e.latlng)
        }
    })

    return position ? <Marker position={position}/> : null
}

export default function Mappicker({setLocation}){
    const [center, setCenter] = useState([-1.286389, 36.817223])

    useEffect(()=>{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos)=>{
                setCenter([
                    pos.coords.latitude,          
                    pos.coords.longitude          
                ])
            })
        }
    }, [])

    return(
        <MapContainer
        center={center}
        zoom={13}
        style={{height:"400px", width: "100%"}}
        >
            <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <LocationMarker setLocation={setLocation}/>

        </MapContainer>
    )
}