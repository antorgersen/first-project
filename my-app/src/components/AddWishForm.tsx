import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { LunchWish } from '@/types'

interface AddWishFormProps {
  onAdd: (wish: LunchWish) => void
}

export function AddWishForm({ onAdd }: AddWishFormProps) {
  const [item, setItem] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item.trim() || !name.trim()) return

    setLoading(true)
    const { data, error } = await supabase
      .from('lunch_wishes')
      .insert({ item: item.trim(), requested_by: name.trim() })
      .select()
      .single()

    if (error) {
      toast.error('Kunne ikke legge til ønske. Prøv igjen.')
    } else {
      toast.success('Ønske lagt til! 🎉')
      onAdd(data as LunchWish)
      setItem('')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Legg til ønske</CardTitle>
        <CardDescription>Hva savner du på lunsjbordet?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Hvitost, kaffe, oliven..."
            value={item}
            onChange={e => setItem(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Input
            placeholder="Ditt navn"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            className="sm:w-36"
          />
          <Button
            type="submit"
            disabled={loading || !item.trim() || !name.trim()}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? 'Legger til...' : 'Legg til'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
