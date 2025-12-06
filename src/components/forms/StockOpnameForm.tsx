import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

// Sample ingredient data with current stock
const ingredients = [
  { id: 'sugar', name: 'Sugar', unit: 'kg', currentStock: 15.5 },
  { id: 'coffee-beans', name: 'Coffee Beans', unit: 'kg', currentStock: 8.2 },
  { id: 'milk', name: 'Milk', unit: 'liter', currentStock: 22.0 },
  { id: 'chocolate-powder', name: 'Chocolate Powder', unit: 'kg', currentStock: 5.8 },
  { id: 'cups', name: 'Cups', unit: 'pcs', currentStock: 150 },
  { id: 'lids', name: 'Lids', unit: 'pcs', currentStock: 140 },
  { id: 'straws', name: 'Straws', unit: 'pcs', currentStock: 180 }
]

interface StockOpnameItem {
  id: string
  ingredientId: string
  systemStock: number
  physicalStock: number
  difference: number
}

export default function StockOpnameForm() {
  const [opnameDate, setOpnameDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState('')
  const [stockItems, setStockItems] = useState<StockOpnameItem[]>(
    ingredients.map(ingredient => ({
      id: ingredient.id,
      ingredientId: ingredient.id,
      systemStock: ingredient.currentStock,
      physicalStock: ingredient.currentStock,
      difference: 0
    }))
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Handle physical stock change
  const handlePhysicalStockChange = (itemId: string, physicalStock: number) => {
    setStockItems(items => 
      items.map(item => {
        if (item.id === itemId) {
          const difference = physicalStock - item.systemStock
          return { ...item, physicalStock, difference }
        }
        return item
      })
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate form
      if (!opnameDate) {
        throw new Error('Please select opname date')
      }
      
      // Prepare stock opname data
      const stockOpnameData = {
        opnameDate: format(opnameDate, 'yyyy-MM-dd'),
        notes,
        items: stockItems.map(item => ({
          ingredientId: item.ingredientId,
          systemStock: item.systemStock,
          physicalStock: item.physicalStock,
          difference: item.difference
        }))
      }
      
      // In a real application, you would send this data to your API
      console.log('Stock opname data:', stockOpnameData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitMessage('Stock opname recorded successfully!')
      
      // Reset form
      setOpnameDate(new Date())
      setNotes('')
      setStockItems(
        ingredients.map(ingredient => ({
          id: ingredient.id,
          ingredientId: ingredient.id,
          systemStock: ingredient.currentStock,
          physicalStock: ingredient.currentStock,
          difference: 0
        }))
      )
      
    } catch (error) {
      console.error('Error submitting stock opname:', error)
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="opname-date" className="text-sm font-medium">
            Opname Date
          </label>
          <DatePicker
            value={opnameDate}
            onChange={setOpnameDate}
          />
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
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Stock Items</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Ingredient</th>
                <th className="text-left p-2">Unit</th>
                <th className="text-left p-2">System Stock</th>
                <th className="text-left p-2">Physical Stock</th>
                <th className="text-left p-2">Difference</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => {
                const ingredient = ingredients.find(i => i.id === item.ingredientId)
                const hasDifference = item.difference !== 0
                
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{ingredient?.name}</td>
                    <td className="p-2">{ingredient?.unit}</td>
                    <td className="p-2">{item.systemStock}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={item.physicalStock}
                        onChange={(e) => handlePhysicalStockChange(item.id, Number(e.target.value))}
                        className={hasDifference ? 'border-red-500' : ''}
                      />
                    </td>
                    <td className={`p-2 ${hasDifference ? 'text-red-500 font-medium' : ''}`}>
                      {item.difference > 0 && '+'}{item.difference}
                      {hasDifference && (
                        <span className="ml-1">
                          <AlertCircle className="inline h-4 w-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Record Stock Opname'}
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
