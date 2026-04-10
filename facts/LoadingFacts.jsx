import { useState, useEffect } from 'react';

const facts =  [
        "Agriculture supports over 70% of livelihoods in Kenya",
        "Bees pollinate 1 in every 3 bites of food we eat",
        "Maize is a staple food across Africa",
        "Irrigation can double crop yields",
        "Farming feeds over 7 billion people worldwide",
    ]
    

export default function LoadingFacts(){
    const [index, setIndex] = useState(0)

    useEffect(()=>{
        const Interval = setInterval(() => {
           setIndex((prev) => (prev + 1) % facts.length) 
        }, 3000);

        return () => clearInterval(Interval)
    },[])

    return (

        <p className='text-center text-sm text-muted-foreground max-w-xs leading-relaxed transition-opacity duration-500'>
            {facts[index]}
        </p>
    
    )

}