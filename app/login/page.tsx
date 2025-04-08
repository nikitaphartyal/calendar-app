"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        role, // Pass role to credentials
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/calendar");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Login</h1>
        
        {registered && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">
            Registration successful! Please login.
          </div>
        )}
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 bg-gray-700 rounded text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 bg-gray-700 rounded text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="role" className="block text-white mb-2">
              Login as
            </label>
            <select
              id="role"
              className="w-full p-3 bg-gray-700 rounded text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}