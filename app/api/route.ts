// app/api/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";


// POST

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const userRole = session.user.role;
  const { title, eventDate, description, endDate } = await req.json();

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        eventDate: new Date(eventDate),
        description,
        endDate: endDate ? new Date(endDate) : null,
        visibility: userRole === "teacher" ? "global" : "private", 
        createdBy: userId.toString(),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// GET

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  const { searchParams } = new URL(req.url);
  const selectedDate = searchParams.get("datetime-local");

  if (!selectedDate) {
    return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
  }

  const [year, month] = selectedDate.split("-").map(Number);
  if (!year || !month) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  let events;

  try {
    if (userRole === "teacher") {
      events = await prisma.event.findMany({
        where: {
          eventDate: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        },
      });
    } else {
      // Students see only global events + their own private events within the selected month
      events = await prisma.event.findMany({
        where: {
          AND: [
            {
              eventDate: {
                gte: new Date(year, month - 1, 1),
                lte: new Date(year, month, 1),
              },
            },
            {
              OR: [{ visibility: "global" }, { createdBy: userId.toString() }],
            },
          ],
        },
      });
    }
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

