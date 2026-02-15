import * as React from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/custom/nav-main"
// import { NavProjects } from "@/components/custom/nav-projects"
// import { NavTests } from "@/components/custom/nav-tests"
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
import { useAuth } from "@/provider/auth-provider"
import { decodeToken } from "@/lib/jwt-decode"
import { NavInventories } from "../custom/nav-inventories"
import { NavTransactions } from "../custom/nav-transactions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { token } = useAuth();
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
        <NavInventories label="Gudang Kecil" items={Menu.navInventory} />
        <NavTransactions label="Transaksi CMT" items={Menu.navCMTTransaction} />
        <NavTransactions label="Mutasi Gudang" items={Menu.navWarehouseMutation} />
        <NavTransactions label="Transaksi Toko Online" items={Menu.navStoreTransaction} />
        <NavMain label="Sistem" items={Menu.navMaster} />
        {/* <NavTests tests={Menu.tests} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ avatar: "", ...decodeToken(token ?? "") }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
