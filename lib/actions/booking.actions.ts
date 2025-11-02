'use server';
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
export async function createBooking({ eventId, slug, email }: { eventId: string, slug: string, email: string }) {
    try {
        await connectDB();
        await  Booking.create({ eventId, slug, email });
        return { success: true, message: 'Booking created successfully' };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'Error creating booking' };
    }
}