import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      navbar: {
        home: "Home",
        design: "Design Your Shirt",
        catalog: "Catalog",
        contact: "Contact",
      },
      hero: {
        badge: "100% Customizable",
        title: {
          part1: "We print your ideas.",
          part2: "Design your shirt",
          part3: "however you want.",
        },
        subtitle: "Create your unique style. No limits, no excuses. 100% you.",
        cta: {
          primary: "Design Now",
          secondary: "View Catalog",
        },
        features: {
          design: "Your Design",
          quality: "High Quality",
          unlimited: "Unlimited",
        },
        visual: {
          title: "Your design here",
          subtitle: "Create, customize, wear it",
        },
      },
      design: {
        studio: "BRIZEN STUDIO",
        title: "Design Your Style",
        subtitle: "Customize colors and upload your logo to see it in real-time.",
        rotateHint: "Drag to rotate • Zoom to scale",
        colorLabel: "Choose base color",
        uploadLabel: "Upload your logo (.png)",
        addToCart: "Buy this design",
        reset: "Reset values",
      },
      catalog: {
        badge: "New Collection",
        title: "Our Products",
        subtitle: "High-quality garments ready to be customized by you. Choose your base and start creating.",
        new: "New",
        customize: "View Info",
        viewAll: "View full collection",
        categories: {
          all: "All",
          tshirts: "T-Shirts",
          hoodies: "Hoodies",
          caps: "Caps"
        }
      },
      contact: {
        title: "Let's Talk",
        subtitle: "Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you soon.",
        badge: "Contact Us",
        form: {
          name: "Full Name",
          namePlaceholder: "John Doe",
          email: "Email",
          emailPlaceholder: "john@example.com",
          phone: "Phone (optional)",
          phonePlaceholder: "+1 234 567 8900",
          message: "Message",
          messagePlaceholder: "Tell us about your project...",
          submit: "Send Message",
        },
        info: {
          title: "Contact Information",
          email: "Email",
          phone: "Phone",
          location: "Location",
          instagram: "Instagram",
        },
        hours: {
          title: "Business Hours",
          weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
          saturday: "Saturday: 10:00 AM - 2:00 PM",
          sunday: "Sunday: Closed",
        },
      },
      footer: {
        tagline: "Express yourself your way. We print what makes you unique.",
        quickLinks: "Quick Links",
        contactTitle: "Contact",
        copyright: "All rights reserved.",
        madeWith: "Made with",
        in: "in",
        developedBy: "Website developed by",
      },
    },
  },
  es: {
    translation: {
      navbar: {
        home: "Inicio",
        design: "Diseña tu Remera",
        catalog: "Catálogo",
        contact: "Contacto",
      },
      hero: {
        badge: "100% Personalizable",
        title: {
          part1: "Imprimimos tus ideas.",
          part2: "Diseñá tu remera",
          part3: "como quieras.",
        },
        subtitle: "Creá tu estilo único. Sin límites, sin excusas. 100% vos.",
        cta: {
          primary: "Diseñar Ahora",
          secondary: "Ver Catálogo",
        },
        features: {
          design: "Tu Diseño",
          quality: "Alta Calidad",
          unlimited: "Sin Límites",
        },
        visual: {
          title: "Tu diseño aquí",
          subtitle: "Creá, personalizá, llevá puesto",
        },
      },
      design: {
        studio: "BRIZEN STUDIO",
        title: "Diseña tu Estilo",
        subtitle: "Personaliza colores y sube tu logo para ver cómo queda en tiempo real.",
        rotateHint: "Arrastra para rotar • Haz zoom para acercar",
        colorLabel: "Elige el color base",
        uploadLabel: "Sube tu logo (.png)",
        addToCart: "Comprar este diseño",
        reset: "Resetear valores",
      },
      catalog: {
        badge: "Nueva Colección",
        title: "Nuestros Productos",
        subtitle: "Prendas de alta calidad listas para ser personalizadas por vos. Elegí tu base y empezá a crear.",
        new: "Nuevo",
        customize: "Ver Info",
        viewAll: "Ver colección completa",
        categories: {
          all: "Todos",
          tshirts: "Remeras",
          hoodies: "Buzos",
          caps: "Gorras"
        }
      },
      contact: {
        title: "Hablemos",
        subtitle: "¿Tenés un proyecto en mente? Nos encantaría escucharlo. Envianos un mensaje y te responderemos pronto.",
        badge: "Hablemos",
        form: {
          name: "Nombre Completo",
          namePlaceholder: "Juan Pérez",
          email: "Email",
          emailPlaceholder: "juan@ejemplo.com",
          phone: "Teléfono (opcional)",
          phonePlaceholder: "+54 9 11 1234-5678",
          message: "Mensaje",
          messagePlaceholder: "Contanos sobre tu proyecto...",
          submit: "Enviar Mensaje",
        },
        info: {
          title: "Información de Contacto",
          email: "Email",
          phone: "Teléfono",
          location: "Ubicación",
          instagram: "Instagram",
        },
        hours: {
          title: "Horarios de Atención",
          weekdays: "Lunes - Viernes: 9:00 AM - 6:00 PM",
          saturday: "Sábado: 10:00 AM - 2:00 PM",
          sunday: "Domingo: Cerrado",
        },
      },
      footer: {
        tagline: "Expresate a tu manera. Imprimimos lo que te hace único.",
        quickLinks: "Enlaces Rápidos",
        contactTitle: "Contacto",
        copyright: "Todos los derechos reservados.",
        madeWith: "Hecho con",
        in: "en",
        developedBy: "Página Web desarrollada por",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // idioma por defecto
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;