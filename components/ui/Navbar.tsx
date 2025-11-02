import Link from "next/link"
import Image from "next/image"
const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>Eventaoy</p>
        </Link>
        <ul>
          <li className="list-none">
            <Link href="/">Home</Link>
          </li>
          <li className="list-none">
            <Link href="/">Events</Link>
          </li>
          <li className="list-none">
            <Link href="/">Create Event</Link>
          </li>
        </ul>
        {/* <button>
          <Link href="/login">Login</Link>
        </button>
        <button>
          <Link href="/register">Register</Link>
        </button> */}
      </nav>
    </header>
  )
}

export default Navbar