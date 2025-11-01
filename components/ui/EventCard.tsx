import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
}
const EventCard = ({title , image, location, date, time, slug}: Props) => {
  return (
   <Link href={`/events/${slug}`} className="event-card" id="event-card">
    <Image src={image} alt={title} width={410} height={300} className="poster" />
       <div className="flex gap-2 flex-row">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p className="location">{location}</p>
       
       </div>
       
       
        <p className="title">{title}</p>
        <div className="datetime">
        <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
        <p className="date">{date}</p>
        <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
        <p className="time">{time}</p>
        </div>
   </Link>
  )
}

export default EventCard