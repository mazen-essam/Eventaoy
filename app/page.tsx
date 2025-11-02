import ExploreBtn from "@/components/ui/ExploreBtn";
import EventCard from "@/components/ui/EventCard";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";
import { events } from "@/lib/constants";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default async function Home() {
  'use cache'
  cacheLife('hours');
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { events } = await response.json();
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
          {events && events.length > 0 && events.map((item) => (
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
