import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        // si hay un theme guardado, lo usamos
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || saved === "light") return saved;

        // Sino, vamos con el que este en el DOM (por si ya hay .dark en <html>)
        return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
        root.classList.add("dark");
        } else {
        root.classList.remove("dark");
        }

        // Guardar preferencia
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
        >
        {theme === "light" ? (
            <Moon className="w-5 h-5 text-slate-700" />
        ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
        )}
        </motion.button>
    );
}
