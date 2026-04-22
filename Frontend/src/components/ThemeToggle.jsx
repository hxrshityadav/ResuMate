import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } =
        useTheme();

    return (
        <button
            onClick={() =>
                setTheme(
                    theme === "dark"
                        ? "light"
                        : "dark"
                )
            }
            className="h-10 w-10 rounded-xl border bg-card flex items-center justify-center hover:scale-105 transition"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}