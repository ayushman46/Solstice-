
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
} from "@/components/ui/sidebar";
import { UserMenu } from "../auth/UserMenu";
import { NavLink } from "react-router-dom";
import { BarChartBig, Home, MessageSquare, PiggyBank, Settings, TrendingUp, Wallet2 } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Wallet2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">Fin Pal</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Transactions</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/savings"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <PiggyBank className="h-4 w-4 mr-2" />
                    <span>Savings Goals</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/insights"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <BarChartBig className="h-4 w-4 mr-2" />
                    <span>Insights</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Chat Assistant</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
