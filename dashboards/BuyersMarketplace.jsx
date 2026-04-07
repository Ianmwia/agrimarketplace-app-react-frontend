import { useCallback, useEffect, useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
import PaymentMethod from './PaymentDialog';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BadgeCheck, Download, Leaf, ShoppingCart, User } from 'lucide-react';
import SearchMarketplace from '../components/SearchMarketplace';
import DeliveryLocationDialog from '../map/SelectDialog';


export default function Marketplace(){
    const [tab, setTab] = useState('market') // tab switching marketplace or orders
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([])
    const [orderQuantity, setOrderQuantity] = useState({}); //stores productId and quantity
    const [searchQuery, setSearchQuery] = useState('')
    const [debounceQuery, setDebounceQuery] = useState('')
    const [selectOrder, setSelectOrder] = useState(null)
    const [user, setUser] = useState(null)
    // pagination
    const [currentOrderPage, setCurrentOrderPage] = useState('order/')
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0)



   useEffect(()=> {
    const handler = setTimeout(()=>{
        setDebounceQuery(searchQuery)
    }, 500)
    return ()=> clearTimeout(handler)
   }, [searchQuery])

    const fetchMarketData = useCallback(async () => {
        if (loading) return
        setLoading(true)
        try {
            //const query = (typeof searchQuery === 'string') ? searchQuery:''
            const url =  debounceQuery 
            ? `order/?q=${encodeURIComponent(debounceQuery)}` 
            : 'order/?page_size=25';
            const res = await API.get(url)

            setProducts(res.data.available_batches || res.data.available_produce || []);
            // console.log(res.data)
        } catch {
            //toast.error('Failed to fetch data')
        } finally {
            setLoading(true)
            setLoading(false)
        }
    },[debounceQuery]);

    const fetchOrderHistory = useCallback(async (url = 'order/') => {
        try {
            const res = await API.get(url)
            setOrders(res.data.orders || []);
            // console.log(res.data)

            if (res.data.count !== undefined){
                setCount(res.data.count)
            }

            setNextPage(res.data.next || null)
            setPrevPage(res.data.previous || null)
            setCurrentOrderPage(url)
        } catch {
            //toast.error('Failed to fetch Order History')
        }
    },[]);

    useEffect(()=> {
        if (tab === 'market'){
            fetchMarketData()
        }
    }, [tab, fetchMarketData])

    useEffect(()=> {
        if (tab === 'orders'){
            fetchOrderHistory()
        }
    }, [tab, fetchOrderHistory])
    


    const handlePlaceOrder = async (product) => {
        const quantity = parseInt(orderQuantity[product.id]) || 1;
        const price = parseFloat(product.price_per_unit) || 0
        const totalAmount = quantity * price

        try {
            const res = await API.post('order/', {
                batch: product.id,
                quantity: quantity,
                //status: 'pending'
            });

            if (res.data.orders) setOrders(res.data.orders)
            if (res.data.available_batches) setProducts(res.data.orders)
            toast.success(`Order for ${product.produce_name} placed, you ordered ${quantity} Kilograms for the, Total Amount of Ksh ${totalAmount}`);
            fetchMarketData()
        } catch (error) {
            toast.error('Error placing an order')
            console.log(error.response?.data?.detail)            
        }
    };

    useEffect(()=> {
        const fetchUser = async () => {
            try {
                const res = await API.get('me/')
                setUser(res.data)
            } catch (error) {
                console.log('Failed to fetch User', error)
                
            }
        }
        fetchUser()
    }, [])



    const handleCancelOrder = async (orderId) => {
        try {
            const res = await API.post(`order/${orderId}/cancel_order/?page_url=${encodeURIComponent(currentOrderPage)}`)
            toast.success('Order Canceled');
            if (res.data.orders) setOrders(res.data.orders)
            if (res.data.available_batches) setProducts(res.data.orders)
            //setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
            //fetchMarketData();    
        } catch {
            toast.error('Failed to cancel Order')
            
        }
    }

    const handleExportCSV = async () => {
        try {
            const response = await API.get('order/export_csv', {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url

            const buyerName = user?.first_name ? `${user.first_name}_${user.last_name}` : 'My'
            const dateStr = new Date().toISOString().split('T')[0]

            link.setAttribute('download', `${buyerName}_Orders_${dateStr}.csv`)

            document.body.appendChild(link)
            link.click()

            link.remove()            
        } catch  {
            toast.error('Failed to export to csv')
        }
    }





    // 
    return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-background">
    {/* sidebar only on lg */}
    <aside className="w-full lg:w-72 lg:fixed lg:h-screen border-b lg:border-b-0 lg:border-r lg:bg-card z-30">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8 hidden lg:block">
          <h2 className="text-uniform font-bold text-primary flex items-center gap-2">
             Marketplace
          </h2>
        </div>

        <nav className="flex lg:flex-col flex-row justify-center lg:justify-start gap-4 w-full">
          <Button
            onClick={() => setTab('market')}
            variant={tab === 'market' ? 'default' : 'ghost'}
            className={`flex-1 lg:flex-none justify-start px-6 font-bold rounded-xl h-12 transition-all ${
              tab === 'market' ? 'shadow-md' : ''
            }`}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Marketplace</span>
          </Button>

          <Button
            onClick={() => setTab('orders')}
            variant={tab === 'orders' ? 'default' : 'ghost'}
            className={`flex-1 lg:flex-none justify-start px-6 rounded-xl font-bold h-12 transition-all ${
              tab === 'orders' ? 'shadow-md' : ''
            }`}
          >
            <Leaf className="mr-2 h-5 w-5" />
            <span>My Orders</span>
          </Button>
        </nav>

        {/* Search Bar - Moved to sidebar for desktop for a cleaner look */}
        {tab === 'market' && (
          <div className="mt-4 hidden lg:block">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
              Quick Search
            </p>
            <div> 
            <SearchMarketplace onSearch={setSearchQuery} />
            </div>
          </div>
        )}
        
      </div>
    </aside>

    {/* Main Content - Scrollable area */}
    <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
      {/* Mobile Search Header */}
      {tab === 'market' && (
        <div className="lg:hidden p-4 border-b bg-background/95 backdrop-blur">
          <SearchMarketplace onSearch={setSearchQuery} />
        </div>
      )}

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-20">
          
          {/* Marketplace Tab */}
          {tab === 'market' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-uniform font-extrabold tracking-tight">Available Produce</h1>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  Showing {products.length} items
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((item) => (
                  <Card
                    key={item.id}
                    className="pt-0 group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-6/4 bg-muted overflow-hidden">
                      <img
                        src={item.produce_image}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        alt={item.produce_name}
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                        <p className="text-zinc-950 font-bold text-sm">KSH {item.price_per_unit}/{item.unit}</p>
                      </div>
                    </div>

                    <CardHeader className="p-3 space-y-1">
                      <CardTitle className="text-xl font-bold text-foreground truncate">
                        {item.produce_name}
                      </CardTitle>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <User className="h-4 w-4 mr-1" />
                        <span className="truncate lg:text-[16px]"> Farmer: {item.farmer_first_name} {item.farmer_last_name}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-3 pt-0 space-y-4 grow">
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                          <p>Stock</p>
                          <p className="text-foreground text-sm mt-1">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-lg text-center">
                          <p>Location</p>
                          <p className="text-foreground text-sm mt-1 truncate">{item.farmer_location}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Order Quantity ({item.unit})
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          placeholder={`Enter ${item.unit}...`}
                          onChange={(e) => setOrderQuantity({ ...orderQuantity, [item.id]: e.target.value })}
                          className="bg-background focus-visible:ring-primary h-10"
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => handlePlaceOrder(item)}
                        className="w-full font-bold shadow-sm h-11"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Place Order
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-12 py-6 border-t">
                <Button
                  variant="outline"
                  disabled={!prevPage}
                  onClick={() => fetchMarketData(prevPage)}
                  className="w-32 rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={!nextPage}
                  onClick={() => fetchMarketData(nextPage)}
                  className="w-32 rounded-xl"
                >
                  Next Page
                </Button>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Order History</h1>
                  <p className="text-muted-foreground">{count} total orders placed</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="font-bold rounded-xl border-primary/20 hover:bg-primary/5"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </div>

              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:border-primary/50 transition-all duration-200">
                    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">
                            #{order.id.toString().slice(-6)}
                          </span>
                          <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold">{order.produce_name || order.produce_details?.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ordered <span className="font-bold text-foreground">{order.quantity} {order.unit || 'units'}</span> from <span className="font-medium text-foreground">{order.farmer_first_name} {order.farmer_last_name}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-8 items-center border-y md:border-y-0 py-4 md:py-0">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quantity</p>
                          <p className="font-semibold">{order.quantity} KG</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Price</p>
                          <p className="font-bold text-primary text-lg">Ksh {order.total_price || 0}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 min-w-35">
                        {order.status === 'pending' && user?.role === 'buyer' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full rounded-lg font-bold"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                        {order.status === 'accepted' && (
                          <div className="flex flex-col gap-2 w-full">
                            <Button
                              size="sm"
                              className="bg-primary w-full rounded-lg font-bold"
                              onClick={() => setSelectOrder(order)}
                            >
                              Pay Now
                            </Button>
                            {!order.delivery ? (
                              <DeliveryLocationDialog orderId={order.id} />
                            ) : (
                              <div className="text-[10px] font-bold bg-muted p-2 rounded text-center uppercase">
                                Delivery: {order.delivery.status.replace('_', ' ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {order.status === 'rejected' && order.rejection_reason && (
                      <div className="bg-destructive/5 p-3 text-sm text-destructive border-destructive/10 px-6 italic">
                        <strong>Reason:</strong> <span className='text-sm'>{order.rejection_reason}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-10" />
                  <p className="text-xl font-medium text-muted-foreground">No orders found</p>
                  <Button variant="link" onClick={() => setTab('market')} className="mt-2 text-primary font-bold">
                    Browse Marketplace
                  </Button>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-12 py-6 border-t">
                <Button
                  variant="outline"
                  disabled={!prevPage}
                  onClick={() => fetchOrderHistory(prevPage)}
                  className="w-32 rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={!nextPage}
                  onClick={() => fetchOrderHistory(nextPage)}
                  className="w-32 rounded-xl"
                >
                  Next Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>

    {/* Modals */}
    {selectOrder && (
      <PaymentMethod
        order={selectOrder}
        onClose={() => setSelectOrder(null)}
        fetchMarketData={fetchMarketData}
        User={{ phone: selectOrder.buyer_phone }}
      />
    )}
  </div>
);
}