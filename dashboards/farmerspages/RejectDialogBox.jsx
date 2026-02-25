import { useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function RejectDialog({orderId, open,setOpen, refresh}){
    const [reason, setReason] = useState('')

    const handleSubmit = async ()=> {
        if (!reason.trim()){
            toast.error('enter a rejection reason')
            return
        }

        try {
            await API.post(`order/${orderId}/reject/`, {reason})
            toast.success('order Rejected')
            setOpen(false)
            setReason('')
            refresh()
        } catch (error) {
            toast.error('Failed to reject Order')
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Order #{orderId} for {orderId.name} from {orderId.first_name} {orderId.last_name}</DialogTitle>
                </DialogHeader>
                <div>
                    <Textarea
                    placeholder='enter a reason for rejecting'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    >

                    </Textarea>
                </div>
                <DialogFooter>
                    <Button variant='outline'
                    onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant='destructive'
                    onClick={() => handleSubmit}
                    >
                        Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}