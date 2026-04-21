import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { AddWishForm } from '@/components/AddWishForm'
import { WishCard } from '@/components/WishCard'
import { StatsBar } from '@/components/StatsBar'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { LunchWish } from '@/types'

function sortWishes(list: LunchWish[]): LunchWish[] {
  return [...list].sort((a, b) =>
    b.votes !== a.votes
      ? b.votes - a.votes
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export default function Home() {
  const [wishes, setWishes] = useState<LunchWish[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('lunch_wishes')
        .select('*')
        .order('votes', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Kunne ikke laste ønsker. Prøv å refreshe siden.')
      } else {
        setWishes(data as LunchWish[])
      }
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel('lunch_wishes_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lunch_wishes' },
        (payload) => {
          setWishes(prev => {
            if (prev.some(w => w.id === (payload.new as LunchWish).id)) return prev
            return sortWishes([payload.new as LunchWish, ...prev])
          })
        })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lunch_wishes' },
        (payload) => {
          setWishes(prev => sortWishes(prev.map(w =>
            w.id === (payload.new as LunchWish).id ? payload.new as LunchWish : w
          )))
        })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'lunch_wishes' },
        (payload) => {
          setWishes(prev => prev.filter(w => w.id !== (payload.old as { id: string }).id))
        })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleVote = async (wish: LunchWish) => {
    const key = `voted_${wish.id}`
    if (localStorage.getItem(key)) return

    localStorage.setItem(key, 'true')
    setWishes(prev => sortWishes(prev.map(w =>
      w.id === wish.id ? { ...w, votes: w.votes + 1 } : w
    )))

    const { error } = await supabase
      .from('lunch_wishes')
      .update({ votes: wish.votes + 1 })
      .eq('id', wish.id)

    if (error) {
      toast.error('Kunne ikke stemme. Prøv igjen.')
      localStorage.removeItem(key)
      setWishes(prev => sortWishes(prev.map(w =>
        w.id === wish.id ? { ...w, votes: wish.votes } : w
      )))
    }
  }

  const handleAdd = (wish: LunchWish) => {
    setWishes(prev => {
      if (prev.some(w => w.id === wish.id)) return prev
      return sortWishes([wish, ...prev])
    })
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-zinc-900">🥗 Lunsjønsker</h1>
          <p className="text-zinc-500 mt-1">
            Hva vil du ha til lunsj? Legg inn ønsker og stem på favorittene!
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <StatsBar wishes={wishes} />
        <AddWishForm onAdd={handleAdd} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : wishes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {wishes.map(wish => (
              <WishCard key={wish.id} wish={wish} onVote={handleVote} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
