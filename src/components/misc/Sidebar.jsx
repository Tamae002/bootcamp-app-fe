import authApi from "@/apis/auth.api";
import ChevronRight from "@/assets/icons/ChevronRight";
import KebabMenu from "@/assets/icons/KebabMenu";
import Person from "@/assets/icons/Person";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
} from "@radix-ui/react-popover";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Throbber from "./Throbber";
import { useEffect } from "react";

function ProfilePopoverContent({ logoutLoading, handleLogout }) {
  return (
    <PopoverPortal>
      <PopoverContent className="popover-content">
        <button onClick={handleLogout} className="popover-button">
          {logoutLoading && <Throbber />}
          Logout
        </button>
      </PopoverContent>
    </PopoverPortal>
  );
}

export default function Sidebar({ navItems }) {
  const navigate = useNavigate();
  const { user, refetchAuthStatus } = useAuth();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    Boolean(
      localStorage.getItem("sidebar-collapsed") ?? window.innerWidth <= 768,
    ),
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

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed ? "1" : "");
  }, [sidebarCollapsed]);

  return (
    <aside className="max-md:w-14">
      <div
        className={`sidebar z-50 max-md:absolute
          ${sidebarCollapsed ? "w-14" : "w-63"}`}
      >
        {/* Sidebar Header */}
        <div className="flex w-8/10 items-center justify-between px-2 pt-7 pb-3">
          <img
            src={theme === "dark" ? LogotypeDark : Logotype}
            className={`h-full shrink-0 object-contain
              ${sidebarCollapsed && "hidden"}`}
            alt="Logo"
          />
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="aspect-square h-10 p-2"
          >
            <ChevronRight
              className={`inline-block aspect-square h-full transition-transform
                ${!sidebarCollapsed && "rotate-180"}`}
            />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col items-stretch gap-1 overflow-y-auto
            p-2"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="navlink"
              onClick={() =>
                window.innerWidth <= 768 && setSidebarCollapsed(true)
              }
            >
              {item.icon}
              {!sidebarCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profil Pengguna */}
        <section
          className="border-grey flex items-center gap-2 border-t p-3
            text-nowrap"
        >
          {/* Photo Profile Popover */}
          <Popover>
            <PopoverTrigger>
              {user.gambar ? (
                <img
                  src={user.gambar}
                  className="size-8 shrink-0 rounded-full"
                  alt="User"
                />
              ) : (
                <Person
                  className="size-8 shrink-0 rounded-full bg-neutral-400
                    text-white"
                />
              )}
            </PopoverTrigger>
            <ProfilePopoverContent
              logoutLoading={logoutLoading}
              handleLogout={handleLogout}
            />
          </Popover>

          <div
            className={`min-w-0 flex-1 gap-px text-left
              ${sidebarCollapsed && "hidden"}`}
          >
            <p className="text-grey text-xs">Welcome back 👋</p>
            <p
              className="overflow-hidden text-sm text-ellipsis
                whitespace-nowrap"
            >
              {user.name}
            </p>
          </div>

          {/* Kebab Menu Popover */}
          <Popover>
            <PopoverTrigger
              className={`hover:bg-overlay-md rounded-lg
                ${sidebarCollapsed && "hidden"}`}
            >
              <KebabMenu className="size-6" />
            </PopoverTrigger>
            <ProfilePopoverContent
              logoutLoading={logoutLoading}
              handleLogout={handleLogout}
            />
          </Popover>
        </section>
      </div>
    </aside>
  );
}
