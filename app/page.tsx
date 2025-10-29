import Image from "next/image";
import ExploreBtn from "@/components/ui/ExploreBtn";
import EventCard from "@/components/ui/EventCard";
import { events } from "@/lib/constants";
  
export default function Home() {
  return (
   <section>
    <div className="container">
      <h1 className="text-center">The Eventaoy for Every Dev <br/>
      Event You Can’t Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div>
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((item) => (
            <li key={item.slug}>
              <EventCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
  )
}
