import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingBag, ArrowRight, Sparkles, Eye, X, MessageCircle } from "lucide-react";

// Tipos de datos
type Category = "all" | "tshirts" | "hoodies" | "caps";

interface Product {
    id: number;
    title: string;
    price: string;
    category: Category;
    image: string;
    isNew?: boolean;
    description?: string;
}

export default function Catalog() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // MOCK DATA
    const products: Product[] = [
        {
        id: 1,
        title: "Essential Tee Black",
        price: "$18.000",
        category: "tshirts",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
        isNew: true,
        description: "Algodón 100% peinado de alta calidad. Corte regular fit ideal para el día a día. Estampa resistente a lavados.",
        },
        {
        id: 2,
        title: "Urban Hoodie Grey",
        price: "$45.000",
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        description: "Buzo canguro con frisa invisible premium. Capucha forrada y cordones ajustables. El básico que no te puede faltar.",
        },
        {
        id: 3,
        title: "Oversized Pink",
        price: "$22.000",
        category: "tshirts",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
        description: "Corte Oversized real. Hombros caídos y tela con cuerpo. Perfecta para un look urbano y relajado.",
        },
        {
        id: 4,
        title: "Brizen Cap Classic",
        price: "$12.000",
        category: "caps",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
        description: "Gorra trucker con frente de espuma y malla trasera. Ajustable. Logo bordado en alta definición.",
        },
        {
        id: 5,
        title: "Streetwear Heavy",
        price: "$20.000",
        category: "tshirts",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
        description: "Remera de alto gramaje (Heavyweight). Cuello cerrado y estructura rígida. Durabilidad garantizada.",
        },
        {
        id: 6,
        title: "Zip Hoodie Dark",
        price: "$48.000",
        category: "hoodies",
        image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=800&auto=format&fit=crop",
        isNew: true,
        description: "Campera con cierre metálico YKK. Bolsillos laterales y corte moderno. Frisa premium abrigada.",
        },
    ];

    // Filtrado
    const filteredProducts = activeCategory === "all" 
        ? products 
        : products.filter(p => p.category === activeCategory);

    const categories: { key: Category; label: string }[] = [
        { key: "all", label: t("catalog.categories.all", "Todos") },
        { key: "tshirts", label: t("catalog.categories.tshirts", "Remeras") },
        { key: "hoodies", label: t("catalog.categories.hoodies", "Buzos") },
        { key: "caps", label: t("catalog.categories.caps", "Gorras") },
    ];

    // Funcion para generar link de WhatsApp
    const getWhatsAppLink = (product: Product) => {
        const phone = "5491160377843";
        const message = `Hola Brizen! 👋 Estaa mirando la pagina y me intereso el producto: ${product.title} (${product.price}). ¿Queda stock?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section id="catalogo" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <span className="text-brizen-pink font-bold tracking-wider uppercase text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t("catalog.badge", "Nueva Colección")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold font-sans text-gray-900 dark:text-white">
                        {t("catalog.title", "Nuestros Productos")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg">
                        {t("catalog.subtitle", "Prendas de alta calidad listas para ser personalizadas por vos.")}
                    </p>
                </motion.div>

                {/* Filtros */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap gap-2 bg-gray-100 dark:bg-slate-900 p-1.5 rounded-full"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`
                                px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative
                                ${activeCategory === cat.key ? "text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}
                            `}
                        >
                            {activeCategory === cat.key && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-gray-900 dark:bg-brizen-pink rounded-full shadow-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{cat.label}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Grid de Productos */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                        <motion.div
                            layout
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            onHoverStart={() => setHoveredProduct(product.id)}
                            onHoverEnd={() => setHoveredProduct(null)}
                            className="group relative"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 dark:bg-slate-900 shadow-sm border border-transparent dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 transition-colors">
                                {/* Badge Nuevo */}
                                {product.isNew && (
                                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                            {t("catalog.new", "Nuevo")}
                                        </span>
                                    </div>
                                )}

                                <img 
                                    src={product.image} 
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                                {/* Botones Flotantes (WhatsApp + Detalles) */}
                                <div className="absolute bottom-6 left-4 right-4 flex gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {/* Boton Detalles (Modal) */}
                                    <button 
                                        onClick={() => setSelectedProduct(product)}
                                        className="flex-1 py-3 bg-white/90 backdrop-blur-md text-gray-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Ver Info
                                    </button>
                                    
                                    {/* Boton WhatsApp */}
                                    <a 
                                        href={getWhatsAppLink(product)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-green-500/90 backdrop-blur-md text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-green-500 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Consultar
                                    </a>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-start px-1">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-sans">{product.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{t(`catalog.categories.${product.category}`)}</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-brizen-pink">{product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Modal de detalle*/}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop (Fondo oscuro) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        />
                        
                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row pointer-events-auto relative">
                                
                                {/* Boton Cerrar */}
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-gray-900 dark:text-white hover:bg-white dark:hover:bg-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Imagen Grande */}
                                <div className="w-full md:w-1/2 bg-gray-100 dark:bg-slate-950">
                                    <img 
                                        src={selectedProduct.image} 
                                        alt={selectedProduct.title} 
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="w-full md:w-1/2 p-8 flex flex-col">
                                    <div className="mb-auto">
                                        <span className="inline-block px-3 py-1 bg-brizen-pink/10 text-brizen-pink text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                                            {t(`catalog.categories.${selectedProduct.category}`)}
                                        </span>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white font-sans mb-2">
                                            {selectedProduct.title}
                                        </h3>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-brizen-pink mb-6">
                                            {selectedProduct.price}
                                        </p>
                                        
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                            {selectedProduct.description || "Prenda de alta calidad confeccionada con los mejores materiales. Ideal para personalizar con tu marca o diseño único."}
                                        </p>

                                        {/* Talles (Mock) */}
                                        <div className="mb-8">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Talles Disponibles</p>
                                            <div className="flex gap-2">
                                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                                    <div key={size} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                                        <a 
                                            href={getWhatsAppLink(selectedProduct)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Consultar Stock
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Ver mas */}
            <div className="mt-16 text-center">
                <button className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold hover:text-brizen-pink transition-colors group">
                    {t("catalog.viewAll", "Ver colección completa")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </div>
        </section>
    );
}