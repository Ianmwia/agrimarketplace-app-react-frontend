import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//icons
import { User, Mail, MapPin, Briefcase, LogOut, Loader2, Edit2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card , CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

import API from '../src/api';

export default function Profile(){
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await API.get('profile/');
            setUser(res.data.serializer || res.data);

        } catch (error) {
            toast.error("Authentication error")
            navigate('/login')
            
        }
    };

        useEffect(()=> {
            fetchProfile();
         }, []);

        //update profile
        const handleUpdate = async (e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            try {
                await API.post('profile/', formData);
                setIsEditing(false);
                fetchProfile();
                toast.success('Profile Updated successfully');
            } catch (error) {
                console.error(error.response?.data);
                toast.error('Update failed');
            }

    };

    return(
        <div className='container mx-auto px-4 py-6 md:py-10 max-w-4xl'>
            <Card className='border-border bg-card shadow-lg'>
                <CardHeader className='border-b bg-muted/30'>
                    <CardTitle className='text-center text-2xl font-bold tracking-tight'>
                        {isEditing ? "Edit Profile" : "Profile Page"}
                    </CardTitle>
                </CardHeader>

                <CardContent className='p-6 md:p-10'>
                    {!isEditing ? (
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12'>
                            {/*avatar section */}
                            <div className='relative'>
                                <Avatar className='h-32 w-32 md:h-44 md:w-44 border-4 md:gap-12 border-muted'>
                                    <AvatarImage src={user?.image} className='object-cover'/>
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </div>

                            {/*Profile info */}
                            <div className='flex-1 space-y-6 w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8'>
                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>First Name</p>
                                        <p className='text-lg font-medium'>{user?.first_name}</p>
                                    </div>
                                    
                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>Last Name</p>
                                        <p className='text-lg font-medium'>{user?.last_name}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>Email</p>
                                        <p className='text-lg font-medium'>{user?.email}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>Phone</p>
                                        <p className='text-lg font-medium'>{user?.phone}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>Location</p>
                                        <p className='text-lg font-medium'>{user?.location}</p>
                                    </div>

                                    <div className='space-y-1'>
                                        <p className='text-sm text-muted-foreground uppercase font-semibold tracking-wider'>Role</p>
                                        <p className='text-lg font-medium'>{user?.role}</p>
                                    </div>

                                    <div className='pt-6'>
                                        <Button
                                            onClick={()=> setIsEditing(true)}
                                            className='w-full md:w-auto px-10'
                                        >
                                            Edit Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ): (
                        <form onSubmit={handleUpdate} encType='multipart/form-data' className='space-y-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/*image upload */}
                                <div className='md:col-span-2 space-y-2 border-b pb-6'>
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Profile Picture</Label>
                                    <Input type='file' name='image' className='cursor-pointer file:text-primary file:font-semibold bg-background'/>
                                </div>

                                <div className='space-y-2'>
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">First Name</Label>
                                    <Input  defaultValue={user?.first_name} name='first_name' className='bg-background'/>
                                </div>

                                <div className='space-y-2'>
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Last Name</Label>
                                    <Input  defaultValue={user?.last_name} name='last_name' className='bg-background'/>
                                </div>

                                <div className='space-y-2'>
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Phone</Label>
                                    <Input  defaultValue={user?.phone} name='phone' className='bg-background'/>
                                </div>

                                <div className='space-y-2'>
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Location</Label>
                                    <Input  defaultValue={user?.location} name='location' className='bg-background'/>
                                </div>

                            </div>

                            <div className='flex flex-col md:flex-row items-center gap-4 pt-4'>
                                <Button type='submit' className='w-full md:w-auto px-10'>
                                    Update
                                </Button>

                                {/*cancel button */}
                                <Button type='button' variant='outline'
                                    onClick={()=> setIsEditing(false)}
                                    className='w-full md:w-auto px-10'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>    
        </div>
    )

}