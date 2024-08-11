"use client"

import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SunIcon, MoonIcon } from 'lucide-react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../app/api/chat/firebase"; // Import Firebase Auth instance
import { useEffect, useState } from "react";
import { useUser } from '@clerk/nextjs';
import { FirebaseError } from "firebase/app"; // Import FirebaseError

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Navbar = () => {
  const { user } = useUser();

  useEffect(() => {
    const createFirebaseUser = async () => {
      if (user) {
        try {
          const email = user.emailAddresses[0]?.emailAddress;
          const password = user.id; // Using Clerk user ID as the password

          if (email) {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Firebase user created successfully");
          } else {
            console.error("User does not have an email address.");
          }
        } catch (error) {
          const firebaseError = error as FirebaseError; // Type assertion

          if (firebaseError.code === "auth/email-already-in-use") {
            console.log("User already exists in Firebase, skipping creation.");
          } else {
            console.error("Error creating Firebase user:", firebaseError);
          }
        }
      }
    };

    createFirebaseUser();
  }, [user]);
  return (
    <nav className="bg-white dark:bg-slate-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white shrink-0">
            Customer Support
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ModeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
                
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;