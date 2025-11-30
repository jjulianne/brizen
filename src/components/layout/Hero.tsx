import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, Palette, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
    const { t } = useTranslation();

    const features = [
        { icon: Palette, key: "design", color: "bg-brizen-pink", shadow: "shadow-brizen-pink/30" },
        { icon: Zap, key: "quality", color: "bg-gray-900 dark:bg-white", shadow: "shadow-gray-900/20 dark:shadow-white/20" },
        { icon: Sparkles, key: "unlimited", color: "bg-brizen-pink-dark", shadow: "shadow-brizen-pink-dark/30" },
    ];

    return (
        <section id="inicio" className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
            
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]"></div>
                
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full blur-3xl bg-brizen-pink-light/60 dark:bg-brizen-pink/20" 
                />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full blur-3xl bg-purple-100/60 dark:bg-purple-900/20" 
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Text Content */}
                    <motion.div 
                        className="space-y-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brizen-pink-light dark:bg-brizen-pink/20"
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brizen-pink opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brizen-pink"></span>
                                </span>
                                <span className="text-xs font-bold text-brizen-pink-dark dark:text-brizen-pink-light uppercase tracking-widest">
                                    {t("hero.badge")}
                                </span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-sans text-gray-950 dark:text-white leading-[1.05] tracking-tight">
                                {t("hero.title.part1")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brizen-pink via-purple-500 to-brizen-pink-dark">
                                    {t("hero.title.part2")}
                                </span>
                                <br />
                                {t("hero.title.part3")}
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif leading-relaxed max-w-lg">
                                {t("hero.subtitle")}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/disenar">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative px-8 py-4 bg-brizen-pink text-white font-bold rounded-2xl shadow-lg shadow-brizen-pink/30 hover:shadow-brizen-pink/50 hover:bg-brizen-pink-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {t("hero.cta.primary")}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </Link>
                            
                            <Link to="/catalogo">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white dark:bg-slate-950/50 text-gray-950 dark:text-white font-bold rounded-2xl border-2 border-gray-950 dark:border-white hover:bg-gray-100 dark:hover:bg-slate-900 transition-all text-center shadow-sm"
                                >
                                    {t("hero.cta.secondary")}
                                </motion.div>
                            </Link>
                        </div>

                        <div className="pt-8 border-t border-gray-200 dark:border-slate-800/60">
                            <div className="grid grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <div key={feature.key} className="flex flex-col items-start gap-3 group">
                                        <div className={`w-12 h-12 rounded-[14px] ${feature.color} flex items-center justify-center shadow-md ${feature.shadow} group-hover:scale-110 transition-transform`}>
                                            <feature.icon className={`w-6 h-6 ${feature.key === 'quality' ? 'text-white dark:text-gray-900' : 'text-white'}`} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {t(`hero.features.${feature.key}`)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Element - Glass Card with Pink Accents */}
                    <motion.div 
                        className="relative hidden lg:block"
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                    >
                        <div className="relative aspect-square">
                            {/* Abstract Shapes */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-[30%] border border-dashed border-gray-300 dark:border-slate-800 opacity-40"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-[35%] border border-dashed border-brizen-pink/30 opacity-50"
                            />
                            
                            {/* The Glass Card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-brizen-pink-light/30 dark:from-slate-900/60 dark:via-slate-900/30 dark:to-brizen-pink/10 backdrop-blur-2xl rounded-[2.5rem] border border-gray-950/10 dark:border-white/10 shadow-2xl shadow-gray-950/10 dark:shadow-black/30 flex items-center justify-center overflow-hidden p-8">
                                
                                {/* Inner content */}
                                <div className="text-center space-y-8 relative z-10">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brizen-pink to-brizen-pink-dark rounded-3xl rotate-3 flex items-center justify-center shadow-xl shadow-brizen-pink/40 group">
                                        <Palette className="w-16 h-16 text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-3xl font-bold font-sans tracking-tight text-gray-950 dark:text-white">
                                            {t("hero.visual.title")}
                                        </p>
                                        <p className="text-base text-gray-600 dark:text-gray-400 font-serif italic">
                                            {t("hero.visual.subtitle")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}