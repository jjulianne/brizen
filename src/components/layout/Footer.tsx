import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import GradientText from "../../snippets/GradientText";

export default function Footer() {
    const { t } = useTranslation();

    const socialLinks = [
        { icon: Instagram, href: "https://instagram.com/brizen.26", label: "Instagram" },
        { icon: MessageCircle, href: "https://wa.me/5491160377843", label: "WhatsApp" },
        { icon: Mail, href: "mailto:hola@brizen.com", label: "Email" },
    ];

    const quickLinks = [
        { key: "home", href: "#inicio" },
        { key: "design", href: "/disenar" },
        { key: "catalog", href: "/catalogo" },
        { key: "contact", href: "#contacto" },
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-sans bg-gradient-to-r from-brizen-pink to-purple-600 bg-clip-text text-transparent">
                    Brizen
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-serif text-sm leading-relaxed">
                {t("footer.tagline")}
                </p>
                <div className="flex space-x-4">
                {socialLinks.map((social) => (
                    <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-brizen-pink dark:hover:text-brizen-pink shadow-md hover:shadow-lg transition-all duration-200"
                    aria-label={social.label}
                    >
                    <social.icon className="w-5 h-5" />
                    </motion.a>
                ))}
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t("footer.quickLinks")}
                </h3>
                <ul className="space-y-2">
                {quickLinks.map((link) => (
                    <li key={link.key}>
                    <a
                        href={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-brizen-pink dark:hover:text-brizen-pink transition-colors duration-200"
                    >
                        {t(`navbar.${link.key}`)}
                    </a>
                    </li>
                ))}
                </ul>
            </div>

            {/* Contact Info */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t("footer.contactTitle")}
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                    <a href="mailto:hola@brizen.com" className="hover:text-brizen-pink dark:hover:text-brizen-pink transition-colors">
                    hola@brizen.com
                    </a>
                </li>
                <li>
                    <a href="tel:+5491160377843" className="hover:text-brizen-pink dark:hover:text-brizen-pink transition-colors">
                    +54 9 11 6037-7843
                    </a>
                </li>
                <li>Buenos Aires, Argentina</li>
                </ul>
            </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-slate-800 my-8"></div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} Brizen — {t("footer.copyright")}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{t("footer.developedBy")}</span>

                <a
                    href="https://github.com/jjulianne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                >
                    <GradientText
                        colors={["#fa74f3ff", "#ffffffff", "#fa74f3ff", "#ffffffff", "#fa74f3ff"]}
                        animationSpeed={3}
                        showBorder={false}
                    >
                        jjulianne
                    </GradientText>
                </a>
            </div>

            </div>
        </div>
        </footer>
    );
}