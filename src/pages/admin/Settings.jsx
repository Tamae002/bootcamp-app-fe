import { useTheme } from "@/contexts/theme";
import * as Switch from "@radix-ui/react-switch";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="m-auto max-w-2xl p-8">
      <title>Pengaturan | Geeksfarm</title>
      <header>
        <h1 className="h-rule text-5xl">Pengaturan</h1>
      </header>
      <article className="my-4">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="dark-mode">Tema gelap</label>
          <Switch.Root
            id="dark-mode"
            className="switch-root"
            checked={theme == "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          >
            <Switch.Thumb className="switch-thumb" />
          </Switch.Root>
        </div>
      </article>
    </div>
  );
}
