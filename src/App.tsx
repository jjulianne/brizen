import "./i18n/config";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import Contact from "./components/layout/Contact";
import Footer from "./components/layout/Footer";
import DesignSection from "./components/DesignSection";
import Catalog from "./components/Catalog";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <ScrollToTop />
      <Navbar />
      
      <Routes>
        {/* Home */}
        <Route path="/" element={
          <>
            <Hero />
            <Contact />
            <Footer />
          </>
        } />

        <Route path="/inicio" element={
          <>
            <Hero />
            <Contact />
            <Footer />
          </>
        }/>

        <Route path="/contacto" element={<Contact />}/>
        <Route path="/catalogo" element={<Catalog />}/>

        {/* Desing */}
        <Route path="/disenar" element={<DesignSection />} />
      </Routes>

    </div>
  );
}

export default App;