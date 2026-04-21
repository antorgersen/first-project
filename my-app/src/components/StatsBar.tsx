import type { LunchWish } from '@/types'

interface StatsBarProps {
  wishes: LunchWish[]
}

export function StatsBar({ wishes }: StatsBarProps) {
  const totalVotes = wishes.reduce((sum, w) => sum + w.votes, 0)

  return (
    <div className="flex gap-3">
      <div className="bg-white rounded-lg border border-zinc-200 px-4 py-2 text-sm shadow-sm">
        <span className="font-bold text-zinc-900">{wishes.length}</span>
        <span className="text-zinc-500 ml-1">ønsker</span>
      </div>
      <div className="bg-white rounded-lg border border-zinc-200 px-4 py-2 text-sm shadow-sm">
        <span className="font-bold text-zinc-900">{totalVotes}</span>
        <span className="text-zinc-500 ml-1">stemmer totalt</span>
      </div>
    </div>
  )
}
