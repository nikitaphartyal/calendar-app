// app/calendar/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {session.user.role === "teacher" ? "Teacher Calendar" : "Student Calendar"}
          </h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {session.user.name}</span>
            <a 
              href="/api/auth/signout"
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}