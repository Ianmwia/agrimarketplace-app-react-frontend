import { useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function RejectDialog({order, open,setOpen, refresh}){
    const [reason, setReason] = useState('')

    const handleSubmit = async ()=> {
        if (!reason.trim()){
            toast.error('enter a rejection reason')
            return
        }

        try {
            await API.post(`order/${order}/reject/`, {reason})
            toast.success('order Rejected')
            setOpen(false)
            setReason('')
            refresh()
        } catch {
            toast.error('Failed to reject Order')
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are You Sure You Want to reject Order #{order.id} for {order.produce_name} placed by {order.buyer_first_name}  {order.buyer_last_name}?
                    </DialogTitle>
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
                    onClick={handleSubmit}
                    >
                        Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}