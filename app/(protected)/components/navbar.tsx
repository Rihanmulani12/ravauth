"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-4">
        <Button
          asChild
          variant={pathname === "/server" ? "defalut" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>

        <Button
          asChild
          //@ts-ignore
          variant={pathname === "/client" ? "defalut" : "outline"} 
        >
          <Link href="/client">Client</Link>
        </Button>

        <Button asChild variant={pathname === "/admin" ? "defalut" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>

        <Button asChild variant={pathname === "/settings" ? "" : "outline"}>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton/>
    </nav>
  );
};
