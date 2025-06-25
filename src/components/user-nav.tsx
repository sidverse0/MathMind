"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"

export function UserNav() {
  const { user, userData } = useUser()

  if (!user || !userData) {
    return null
  }

  return (
    <Link href="/app/profile" passHref>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userData.avatar} alt={userData.name || ''} />
          <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </Button>
    </Link>
  )
}
