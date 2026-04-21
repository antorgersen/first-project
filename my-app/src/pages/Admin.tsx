import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { LunchWish } from '@/types'

export default function Admin() {
  const [wishes, setWishes] = useState<LunchWish[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<LunchWish | null>(null)

  const fetchWishes = useCallback(async () => {
    const { data, error } = await supabase
      .from('lunch_wishes')
      .select('*')
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Kunne ikke laste ønsker.')
    } else {
      setWishes(data as LunchWish[])
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishes()

    const channel = supabase
      .channel('admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lunch_wishes' }, fetchWishes)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchWishes])

  const toggleStatus = async (wish: LunchWish) => {
    const newStatus = wish.status === 'ønsket' ? 'kjøpt' : 'ønsket'
    const { error } = await supabase
      .from('lunch_wishes')
      .update({ status: newStatus })
      .eq('id', wish.id)

    if (error) toast.error('Kunne ikke oppdatere status.')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    const { error } = await supabase
      .from('lunch_wishes')
      .delete()
      .eq('id', deleteTarget.id)

    if (error) {
      toast.error('Kunne ikke slette ønske.')
    } else {
      toast.success('Ønske slettet.')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Admin — Lunsjønsker</h1>
            <p className="text-sm text-zinc-500">Administrer ønsker og kjøpsstatus</p>
          </div>
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            ← Tilbake til appen
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : wishes.length === 0 ? (
          <p className="text-center text-zinc-500 py-12">Ingen ønsker enda.</p>
        ) : (
          <div className="space-y-2">
            {wishes.map(wish => (
              <Card key={wish.id}>
                <CardContent className="flex items-center justify-between py-3 px-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-zinc-900">{wish.item}</span>
                      <Badge variant={wish.status === 'kjøpt' ? 'success' : 'secondary'}>
                        {wish.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500">
                      Av {wish.requested_by} · {wish.votes} stemmer
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(wish)}>
                      {wish.status === 'ønsket' ? 'Marker kjøpt' : 'Marker ønsket'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(wish)}>
                      Slett
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett ønske</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette «{deleteTarget?.item}»? Dette kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Avbryt</Button>
            <Button variant="destructive" onClick={handleDelete}>Ja, slett</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
