import { useTheme } from "@/contexts/theme";
import {Switch, SwitchThumb} from "@radix-ui/react-switch";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="content-wrapper">
      <title>Pengaturan | Geeksfarm</title>
      <header>
        <h1 className="h-rule text-5xl">Pengaturan</h1>
      </header>
      <article className="my-4">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="dark-mode">Tema gelap</label>
          <Switch
            id="dark-mode"
            className="switch-root"
            checked={theme == "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          >
            <SwitchThumb className="switch-thumb" />
          </Switch>
        </div>
      </article>
    </div>
  );
}
