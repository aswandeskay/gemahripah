import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

// Sample ingredient data
const ingredients = [
  { id: 'sugar', name: 'Sugar', unit: 'kg' },
  { id: 'coffee-beans', name: 'Coffee Beans', unit: 'kg' },
  { id: 'milk', name: 'Milk', unit: 'liter' },
  { id: 'chocolate-powder', name: 'Chocolate Powder', unit: 'kg' },
  { id: 'cups', name: 'Cups', unit: 'pcs' },
  { id: 'lids', name: 'Lids', unit: 'pcs' },
  { id: 'straws', name: 'Straws', unit: 'pcs' }
]

// Sample supplier data
const suppliers = [
  { id: 'supplier1', name: 'PT. Food Ingredient Indonesia' },
  { id: 'supplier2', name: 'CV. Berkah Jaya' },
  { id: 'supplier3', name: 'UD. Sumber Makmur' }
]

interface PurchaseItem {
  id: string
  ingredientId: string
  quantity: number
  unitPrice: number
}

export default function PurchaseForm() {
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date())
  const [supplierId, setSupplierId] = useState('')
  const [notes, setNotes] = useState('')
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { id: '1', ingredientId: '', quantity: 1, unitPrice: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Calculate total price
  const calculateTotal = () => {
    return purchaseItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  // Handle ingredient change
  const handleIngredientChange = (itemId: string, ingredientId: string) => {
    setPurchaseItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, ingredientId }
          : item
      )
    )
  }

  // Handle quantity change
  const handleQuantityChange = (itemId: string, quantity: number) => {
    setPurchaseItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Handle unit price change
  const handleUnitPriceChange = (itemId: string, unitPrice: number) => {
    setPurchaseItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, unitPrice }
          : item
      )
    )
  }

  // Add new purchase item
  const addPurchaseItem = () => {
    const newId = (Math.max(...purchaseItems.map(item => parseInt(item.id))) + 1).toString()
    setPurchaseItems([...purchaseItems, { id: newId, ingredientId: '', quantity: 1, unitPrice: 0 }])
  }

  // Remove purchase item
  const removePurchaseItem = (itemId: string) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(items => items.filter(item => item.id !== itemId))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate form
      if (!purchaseDate || !supplierId) {
        throw new Error('Please fill all required fields')
      }
      
      // Check if all purchase items have ingredient
      const invalidItems = purchaseItems.filter(item => !item.ingredientId)
      if (invalidItems.length > 0) {
        throw new Error('Please select ingredient for all items')
      }
      
      // Prepare purchase data
      const purchaseData = {
        purchaseDate: format(purchaseDate, 'yyyy-MM-dd'),
        supplierId,
        notes,
        items: purchaseItems.map(item => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total: calculateTotal()
      }
      
      // In a real application, you would send this data to your API
      console.log('Purchase data:', purchaseData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Purchase recorded successfully!')
      
      // Reset form
      setPurchaseDate(new Date())
      setSupplierId('')
      setNotes('')
      setPurchaseItems([{ id: '1', ingredientId: '', quantity: 1, unitPrice: 0 }])
      
    } catch (error) {
      console.error('Error submitting purchase:', error)
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="purchase-date" className="text-sm font-medium">
            Purchase Date
          </label>
          <DatePicker
            value={purchaseDate}
            onChange={setPurchaseDate}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="supplier" className="text-sm font-medium">
            Supplier
          </label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Input
          id="notes"
          placeholder="Enter notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Purchase Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addPurchaseItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        {purchaseItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ingredient</label>
                  <Select 
                    value={item.ingredientId} 
                    onValueChange={(value) => handleIngredientChange(item.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
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
                  <label className="text-sm font-medium">Unit Price</label>
                  <Input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleUnitPriceChange(item.id, Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={item.unitPrice * item.quantity}
                      readOnly
                      className="flex-1"
                    />
                    {purchaseItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePurchaseItem(item.id)}
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
          {isSubmitting ? 'Submitting...' : 'Record Purchase'}
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
