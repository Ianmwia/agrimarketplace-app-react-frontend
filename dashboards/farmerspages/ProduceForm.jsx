import { useState } from 'react';
import { toast } from 'sonner';
import API from '../../src/api';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProduceForm(){
    const [formData, setFormData] = useState({
        name:'',
        price_per_unit:'',
        quantity:'',
        unit:'',
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

    const handleSelectChange = async (value) => {
        setFormData({...formData, unit: value})
    } 

    const handleSubmit = async (e) => {
        e.preventDefault()

        const quantity = Number(formData.quantity)
        const unit = formData.unit

        if ((unit === 'kg' || unit === 'litre') && quantity <30 ){
            toast.error(`Quantity must be at least 30 ${unit}`)
            return
        }
        if (unit === 'unit' && quantity <1 ){
            toast.error(`Quantity must be at least 1 ${unit}`)
            return
        }
        
        const data = new FormData();
        Object.keys(formData).forEach((key)=> {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        })

        try {
            await API.post('produce/', data, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                },
            })
            toast.success('produce created successfully');

            setFormData({
                name:'',
                price_per_unit:'',
                quantity:'',
                unit:'kg',
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
                    <Label>Unit</Label>
                    <Select
                    name='unit'
                    value={formData.unit}
                    onValueChange={handleSelectChange}
                    
                    >
                        <SelectTrigger className={`w-full`}>
                            <SelectValue placeholder='Select Unit'>{
                            formData.unit == 'kg' ? 'Kilograms' :
                            formData.unit == 'litre' ? 'Litres' :
                            'Units'

                            }</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='kg'>Kilograms (KG)</SelectItem>
                            <SelectItem value='litre'>Litres (L)</SelectItem>
                            <SelectItem value='unit'>Units</SelectItem>
                        </SelectContent>
                       
                    </Select>
                    </div>
                    <div className='space-y-2'>
                    <Label>Quantity</Label>
                    <Input name='quantity' type='number' placeholder={`Enter quantity in ${formData.unit}`} min={1} onChange={handleChange}/>
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