import authApi from "@/api/auth.api";
import ChevronRight from "@/assets/icons/ChevronRight";
import KebabMenu from "@/assets/icons/KebabMenu";
import Person from "@/assets/icons/Person";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Throbber from "./Throbber";

export default function Sidebar({ navItems }) {
  const navigate = useNavigate();
  const { user, refetchAuthStatus } = useAuth();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth <= 768,
  );
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      if (import.meta.env.VITE_ENV == "development") console.error(err);
    } finally {
      refetchAuthStatus();
      navigate("/");
      setLogoutLoading(false);
    }
  };

  return (
    <aside className="max-md:w-14">
      <div
        className={`sidebar max-md:absolute ${sidebarCollapsed ? "w-14" : "w-63"}`}
      >
        {/* Sidebar Header */}
        <div className="flex w-8/10 items-center justify-between px-2 pt-7 pb-3">
          <img
            src={theme === "dark" ? LogotypeDark : Logotype}
            className={`h-full shrink-0 object-contain ${sidebarCollapsed && "hidden"}`}
            alt="Logo"
          />
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="aspect-square h-10 p-2"
          >
            <ChevronRight
              className={`inline-block aspect-square h-full transition-transform ${!sidebarCollapsed && "rotate-180"}`}
            />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-stretch gap-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarCollapsed(false)}
            >
              {item.icon}
              {!sidebarCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profil Pengguna */}
        <section className="border-grey flex items-center gap-2 border-t p-3 text-nowrap">
          {user.image ? (
            <img
              src={user.image}
              className="size-8 shrink-0 rounded-full"
              alt="User"
            />
          ) : (
            <Person className="size-8 shrink-0 rounded-full bg-neutral-400 text-white" />
          )}
          <div className={`min-w-0 gap-px ${sidebarCollapsed && "hidden"}`}>
            <p className="text-grey text-xs">Welcome back 👋</p>
            <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              {user.name}
            </p>
          </div>
          <Popover.Root>
            <Popover.Trigger
              className={`rounded-lg hover:bg-overlay-md ${sidebarCollapsed && "hidden"}`}
            >
              <KebabMenu />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="bg-background rounded-lg p-1 shadow-md">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded p-2 text-left text-sm hover:bg-overlay-md">
                  {logoutLoading && <Throbber />}
                  Logout
                </button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </section>
      </div>
    </aside>
  );
}
