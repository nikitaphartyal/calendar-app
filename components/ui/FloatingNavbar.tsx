"use client";
import React, { useCallback, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signIn, useSession, signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    requiresAuth?: boolean;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [previousTimeoutId, setPreviousTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [token, setToken] = useState("");
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      setVisible(true);
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }
      setPreviousTimeoutId(
        setTimeout(() => {
          setPreviousTimeoutId(null);
          setVisible(false);
        }, 3000)
      );
    }
  });

  const handleProfileClick = () => {
    if (session) {
      // Retrieve the token from the session object
      // @ts-ignore
      const userToken = session.user.token;
      console.log(userToken);
      setToken(userToken ? JSON.stringify(userToken) : "No token found");
    }
  };

  const handledashboardNavigation = () => {
    router.push("/workspace");
  };

  // Filter nav items based on session
  const filteredNavItems = navItems.filter((item) => {
    // If user is logged in, show all items
    if (session) {
      return item.requiresAuth;
    }
    // If user is not logged in, only show items with requiresAuth: false
    return !item.requiresAuth;
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex max-w-fit fixed z-[5000] top-6 inset-x-0 mx-auto px-8 py-4 items-center justify-center space-x-6",
          "backdrop-blur-md bg-white/10 dark:bg-gray-900/60",
          "border border-white/[0.2] dark:border-gray-800",
          "rounded-full shadow-lg shadow-black/[0.03]",
          "transition-all duration-200",
          className
        )}
      >
        <Button
          variant="outline"
          onClick={() => {
            theme === "dark" ? setTheme("light") : setTheme("dark");
          }}
          className="bg-transparent border-none"
        >
          {theme === "dark" ? (
            <MdOutlineWbSunny className="text-black dark:text-white" />
          ) : (
            <FaMoon className="text-black dark:text-black" />
          )}
        </Button>

        <div className="flex items-center space-x-6">

          {filteredNavItems.map((navItem, idx) => (
            <Link key={navItem.link} href={navItem.link} passHref>
              <p className="relative group flex items-center space-x-1">
                <span className="text-sm font-medium text-black dark:text-white 
                               hover:text-gray-300 dark:hover:text-white 
                               transition-colors duration-200">
                  {navItem.name}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r 
                               from-blue-500 to-purple-500 group-hover:w-full 
                               transition-all duration-300" />
              </p>
            </Link>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700" />

        {session ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={handledashboardNavigation}
              className="px-4 py-2 text-sm font-medium text-white 
                       bg-gradient-to-r from-blue-500 to-purple-500 
                       rounded-full hover:opacity-90 transition-opacity
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Dashboard
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-4 py-2 text-sm font-medium text-white 
                     bg-gradient-to-r from-blue-500 to-purple-500 
                     rounded-full hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        )}

      </motion.div>
    </AnimatePresence>
  );
};
