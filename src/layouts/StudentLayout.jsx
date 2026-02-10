import Person from "@/assets/icons/Person";
import { NavLink, Outlet } from "react-router";

export default function StudentLayout() {
  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Kelas", path: "/kelas" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative pb-2 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-100 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Person
              className="h-full w-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
