import { useState, useEffect } from 'react';
import API from '@/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function UpdateProduce(){
    const {id} = useParams()
    const navigate = useNavigate()

    const [produce, setProduce] = useState({
        name:'',
        description: '',
        image:'',
        imageFile: null,
        price_per_unit: '',
        quantity:'',
    })
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        const fetchProduce = async () => {
            try {
                const res = await API.get(`produce/${id}/`)
                const latestBatch = res.data.batches?.[0] || {}

                setProduce({
                    name: res.data.name || '',
                    description: res.data.description || '',
                    image: res.data.image || '',
                    imageFile: null,
                    price_per_unit: latestBatch.price_per_unit || '',
                    quantity: latestBatch.quantity || '', 
                })
            } catch {
                toast.error('Failed to load produce')
            }
        }
        fetchProduce()
    },[id])

    const handleChange = (e) => {
        const {name, value, files} = e.target
        if (name === 'image'){
            setProduce(prev => ({... prev, imageFile: files[0]}))
        }else{
            setProduce(prev => ({...prev, [name]: value}))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (produce.imageFile){
                const formData = new FormData()
                formData.append('image', produce.imageFile)

                await API.patch(`produce/${id}/`, formData,{
                    headers: {"Content-Type": "multipart/form-data"}
                })
            }else {
                //send normal json
                const payload = {
                    name: produce.name,
                    description: produce.description,
                    price_per_unit: produce.price_per_unit,
                    quantity: produce.quantity
                }
                
                await API.patch(`produce/${id}/`, payload)
            }
            toast.success('Produce updated successfully')
            navigate('/farmer')
        } catch{
            toast.error('Failed to update Produce')  
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className='container mx-auto px-4 py-6 md:py-10 max-w-4xl'>
            <form onSubmit={handleSubmit} encType='multipart/form-data' className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/*image upload */}
                    <div className='md:col-span-2 space-y-2 border-b pb-6'>
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Produce Image</Label>
                        <Input onChange={handleChange} type='file' name='image' className='cursor-pointer file:text-primary file:font-semibold bg-background'/>
                    </div>

                    <div className='space-y-2'>
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Name</Label>
                        <Input onChange={handleChange} value={produce.name} name='name' className='bg-background'/>
                    </div>

                    <div className='space-y-2'>
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Description</Label>
                        <Input onChange={handleChange} value={produce.description} type='text' name='description' className='bg-background'/>
                    </div>

                    <div className='space-y-2'>
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Price</Label>
                        <Input onChange={handleChange} value={produce.price_per_unit} type='number' name='price_per_unit' className='bg-background'/>
                    </div>

                    <div className='space-y-2'>
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Quantity</Label>
                        <Input onChange={handleChange} value={produce.quantity} type='number' name='quantity' className='bg-background'/>
                    </div>

                </div>

                <div className='flex flex-col md:flex-row items-center gap-4 pt-4'>
                    <Button type='submit' className='w-full md:w-auto px-10' disabled={loading}>
                        {loading ? (
                            <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Updating
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>

                    {/*cancel button */}
                    <Button type='button' variant='outline'
                        onClick={()=> navigate(-1)}
                        className='w-full md:w-auto px-10'
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}