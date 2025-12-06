import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Calendar, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

// Product data
const products = [
  { id: 'broto', name: 'Broto', variants: [
    { id: 'broto-small', name: 'Small', size: '260ML', price: 12000 },
    { id: 'broto-large', name: 'Large', size: '1060ML', price: 45000 }
  ]},
  { id: 'dewisri', name: 'Dewi Sri', variants: [
    { id: 'dewisri-small', name: 'Small', size: '260ML', price: 20000 },
    { id: 'dewisri-large', name: 'Large', size: '1060ML', price: 75000 }
  ]},
  { id: 'gendis', name: 'Gendis', variants: [
    { id: 'gendis-small', name: 'Small', size: '260ML', price: 18000 },
    { id: 'gendis-large', name: 'Large', size: '1060ML', price: 72000 }
  ]},
  { id: 'lojinawi', name: 'Lojinawi', variants: [
    { id: 'lojinawi-small', name: 'Small', size: '260ML', price: 15000 },
    { id: 'lojinawi-large', name: 'Large', size: '1060ML', price: 60000 }
  ]},
  { id: 'widuri', name: 'Widuri', variants: [
    { id: 'widuri-small', name: 'Small', size: '260ML', price: 15000 },
    { id: 'widuri-large', name: 'Large', size: '1060ML', price: 60000 }
  ]}
]

// Channel options
const channels = [
  { id: 'online', name: 'Online' },
  { id: 'offline', name: 'Offline' }
]

// Sub-channel options
const onlineSubChannels = [
  { id: 'grabfood', name: 'GrabFood' },
  { id: 'shopeefood', name: 'Shopee Food' },
  { id: 'gofood', name: 'GoFood' },
  { id: 'socmed-ads', name: 'Social Media Ads' },
  { id: 'organic-socmed', name: 'Organic Social Media' }
]

const offlineSubChannels = [
  { id: 'reseller', name: 'Reseller' },
  { id: 'referral', name: 'Referral' },
  { id: 'direct', name: 'Direct' }
]

// Sample reseller/referral data
const resellers = [
  { id: 'reseller1', name: 'Reseller A', type: 'reseller' },
  { id: 'reseller2', name: 'Reseller B', type: 'reseller' },
  { id: 'referral1', name: 'Referral A', type: 'referral' },
  { id: 'referral2', name: 'Referral B', type: 'referral' }
]

interface OrderItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  price: number
}

export default function OrderForm() {
  const [transactionDate, setTransactionDate] = useState<Date>(new Date())
  const [channel, setChannel] = useState('')
  const [subChannel, setSubChannel] = useState('')
  const [resellerId, setResellerId] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [shippingSubsidy, setShippingSubsidy] = useState(0)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '1', productId: '', variantId: '', quantity: 1, price: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Calculate total price
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingSubsidy
  }

  // Handle product change
  const handleProductChange = (itemId: string, productId: string) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, productId, variantId: '', price: 0 }
          : item
      )
    )
  }

  // Handle variant change
  const handleVariantChange = (itemId: string, variantId: string) => {
    // Find the selected product and variant
    let price = 0
    for (const product of products) {
      const variant = product.variants.find(v => v.id === variantId)
      if (variant) {
        price = variant.price
        break
      }
    }
    
    setOrderItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, variantId, price }
          : item
      )
    )
  }

  // Handle quantity change
  const handleQuantityChange = (itemId: string, quantity: number) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Add new order item
  const addOrderItem = () => {
    const newId = (Math.max(...orderItems.map(item => parseInt(item.id))) + 1).toString()
    setOrderItems([...orderItems, { id: newId, productId: '', variantId: '', quantity: 1, price: 0 }])
  }

  // Remove order item
  const removeOrderItem = (itemId: string) => {
    if (orderItems.length > 1) {
      setOrderItems(items => items.filter(item => item.id !== itemId))
    }
  }

  // Handle channel change
  const handleChannelChange = (value: string) => {
    setChannel(value)
    setSubChannel('')
    setResellerId('')
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate form
      if (!transactionDate || !channel || !subChannel) {
        throw new Error('Please fill all required fields')
      }
      
      // Check if all order items have product and variant
      const invalidItems = orderItems.filter(item => !item.productId || !item.variantId)
      if (invalidItems.length > 0) {
        throw new Error('Please select product and variant for all items')
      }
      
      // Prepare order data
      const orderData = {
        transactionDate: format(transactionDate, 'yyyy-MM-dd'),
        channel,
        subChannel,
        resellerId: subChannel === 'reseller' || subChannel === 'referral' ? resellerId : null,
        buyerName,
        shippingSubsidy,
        items: orderItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal()
      }
      
      // In a real application, you would send this data to your API
      console.log('Order data:', orderData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Order submitted successfully!')
      
      // Reset form
      setTransactionDate(new Date())
      setChannel('')
      setSubChannel('')
      setResellerId('')
      setBuyerName('')
      setShippingSubsidy(0)
      setOrderItems([{ id: '1', productId: '', variantId: '', quantity: 1, price: 0 }])
      
    } catch (error) {
      console.error('Error submitting order:', error)
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="transaction-date" className="text-sm font-medium">
            Transaction Date
          </label>
          <DatePicker
            value={transactionDate}
            onChange={setTransactionDate}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="shipping-subsidy" className="text-sm font-medium">
            Shipping Subsidy
          </label>
          <Input
            id="shipping-subsidy"
            type="number"
            placeholder="0"
            value={shippingSubsidy}
            onChange={(e) => setShippingSubsidy(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="channel" className="text-sm font-medium">
            Channel
          </label>
          <Select value={channel} onValueChange={handleChannelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sub-channel" className="text-sm font-medium">
            Sub-Channel
          </label>
          <Select value={subChannel} onValueChange={setSubChannel} disabled={!channel}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-channel" />
            </SelectTrigger>
            <SelectContent>
              {channel === 'online' && onlineSubChannels.map((sc) => (
                <SelectItem key={sc.id} value={sc.id}>
                  {sc.name}
                </SelectItem>
              ))}
              {channel === 'offline' && offlineSubChannels.map((sc) => (
                <SelectItem key={sc.id} value={sc.id}>
                  {sc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(subChannel === 'reseller' || subChannel === 'referral') && (
        <div className="space-y-2">
          <label htmlFor="reseller" className="text-sm font-medium">
            {subChannel === 'reseller' ? 'Reseller' : 'Referral'} Name
          </label>
          <Select value={resellerId} onValueChange={setResellerId}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${subChannel}`} />
            </SelectTrigger>
            <SelectContent>
              {resellers
                .filter(r => r.type === subChannel)
                .map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="buyer-name" className="text-sm font-medium">
          Buyer Name
        </label>
        <Input
          id="buyer-name"
          placeholder="Enter buyer name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Order Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        {orderItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select 
                    value={item.productId} 
                    onValueChange={(value) => handleProductChange(item.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Variant</label>
                  <Select 
                    value={item.variantId} 
                    onValueChange={(value) => handleVariantChange(item.id, value)}
                    disabled={!item.productId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {item.productId && products
                        .find(p => p.id === item.productId)?.variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name} ({variant.size}) - Rp {variant.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per pcs</label>
                  <Input
                    type="number"
                    value={item.price}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={item.price * item.quantity}
                      readOnly
                      className="flex-1"
                    />
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(item.id)}
                        className="ml-2 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Total</h3>
            <p className="text-xl font-bold">Rp {calculateTotal().toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </div>
      
      {submitMessage && (
        <div className={`p-4 rounded-md ${submitMessage.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {submitMessage}
        </div>
      )}
    </form>
  )
}
