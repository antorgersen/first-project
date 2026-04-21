export interface LunchWish {
  id: string
  item: string
  requested_by: string
  votes: number
  status: 'ønsket' | 'kjøpt'
  created_at: string
}
