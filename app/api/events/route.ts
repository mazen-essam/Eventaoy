import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import {v2 as cloudinary }from 'cloudinary';
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        let event;
        try {
            event = Object.fromEntries(formData.entries());
        } catch {
            return NextResponse.json({ message: 'Invalid JSON data format' }, { status: 400 });
        }
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ message: 'Image is required' }, { status: 400 });
        }
        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadImage = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'image',
                folder: 'events',
            }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            }).end(buffer);
        });
        event.image = (uploadImage as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({...event, tags: tags, agenda: agenda});
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error ?? 'Unknown error');
        return NextResponse.json({ message: 'Event creation failed', error: errorMessage }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events retrieved successfully', events }, { status: 200 });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error ?? 'Unknown error');
        return NextResponse.json({ message: 'Event retrieval failed', error: errorMessage }, { status: 500 });
    }
}