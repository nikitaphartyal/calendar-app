// app/api/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";



// PUT (Update Event)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const userId = session.user.id;
    const userRole = session.user.role;
    const { id } = params;
    const { title, eventDate, description, endDate } = await req.json();
  
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });
  
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
  
      // Only allow the event creator or a teacher to update
      if (event.createdBy !== userId.toString() && userRole !== "teacher") {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
  
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title,
          eventDate: eventDate ? new Date(eventDate) : event.eventDate,
          description,
          endDate: endDate ? new Date(endDate) : null,
        },
      });
  
      return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error) {
      console.error("Error updating event:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  
  
  // DELETE (Delete Event)
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const userId = session.user.id;
    const userRole = session.user.role;
    const { id } = params;
  
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });
  
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
  
      // Only allow the event creator or a teacher to delete
      if (event.createdBy !== userId.toString() && userRole !== "teacher") {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
      console.log("Event Created By:", event.createdBy, "UserID:", userId);

  
      await prisma.event.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting event:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  