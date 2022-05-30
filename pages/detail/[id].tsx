import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";

const Detail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return <div>
    <h3>Detail: {id}</h3>
    <p><Link href="/">back market</Link></p>
  </div>
}

export default Detail