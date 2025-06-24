"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function UserNav() {
  return (
    <Button asChild variant="ghost" className="relative h-8 w-8 rounded-full">
      <Link href="/app/profile">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://files.catbox.moe/uvi8l9.png" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="sr-only">User Profile</span>
      </Link>
    </Button>
  )
}
