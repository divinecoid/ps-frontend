import * as React from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/custom/nav-main"
// import { NavProjects } from "@/components/custom/nav-projects"
import { NavTests } from "@/components/custom/nav-tests"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Menu } from "@/config/menu"
import { Link } from "react-router-dom"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">PS Frontend</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Menu.navMain} />
        {/* <NavProjects projects={Menu.projects} /> */}
        <NavTests tests={Menu.tests} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={Menu.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
