import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { useCallback } from "react"
import { hasRole } from "@/lib/jwt-decode"
import { useAuth } from "@/provider/auth-provider"

export function NavMain({
  label,
  items,
}: {
  label: string,
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    role: string[]
    items?: {
      title: string
      url: string
      role: string[]
    }[]
  }[]
}) {
  const path = useLocation().pathname;
  const { token } = useAuth();
  const navRole = [...new Set(items.flatMap(item => item.role))];
  const checkActive = useCallback((url: string) => path === url ? true : false, [path]);
  const checkRole = (roles: string[]) => {
    if (token) return roles.some(role => hasRole(token, role))
  };
  return checkRole(navRole) ? (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (item.role ? checkRole(item.role) : true) && (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (subItem.role ? checkRole(subItem.role) : true) && (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={checkActive(subItem.url)}>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ) : undefined;
}
