import { useState } from 'react';
import { toast } from 'sonner';
import API from '../../src/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ProduceForm(){
    const [formData, setFormData] = useState({
        name:'',
        price_per_unit:'',
        quantity:'',
        batch_number: '',
        category: '',
        description: '',
        image: null,
    })

    const handleChange = (e) => {
        if (e.target.name === 'image'){
            setFormData({...formData, image: e.target.files[0]})
        }else {
            setFormData({...formData, [e.target.name]:e.target.value})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Number(formData.quantity) < 10){
            toast.error('Quantity must be at least 10kg')
            return
        }
        if (Number(formData.price) < 400){
            toast.error('Price must be above Kes 400 per unit')
            return
        }
        
        const data = new FormData();
        Object.keys(formData).forEach((key)=> {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        })

        try {
            await API.post('produce/', data);
            toast.success('produce created successfully');

            setFormData({
                name:'',
                price_per_unit:'',
                quantity:'',
                batch_number:'',
                category: '',
                description: '',
                image: null,
                });
                
        } catch {
            toast.error('Failed to create produce')
        }

        
        
    }

    return(
        <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='p-5 border-b bg-muted/30'>
            <CardTitle className='text-lg font-bold'>
                Create Harvest
            </CardTitle>
            </CardHeader>

            <CardContent className='p-5'>
                <form action="" encType='multipart/form-data'
                onSubmit={handleSubmit}
                className='grid grid-cols-1 md:grid-cols-2 gap-6'
                >   
                    <div className='space-y-2'>
                    <Label>Produce Name</Label>
                    <Input name='name' type='text' placeholder='Produce Name' onChange={handleChange} required/>
                    </div>
                    
                    <div className='space-y-2'>
                    <Label>Price</Label>
                    <Input name='price_per_unit' type='number' placeholder='Price - Minimum price Kes 400' min={400} onChange={handleChange}/>
                    </div>
                    <div className='space-y-2'>
                    <Label>Description</Label>
                    <Input name='description' type='text' placeholder='Description' onChange={handleChange}/>                    
                    </div>
                    <div className='space-y-2'>
                    <Label>Category</Label>
                    <Input name='category' type='text' placeholder='Category' onChange={handleChange}/>

                    </div>
                    <div className='space-y-2'>
                    <Label>Quantity</Label>
                    <Input name='quantity' type='number' placeholder='Quantity - Minimum Amount 10KG' min={10} onChange={handleChange}/>
                    </div>

                    <div className='space-y-2'>
                    <Label>Batch Number</Label>
                    <Input name='batch_number' type='number' placeholder='Batch Number' onChange={handleChange}/>
                    </div>

                    <div className='space-y-2'>
                    <Label>Image</Label>
                    <Input name='image' type='file'  onChange={handleChange}/>
                    </div>
                
                <div className='md:cols-span-2 mt-5'>
                    <Button className='w-full'>
                        Create Produce
                    </Button>
                </div>
                </form>

            </CardContent>
        </Card>
    )
}