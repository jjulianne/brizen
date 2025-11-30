import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";


const HamburgerButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-10 h-10 flex flex-col justify-center items-center transition-all duration-300 z-50 relative rounded-full hover:bg-brizen-pink-light/50 dark:hover:bg-white/10 text-gray-900 dark:text-white group"
        aria-label="Toggle Menu"
    >
        <div className="w-5 h-5 flex flex-col justify-around relative">
            <motion.span
                className="block w-full h-0.5 bg-current rounded-full group-hover:bg-brizen-pink dark:group-hover:bg-brizen-pink transition-colors"
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 8 } }}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            />
            <motion.span
                className="block w-full h-0.5 bg-current rounded-full group-hover:bg-brizen-pink dark:group-hover:bg-brizen-pink transition-colors"
                variants={{ closed: { opacity: 1, x: 0 }, open: { opacity: 0, x: 20 } }}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            />
            <motion.span
                className="block w-full h-0.5 bg-current rounded-full group-hover:bg-brizen-pink dark:group-hover:bg-brizen-pink transition-colors"
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            />
        </div>
    </button>
);

const SCROLL_THRESHOLD = 20;

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();

    // Detectar scroll para cambiar el estilo
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
        window.addEventListener("scroll", handleScroll);
        // Verificar al montar (por si recarga a mitad de pagina)
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { href: "#inicio", key: "home" },
        { href: "/disenar", key: "design" },
        { href: "/catalogo", key: "catalog" },
        { href: "#contacto", key: "contact" },
    ];

    // Funcion auxiliar para determinar a donde lleva el link
    const getLinkPath = (link: { key: string; href: string }) => {
        if (link.key === "design") return "/disenar";
        if (link.key === "catalog") return "/catalogo";

        return location.pathname === "/" ? link.href : `/${link.href}`;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
            <motion.nav
                initial={false}
                animate={scrolled ? "scrolled" : "top"}
                variants={{
                    top: { 
                        width: "100%", 
                        maxWidth: "80rem",
                        y: 0, 
                        borderRadius: "0px",
                    },
                    scrolled: { 
                        width: "90%", 
                        maxWidth: "60rem", 
                        y: 10, 
                        borderRadius: "9999px",
                    }
                }}
                className={`
                    pointer-events-auto transition-all duration-500 ease-in-out
                    flex justify-between items-center px-4 sm:px-6 h-16
                    ${scrolled 
                        ? "bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/50 shadow-sm shadow-black/5" 
                        : "bg-transparent border-transparent"
                    }
                `}
            >
                {/* Logo */}
                <Link 
                    to="/" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <img 
                            src="/brizen-logo.svg" 
                            alt="Brizen Logo" 
                            className="h-10 w-auto dark:hidden" 
                        />
                        {/* Logo pero oscuro (Oculto por defecto, visible en dark) */}
                        <img 
                            src="/brizen-logo-white.svg" 
                            alt="Brizen Logo Dark" 
                            className="h-10 w-auto hidden dark:block" 
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                    {links.map((link) => (
                        <Link
                            key={link.key}
                            to={getLinkPath(link)}
                            className="relative px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brizen-pink dark:hover:text-brizen-pink transition-colors rounded-full hover:bg-brizen-pink-light/30 dark:hover:bg-white/5"
                        >
                            {t(`navbar.${link.key}`)}
                        </Link>
                    ))}

                    <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-3" />
                    
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden flex items-center gap-3 pointer-events-auto">
                    <ThemeToggle />
                    <HamburgerButton isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-4 right-4 z-50 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-2 shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
                    >
                        <div className="p-2 space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.key}
                                    to={getLinkPath(link)}
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-5 py-3.5 text-center text-gray-800 dark:text-gray-100 font-semibold hover:bg-brizen-pink-light/50 dark:hover:bg-slate-800 rounded-2xl transition-colors"
                                >
                                    {t(`navbar.${link.key}`)}
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center pt-4 pb-2 border-t border-gray-100 dark:border-slate-800 mx-4">
                            <LanguageSwitcher />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}