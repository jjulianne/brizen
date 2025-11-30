import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Send, Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function Contact() {
    const { t } = useTranslation();
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    // Si la URL tiene #contacto, forzamos el scroll hacia esta seccion al cargar
    useEffect(() => {
        if (location.hash === '#contacto') {
            const element = document.getElementById('contacto');
            if (element) {
                // Un pequeño delay para que React haya terminado la pantalla
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    }, [location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        { icon: Mail, key: "email", value: "hola@brizen.com" },
        { icon: Phone, key: "phone", value: "+54 9 11 6037-7843" },
        { icon: MapPin, key: "location", value: "Buenos Aires, Argentina" },
        { icon: Instagram, key: "instagram", value: "@brizen.26" },
    ];

    const inputClasses = "w-full px-5 py-4 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brizen-pink focus:border-brizen-pink outline-none transition-all duration-200 shadow-sm";

    return (
        <section id="contacto" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-50/50 to-transparent dark:from-slate-800/20 dark:to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }} 
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
                        {t("contact.badge", "Hablemos")}
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold font-sans text-gray-900 dark:text-white mb-6">
                        {t("contact.title")}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto leading-relaxed">
                        {t("contact.subtitle")}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-1"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                        {t("contact.form.name")}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                        placeholder="Eros Taborda"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                        {t("contact.form.phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="+54 9 11 2345-6789"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                    {t("contact.form.email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder="hola@brizen.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                    {t("contact.form.message")}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`${inputClasses} resize-none`}
                                    placeholder={t("contact.form.messagePlaceholder")}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, translateY: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-8 py-4 bg-gradient-to-r from-brizen-pink to-brizen-pink-dark text-white font-bold rounded-xl shadow-lg shadow-brizen-pink/30 hover:shadow-brizen-pink/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
                            >
                                <span>{t("contact.form.submit")}</span>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8 flex flex-col justify-center"
                    >
                        <div className="grid gap-6">
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-5 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-300 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 text-cyan-600 dark:text-cyan-400">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t(`contact.info.${item.key}`)}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                            {item.value}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <div className="w-32 h-32 rounded-full bg-cyan-500 blur-2xl"></div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 relative z-10">
                                {t("contact.hours.title")}
                            </h3>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t("contact.hours.weekdays")}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white bg-cyan-100 dark:bg-cyan-900/30 px-2 py-1 rounded text-xs text-cyan-700 dark:text-cyan-300">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t("contact.hours.saturday")}</span>
                                    <span className="font-semibold text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs text-blue-700 dark:text-blue-300">10:00 - 14:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm opacity-60">
                                    <span className="text-gray-600 dark:text-gray-400">{t("contact.hours.sunday")}</span>
                                    <span className="font-semibold text-gray-500 dark:text-gray-400">Cerrado</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}