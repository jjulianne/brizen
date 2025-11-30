import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    useGLTF, 
    Decal, 
    useTexture, 
    PresentationControls, 
    Html, 
    useProgress, 
    Center,
    Environment,
    ContactShadows
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Upload, ShoppingBag, RotateCcw, Palette as PaletteIcon } from "lucide-react";
import * as THREE from "three";

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-gray-500 font-mono text-xs">{progress.toFixed(0)}%</Html>;
}

function LogoDecal({ textureUrl }: { textureUrl: string }) {
    const texture = useTexture(textureUrl);
    return (
        <Decal 
        position={[0, 0.04, 0.15]} 
        rotation={[0, 0, 0]} 
        scale={0.15} 
        map={texture}
        depthTest={true}
        />
    );
    }

    function Shirt(props: { color: string; logo: string | null }) {
    const { scene } = useGLTF("/shirt.glb");
    const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

    useEffect(() => {
        const gatheredMaterials: THREE.MeshStandardMaterial[] = [];
        scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            
            const cleanMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(props.color),
            roughness: 0.5,      // Bbrillo sutil en los pliegues
            metalness: 0.1,      // Un toque metalico ayuda a definir la forma
            envMapIntensity: 1.5, // Intensidad de los reflejos del entorno
            map: null,
            });

            mesh.material = cleanMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            gatheredMaterials.push(cleanMaterial);
        }
        });
        materialsRef.current = gatheredMaterials;
    }, [scene]);

    useFrame((state, delta) => {
        const targetColor = new THREE.Color(props.color);
        materialsRef.current.forEach(mat => {
            mat.color.lerp(targetColor, delta * 4);
        });
    });

    return (
        <group dispose={null}>
        <primitive object={scene} scale={1}>
            {props.logo && <LogoDecal textureUrl={props.logo} />}
        </primitive>
        </group>
    );
    }

    export default function DesignSection() {
    const { t } = useTranslation();
    const [shirtColor, setShirtColor] = useState("#E639A8");
    const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

    const presetColors = ["#E639A8", "#ffffff", "#18181b", "#3b82f6", "#ef4444", "#eab308", "#10b981"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => setUploadedLogo(event.target?.result as string);
        reader.readAsDataURL(file);
        }
    };

    return (
        <section className="relative w-full h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden flex flex-col lg:flex-row">
        
        {/* ZONA 3D */}
        <div 
            className="w-full lg:w-2/3 h-[50vh] lg:h-full relative cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black"
            style={{ touchAction: 'none' }}
        >
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <Canvas 
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 2.5], fov: 45 }} 
                gl={{ preserveDrawingBuffer: true }}
            >
            {/* 'city' da luces blancas y sombras suaves, perfecto para productos */}
            <Environment preset="city" />
            
            {/* Luz direccional suave para acentuar el frente */}
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />

            <Suspense fallback={<Loader />}>
                <PresentationControls 
                    speed={1.5} 
                    global 
                    zoom={0.7} 
                    polar={[-0.1, Math.PI / 4]} 
                >
                    <Center top>
                    <Shirt color={shirtColor} logo={uploadedLogo} />
                    </Center>
                </PresentationControls>

                {/* Sombra */}
                <ContactShadows 
                    position={[0, -0.4, 0]} // Ubicada justo debajo de la remera
                    opacity={0.4}           // Transparencia
                    scale={10}              // Tamaño
                    blur={2}                // Difuminado (si lo subis es mas suave)
                    far={4}                 // Distancia de renderizado
                    color="#000000"
                />
            </Suspense>
            </Canvas>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-medium animate-pulse pointer-events-none">
                {t("design.rotateHint", "Arrastra para rotar • Haz zoom")}
            </div>
        </div>

        {/* UI flotante */}
        <div className="w-full lg:w-1/3 h-auto lg:h-full bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col justify-center shadow-2xl relative z-10 overflow-y-auto">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6 lg:space-y-8">
                <div>
                    <span className="text-brizen-pink font-bold tracking-wider uppercase text-xs mb-2 block">{t("design.studio", "Brizen Studio")}</span>
                    <h2 className="text-3xl font-bold font-sans text-gray-900 dark:text-white mb-2">{t("design.title", "Diseña tu Estilo")}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t("design.subtitle", "Personaliza tu prenda en tiempo real.")}</p>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><PaletteIcon className="w-4 h-4" />{t("design.colorLabel", "Color base")}</label>
                    <div className="flex flex-wrap gap-3">
                        {presetColors.map((color) => (
                            <button key={color} onClick={() => setShirtColor(color)} className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${shirtColor === color ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-brizen-pink" : "border-gray-200 dark:border-slate-700 hover:scale-105"}`} style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><Upload className="w-4 h-4" />{t("design.uploadLabel", "Tu logo (.png)")}</label>
                    <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 group-hover:border-brizen-pink transition-all">
                            {uploadedLogo ? <div className="flex items-center gap-3"><img src={uploadedLogo} alt="Preview" className="w-10 h-10 object-contain rounded-md bg-white/10" /><span className="text-sm font-medium text-brizen-pink">Listo para estampar</span></div> : <><Upload className="w-8 h-8 mb-2 opacity-50" /><span className="text-sm">Click para subir</span></>}
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-brizen-pink text-white font-bold rounded-xl shadow-lg shadow-brizen-pink/30 hover:bg-brizen-pink-dark transition-all flex items-center justify-center gap-2"><ShoppingBag className="w-5 h-5" />{t("design.addToCart", "Comprar Diseño")}</motion.button>
                    <button onClick={() => { setShirtColor("#E639A8"); setUploadedLogo(null); }} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"><RotateCcw className="w-4 h-4" /> Resetear</button>
                </div>
            </motion.div>
        </div>
        </section>
    );
}