"use client";

import { useSearchQuery } from "@/context/SearchQueryContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Heart, Home } from "lucide-react";
import { NavUser } from "./NavUser";
import { SearchBar } from "./SearchBar";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/#",
      icon: Home,
    },
    {
      title: "Favourites",
      url: "/favourites",
      icon: Heart,
    },
  ],
};

export function AppSidebar() {
  const { setSearchQuery } = useSearchQuery();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="gap-1.5">
          <SidebarGroupLabel className="text-2xl">Cineflix</SidebarGroupLabel>
          <SearchBar onSearch={handleSearch} />
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
