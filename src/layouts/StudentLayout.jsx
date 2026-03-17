import authApi from "@/apis/auth.api";
import userApi from "@/apis/user.api";
import Footer from "@/components/misc/Footer";
import ProfilePhoto from "@/components/misc/ProfilePhoto";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import UserForm from "@/pages/admin/users/UserForm";
import { Dialog, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Switch, SwitchThumb } from "@radix-ui/react-switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

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

export default function StudentLayout() {
  const navigate = useNavigate();
  const { user, refetchAuthStatus } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

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

  const navItems = [
    { label: "Beranda", path: "" },
    { label: "Kelas", path: "/classes" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-surface-variant bg-surface sticky top-0 z-50 border-b"
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between px-6
            py-4"
        >
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative pb-2 text-base font-medium transition-colors
                  duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-grey hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute right-0 bottom-0 left-0 h-0.5
                          rounded-full bg-teal-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger>
                <ProfilePhoto src={user.gambar} alt={user.name} size="md" />
              </PopoverTrigger>
              <ProfilePopoverContent
                logoutLoading={logoutLoading}
                handleLogout={handleLogout}
                onAccountSettings={() => setIsProfileDialogOpen(true)}
                theme={theme}
                setTheme={setTheme}
              />
            </Popover>
          </div>
        </div>
      </header>

      <main className="bg-background flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />

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
    </div>
  );
}
