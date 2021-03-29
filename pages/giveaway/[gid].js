import { useRouter } from 'next/router'

export default function GiveawayPage () {
  const router = useRouter()
  const { gid } = router.query

  return <p>Giveaway: {gid}</p>
}