import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const lang = i18n.language?.substring(0, 2).toLowerCase();

    const toggleLanguage = () => {
        const newLang = lang === "es" ? "en" : "es";
        i18n.changeLanguage(newLang);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center justify-center h-9 px-3 rounded-lg border border-gray-200 dark:border-slate-700 
                        bg-white dark:bg-slate-800 
                        text-sm font-semibold text-slate-800 dark:text-white
                        hover:border-brizen-pink dark:hover:border-brizen-pink 
                        hover:text-brizen-pink dark:hover:text-brizen-pink
                        transition-colors duration-200"
            aria-label="Change language"
        >
            {/* Si es EN, lo ponemos rosa y negrita. Si no, opaco. */}
            <span className={lang === "en" ? "text-brizen-pink font-bold" : "opacity-50"}>EN</span>
            
            <span className="mx-1.5 opacity-30">|</span>
            
            {/* Lo mismo para ES */}
            <span className={lang === "es" ? "text-brizen-pink font-bold" : "opacity-50"}>ES</span>
        </motion.button>
    );
}