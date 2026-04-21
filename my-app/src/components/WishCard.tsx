import { ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LunchWish } from '@/types'

interface WishCardProps {
  wish: LunchWish
  onVote: (wish: LunchWish) => void
}

export function WishCard({ wish, onVote }: WishCardProps) {
  const hasVoted = localStorage.getItem(`voted_${wish.id}`) === 'true'

  return (
    <Card className={cn("transition-all", wish.status === 'kjøpt' && "opacity-60")}>
      <CardContent className="flex items-center justify-between py-4 px-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-zinc-900">{wish.item}</span>
            {wish.status === 'kjøpt' && (
              <Badge variant="success">Kjøpt inn ✓</Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500 mt-0.5">Ønsket av {wish.requested_by}</p>
        </div>

        <button
          onClick={() => !hasVoted && onVote(wish)}
          disabled={hasVoted}
          aria-label={hasVoted ? 'Allerede stemt' : 'Stem for dette ønsket'}
          className={cn(
            "flex flex-col items-center gap-0.5 ml-4 px-3 py-2 rounded-xl transition-all select-none",
            hasVoted
              ? "bg-amber-100 text-amber-600 cursor-default"
              : "text-zinc-400 hover:bg-amber-50 hover:text-amber-500 active:scale-95 cursor-pointer"
          )}
        >
          <ChevronUp className="h-5 w-5" />
          <span className="text-sm font-bold leading-none">{wish.votes}</span>
        </button>
      </CardContent>
    </Card>
  )
}
