import authApi from "@/apis/auth.api";
import userApi from "@/apis/user.api";
import ChevronRight from "@/assets/icons/ChevronRight";
import KebabMenu from "@/assets/icons/KebabMenu";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import UserForm from "@/pages/admin/users/UserForm";
import { Dialog, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { Switch, SwitchThumb } from "@radix-ui/react-switch";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import ProfilePhoto from "./ProfilePhoto";
import Throbber from "./Throbber";

function ProfilePopoverContent({
  logoutLoading,
  handleLogout,
  onAccountSettings,
  theme,
  setTheme,
}) {
  return (
    <PopoverPortal>
      <PopoverContent className="popover-content">
        <div className="flex items-center justify-between gap-4 px-3 py-2">
          <span className="text-sm">Tema gelap</span>
          <Switch
            className="switch-root"
            checked={theme == "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          >
            <SwitchThumb className="switch-thumb" />
          </Switch>
        </div>
        <button onClick={onAccountSettings} className="popover-button">
          Pengaturan
        </button>
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
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    Boolean(
      localStorage.getItem("sidebar-collapsed") ?? window.innerWidth <= 768,
    ),
  );
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      if (import.meta.env.VITE_ENV == "development") console.error(err);
    } finally {
      await refetchAuthStatus();
      setLogoutLoading(false);
    }
  };

  const updateUserMutation = useMutation({
    // @ts-ignore
    mutationFn: ({ name, email, gambar }) =>
      userApi.updateUser(user.user_id, {
        name,
        email,
        gambar,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      refetchAuthStatus();
      setFormError(null);
      setIsProfileDialogOpen(false);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        setFormError(err.response?.data?.message || "Gagal update profil");
      } else {
        setFormError("Gagal update profil");
      }
    },
  });

  const handleUpdateProfile = (data) => {
    updateUserMutation.mutate(data);
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
              <ProfilePhoto
                src={user.gambar}
                alt={user.name}
                size="sm"
                className="shrink-0"
              />
            </PopoverTrigger>
            <ProfilePopoverContent
              logoutLoading={logoutLoading}
              handleLogout={handleLogout}
              onAccountSettings={() => setIsProfileDialogOpen(true)}
              theme={theme}
              setTheme={setTheme}
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
              onAccountSettings={() => setIsProfileDialogOpen(true)}
              theme={theme}
              setTheme={setTheme}
            />
          </Popover>
        </section>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog
        open={isProfileDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsProfileDialogOpen(false);
            setFormError(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay className="dialog-overlay">
            <UserForm
              initial={user}
              onSubmit={handleUpdateProfile}
              onClose={() => {
                setIsProfileDialogOpen(false);
                setFormError(null);
              }}
              isEdit={true}
              error={formError}
              isLoading={updateUserMutation.isPending}
            />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </aside>
  );
}
