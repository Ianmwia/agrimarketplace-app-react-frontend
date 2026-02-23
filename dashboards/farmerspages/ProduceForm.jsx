import { useState } from 'react';
import { toast } from 'sonner';
import API from '../../src/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProduceForm(){
    const [formData, setFormData] = useState({
        name:'',
        price:'',
        quantity:'',
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
                price:'',
                quantity:'',
                category: '',
                description: '',
                image: null,
                });
                
        } catch (error) {
            toast.error('Failed to create produce')
        }

        
        
    }

    return(
        <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='p-5 border-b bg-muted/30'>
            <CardTitle className='text-lg font-bold'>
                Create New Produce
            </CardTitle>
            </CardHeader>

            <CardContent className='p-5'>
                <form action="" encType='multipart/form-data'
                onSubmit={handleSubmit}
                className='grid grid-cols-1 md:grid-cols-2 gap-6'
                >
                    <Input name='name' type='text' placeholder='Produce Name' onChange={handleChange} required/>
                    <Input name='price' type='number' placeholder='Price' onChange={handleChange}/>
                    <Input name='description' type='text' placeholder='Description' onChange={handleChange}/>
                    <Input name='category' type='text' placeholder='Category' onChange={handleChange}/>
                    <Input name='quantity' type='number' placeholder='Quantity' onChange={handleChange}/>
                    <Input name='image' type='file'  onChange={handleChange}/>
                
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