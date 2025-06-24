"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function UserNav() {
  const [avatarUrl, setAvatarUrl] = useState("https://files.catbox.moe/uvi8l9.png");

  useEffect(() => {
    const updateAvatar = () => {
        const storedGender = localStorage.getItem('mathMindUserGender');
        if (storedGender === 'female') {
          setAvatarUrl('https://files.catbox.moe/rv4git.jpg');
        } else {
          setAvatarUrl('https://files.catbox.moe/uvi8l9.png');
        }
    };
    
    updateAvatar();
    window.addEventListener('pageshow', updateAvatar);
    
    return () => {
        window.removeEventListener('pageshow', updateAvatar);
    };
  }, []);

  return (
    <Button asChild variant="ghost" className="relative h-8 w-8 rounded-full">
      <Link href="/app/profile">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="sr-only">User Profile</span>
      </Link>
    </Button>
  )
}
