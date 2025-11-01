import Image from "next/image";
import ExploreBtn from "@/components/ui/ExploreBtn";
import EventCard from "@/components/ui/EventCard";
import { events } from "@/lib/constants";
import { IEvent } from "@/database/event.model";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default async function Home() {
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  console.log(events);
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
          {events && events.length > 0 && events.map((item: IEvent) => (
            <li key={item.slug} className="list-none">
              <EventCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
  )
}
