import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader  } from "@react-three/fiber";
import { 
    useGLTF, 
    Decal, 
    Html, 
    useProgress, 
    Center,
    Environment,
    ContactShadows,
    OrbitControls 
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ShoppingBag, Palette, Type, Image as ImageIcon, Trash2, Edit3, Layers, ChevronDown, ChevronRight, Shirt, Sparkles, ArrowLeft, Move, Maximize } from "lucide-react";
import * as THREE from "three";

type LayerType = 'text' | 'image';
type Side = 'front' | 'back';
type GarmentType = 'shirt' | 'hoodie' | 'cap';

interface Layer {
    id: string;
    type: LayerType;
    side: Side;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    text?: string;
    font?: string;
    color?: string;
    imageUrl?: string;
}

interface GarmentOption {
    id: GarmentType;
    name: string;
    model: string;
    icon: string;
    description: string;
    price: number;
    baseScale?: [number, number, number]; 
    basePosition?: [number, number, number];
    baseRotation?: [number, number, number];
}

const GARMENTS: GarmentOption[] = [
    { 
        id: 'shirt', 
        name: 'Remera Premium', 
        model: '/shirt.glb', 
        icon: 'FOTO REMERA',
        description: 'Algodón 100% peinado',
        price: 20000,
        baseScale: [1, 1, 1],
        baseRotation: [0, 0, 0],
    },
    { 
        id: 'hoodie', 
        name: 'Hoodie Urban', 
        model: '/hoodie.glb', 
        icon: 'FOTO BUZO',
        description: 'Frisa invisible pesada',
        price: 30000,
        baseScale: [1, 1, 1],
        // Modificamos la rotacion porque el modelo estaba 90 gradis diferente
        baseRotation: [0, -Math.PI / 2, 0]
    },
    { 
        id: 'cap', 
        name: 'Gorra Snapback', 
        model: '/cap.glb', 
        icon: 'FOTO GORRA',
        description: 'Ajustable 5 paneles',
        price: 8000,
        baseScale: [0.005, 0.005, 0.005],
        baseRotation: [0, 0, 0],
        // Modificamos la posicion porque el modelo era enorme
        basePosition: [0, 1, -0.25]
    }
];

const AVAILABLE_FONTS = [
    { name: 'Inter', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap' },
    { name: 'Serif', family: "'Playfair Display', serif", url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap' },
    { name: 'Comic', family: "'Bangers', cursive", url: 'https://fonts.googleapis.com/css2?family=Bangers&display=swap' },
    { name: 'Retro', family: "'Monoton', cursive", url: 'https://fonts.googleapis.com/css2?family=Monoton&display=swap' },
];

const presetColors = ["#E639A8", "#ffffff", "#18181b", "#3b82f6", "#ef4444", "#eab308", "#10b981"];

const FontLoader = () => (
    <style>
        {AVAILABLE_FONTS.map(f => `@import url('${f.url}');`).join('\n')}
    </style>
);

function textToTexture(text: string, fontFamily: string, color: string) {
    // fontFamily: por ejemplo "Inter" (sin quotes y sin fallback)
    const scale = window.devicePixelRatio || 1;
    const fontSize = 160; // base font size
    const padding = 32;

    // canvas en hi-dpi para mejor nitidez
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text || ' ');
    const textWidth = Math.ceil(metrics.width);

    canvas.width = Math.max(512, (textWidth + padding * 2) * scale);
    canvas.height = Math.max(128, (fontSize + padding * 2) * scale);

    // Escalamos el contexto para hi-dpi
    ctx.resetTransform?.();
    ctx.scale(scale, scale);

    // Re-aplicamos estilo en el contexto a tamaño real
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, (canvas.width / scale) / 2, (canvas.height / scale) / 2);

    return canvas.toDataURL('image/png');
}

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-gray-500 font-mono text-xs">{progress.toFixed(0)}%</Html>;
}

interface LayerDecalProps {
    mesh: THREE.Mesh | null;
    layer: {
        position?: [number, number, number];
        rotation?: [number, number, number];
        scale?: [number, number, number];
    };
    texture: THREE.Texture | null;
}



const LayerDecal: React.FC<LayerDecalProps> = ({ mesh, layer, texture }) => {
    
    // No renderizamos nada hasta que exista el mesh y la textura esta cargada
    if (!mesh || !texture) {
        console.warn("[LayerDecal] Mesh o textura no disponibles todavía");
        return null;
    }

    // Adaptamos el mesh para Decal
    const meshRefLike = useMemo(() => ({ current: mesh }), [mesh]);

    // 3) Transformaciones de la capa (posición, rotación, escala)
    const position = layer.position ?? [0, 1, 0];
    
    const rotation = layer.rotation ?? [0, 0, 0];
    const scale = layer.scale ?? 1;

    return (
        <>
            {/* El decal real */}
            <Decal
                mesh={meshRefLike as any}
                position={position}
                rotation={rotation}
                scale={scale}
                map={texture}
                depthTest={true}
            />

            {/* Debug plane para saber donde esta el decal */}
            <mesh position={position} rotation={rotation} scale={scale}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                    map={texture}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    );
};




function Garment(props: { 
    color: string; 
    layers: Layer[]; 
    modelPath: string;
    scale?: [number, number, number];
    rotation?: [number, number, number];
    position?: [number, number, number];
}) {
    // IMPORTANTE: key={props.modelPath} fuerza a que el componente se reinicie si cambia el modelo
    const { scene } = useGLTF(props.modelPath);
    const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
    const [targetMesh, setTargetMesh] = useState<THREE.Mesh | null>(null);
    

    useEffect(() => {
    const gatheredMaterials: THREE.MeshStandardMaterial[] = [];
    let mainMesh: THREE.Mesh | null = null;
    let bestVolume = 0;

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            console.log("Mesh encontrado:", child.name, child);

            const mesh = child as THREE.Mesh;

            if (!mesh.geometry) return;

            // Bounding box para elegir el mesh más "visible"
            const geom = mesh.geometry as THREE.BufferGeometry;
            geom.computeBoundingBox?.();
            const bb = geom.boundingBox;

            let volume = 0;
            if (bb) {
                const size = new THREE.Vector3();
                bb.getSize(size);
                volume = size.x * size.y * size.z;
            }

            if (volume > bestVolume) {
                bestVolume = volume;
                mainMesh = mesh;
            }

            const cleanMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(props.color),
                roughness: 0.5,
                metalness: 0.1,
                envMapIntensity: 1.5
            });

            mesh.material = cleanMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            gatheredMaterials.push(cleanMaterial);
        }
    });

    if (mainMesh) {
        console.log(
            "[Garment] mainMesh seleccionado:",
            (mainMesh as THREE.Mesh).name || (mainMesh as THREE.Mesh).uuid,
            "volumen:",
            bestVolume
        );
    } else {
        console.warn("[Garment] No se encontró un mesh principal.");
    }

    materialsRef.current = gatheredMaterials;
    setTargetMesh(mainMesh);
}, [scene, props.modelPath, props.color]);



    useFrame((state, delta) => {
        const targetColor = new THREE.Color(props.color);
        materialsRef.current.forEach(mat => {
            mat.color.lerp(targetColor, delta * 4);
        });
    });

    const textures = useLoader(
    THREE.TextureLoader,
    props.layers.map(l => {
        if (l.type === "image") return l.imageUrl!;
        if (l.type === "text") return textToTexture(l.text!, l.font!, l.color!);
        return ""; // fallback
    })
);



    return (
        <group dispose={null} key={props.modelPath}>
        <primitive 
                object={scene} 
                scale={props.scale || [1, 1, 1]} 
                rotation={props.rotation || [0, 0, 0]}
                position={props.position || [0, 0, 0]}
            />
        
        {targetMesh &&
            props.layers.map((layer, i) => (
                <LayerDecal
                    key={layer.id}
                    layer={layer}
                    mesh={targetMesh}
                    texture={textures[i]}
                />
            ))
        }
    </group>
    );
}

function LayerEditor({ 
    layer, 
    onUpdate 
}: { 
    layer: Layer; 
    onUpdate: (id: string, prop: 'x'|'y'|'scale', val: number) => void;
}) {
    return (
        <div className="bg-gray-100 dark:bg-slate-900/50 p-3 rounded-lg space-y-3 mt-2 border border-pink-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 mb-1">
                <Edit3 className="w-3 h-3" /> Editando: {layer.type}
            </div>
            
            {/* Control Posicion Y (Vertical) */}
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500">
                    <span className="flex gap-1 items-center"><Move className="w-3 h-3"/> Vertical</span>
                    <span>{layer.position[1].toFixed(2)}</span>
                </div>
                <input 
                    type="range" min="0.95" max="1.6" step="0.01"
                    value={layer.position[1]}
                    onChange={(e) => onUpdate(layer.id, 'y', parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
            </div>

            {/* Control Posicion X (Horizontal) */}
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500">
                    <span className="flex gap-1 items-center"><Move className="w-3 h-3 rotate-90"/> Horizontal</span>
                    <span>{layer.position[0].toFixed(2)}</span>
                </div>
                <input 
                    type="range" min="-0.2" max="0.2" step="0.01"
                    value={layer.position[0]}
                    onChange={(e) => onUpdate(layer.id, 'x', parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
            </div>

            {/* Control Escala */}
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500">
                    <span className="flex gap-1 items-center"><Maximize className="w-3 h-3"/> Tamaño</span>
                    <span>{layer.scale[0].toFixed(2)}</span>
                </div>
                <input 
                    type="range" min="0.05" max="0.25" step="0.01"
                    value={layer.scale[0]}
                    onChange={(e) => onUpdate(layer.id, 'scale', parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
            </div>
        </div>
    );
}


function GarmentSelector({ onSelect }: { onSelect: (garment: GarmentType) => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-6 
            {/* FONDO: Gris muy claro en modo luz / Gradiente oscuro en modo noche */}
            bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors duration-300">
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-flex items-center gap-2 mb-4"
                    >
                        <Sparkles className="w-8 h-8 text-pink-500" />
                        {/* TITULO: Negro en luz / Blanco en noche */}
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Brizen Studio
                        </h1>
                    </motion.div>
                    {/* SUBTITULO: Gris medio en luz / Gris claro en noche */}
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Selecciona tu lienzo para comenzar a diseñar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {GARMENTS.map((garment, index) => (
                        <motion.button
                            key={garment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(garment.id)}
                            className="
                                relative group overflow-hidden rounded-3xl p-8 text-center transition-all
                                {/* TARJETAS LIGHT: Fondo blanco, borde gris, sombra suave */}
                                bg-white border border-gray-200 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:border-pink-500/50
                                {/* TARJETAS DARK: Fondo translúcido, borde sutil, sin sombra de caja */}
                                dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-none dark:hover:bg-white/10
                            "
                        >
                            {/* Gradiente hover rosado (sutil) */}
                            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            
                            <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {garment.icon}
                            </div>
                            
                            {/* NOMBRE PRENDA: Oscuro en luz / Blanco en noche */}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {garment.name}
                            </h3>
                            
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                {garment.description}
                            </p>
                            
                            <div className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">
                                <span>Diseñar desde ${garment.price}</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function CollapsibleSection({ 
    title, 
    icon, 
    children, 
    defaultOpen = false 
}: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                        {icon}
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-gray-100 dark:border-slate-800/50">
                            <div className="pt-4 space-y-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


export default function DesignSection() {
    const [selectedGarment, setSelectedGarment] = useState<GarmentType | null>(null);
    const [shirtColor, setShirtColor] = useState("#E639A8");
    const [layers, setLayers] = useState<Layer[]>([]);
    
    // Estados de edicion
    const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
    const [newText, setNewText] = useState("");
    const [newFont, setNewFont] = useState(AVAILABLE_FONTS[0].family);
    const [newTextColor, setNewTextColor] = useState("#ffffff");
    const [newSide, setNewSide] = useState<Side>("front");

    // Prenda actual objeto completo
    const currentGarment = GARMENTS.find(g => g.id === selectedGarment);

    const changeGarment = (garmentId: GarmentType) => {
        setSelectedGarment(garmentId);
        // Reseteamos las capas al cambiar de prenda para evitar posiciones extranias
        setLayers([]); 
        setNewText("");
    };

    const addTextLayer = () => {
        if (!newText.trim()) return;
        
        const position: [number, number, number] = newSide === 'front' 
            ? [0, 1.4, 0.15] 
            : [0, 1.4, -0.15];
        
        const rotation: [number, number, number] = newSide === 'front'
            ? [0, 0, 0]
            : [0, Math.PI, 0];
        
        const newLayer: Layer = {
            id: Date.now().toString(),
            type: 'text',
            side: newSide,
            position,
            rotation,
            scale: [0.25, 0.12, 1],
            text: newText,
            font: newFont,
            color: newTextColor
            
        };
        
        setLayers([...layers, newLayer]);
        setNewText("");
    };

    const addImageLayer = (imageUrl: string) => {
        const newLayer: Layer = {
            id: Date.now().toString(),
            type: 'image',
            side: newSide,
            position: newSide === 'front' ? [0, 1.4, 0.15] : [0, 1.4, -0.15],
            rotation: newSide === 'front' ? [0, 0, 0] : [0, Math.PI, 0],
            scale: [0.15, 0.15, 1],
            imageUrl
        };
        
        setLayers([...layers, newLayer]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                addImageLayer(url);
            };
            reader.readAsDataURL(file);
        }
    };

    // Funcion unificada para mover/escalar
    const updateLayer = (id: string, prop: 'x'|'y'|'scale', val: number) => {
        setLayers(prev => prev.map(l => {
            if (l.id !== id) return l;
            const updated = { ...l };
            if (prop === 'x') updated.position = [val, l.position[1], l.position[2]];
            if (prop === 'y') updated.position = [l.position[0], val, l.position[2]];
            if (prop === 'scale') {
                // Mantenemos proporcion para texto (ancho x alto/2) o cuadrada para imagen
                const ratio = l.type === 'text' ? 0.5 : 1;
                updated.scale = [val, val * ratio, 1];
            }
            return updated;
        }));
    };

    const deleteLayer = (id: string) => {
        setLayers(prev => prev.filter(l => l.id !== id));
        if (editingLayerId === id) setEditingLayerId(null);
    };
    
    // Funciones simples para mover capas
    const moveLayer = (index: number, direction: 'up' | 'down') => {
        const newLayers = [...layers];
        if (direction === 'up' && index > 0) {
            [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
        } else if (direction === 'down' && index < layers.length - 1) {
            [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
        }
        setLayers(newLayers);
    };

    // Renderizado Condicional: Si no hay prenda, mostramos el Selector
    if (!selectedGarment) {
        return <GarmentSelector onSelect={setSelectedGarment} />;
    }

    return (
        <section className="relative w-full h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden flex flex-col lg:flex-row">
            <FontLoader />
            
            <div className="w-full lg:w-2/3 h-[45vh] lg:h-full relative cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
                
                {/* Boton Flotante para volver al inicio */}
                <div className="absolute top-6 left-6 z-10">
                    <button 
                        onClick={() => setSelectedGarment(null)}
                        className="group flex items-center justify-center p-3 hover:pr-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-full text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        
                        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-sm font-medium">
                            Volver a la selección
                        </span>
                    </button>
                </div>

                <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 2.5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                    <Environment preset="city" />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />

                    <Suspense fallback={<Loader />}>
                        <Center position={[0, -0.3, 0]}>
                            {/* Renderizado de la prenda seleccionada */}
                            <Garment 
                                color={shirtColor} 
                                layers={layers}
                                modelPath={currentGarment?.model || '/shirt.glb'}
                                scale={currentGarment?.baseScale}
                                rotation={currentGarment?.baseRotation}
                                position={currentGarment?.basePosition}
                            />
                        </Center>
                        <OrbitControls minDistance={1.5} maxDistance={5} />
                        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
                    </Suspense>
                </Canvas>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-medium animate-pulse pointer-events-none">
                    Arrastra para rotar • Haz zoom
                </div>
            </div>

            {/* PANEL LATERAL */}
        <div className="w-full lg:w-1/3 h-auto lg:h-full bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-800 p-6 lg:p-8 flex flex-col justify-center shadow-2xl relative z-10 overflow-y-auto">
                
                {/* Header Fijo */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
                    <span className="text-pink-600 font-bold tracking-wider uppercase text-xs mb-1 block">Brizen Studio</span>
                    <h2 className="text-2xl font-bold font-sans text-gray-900 dark:text-white flex items-center gap-2">
                        {currentGarment?.name}
                        <span className="text-sm font-normal text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            ${currentGarment?.price}
                        </span>
                    </h2>

                    {/* Selector de Lado (Frente/Espalda) siempre visible */}
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg mt-4">
                        {(['front', 'back'] as const).map(side => (
                            <button
                                key={side}
                                onClick={() => setNewSide(side)}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    newSide === side 
                                        ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {side === 'front' ? 'Frente' : 'Espalda'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* area scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {/* CAMBIAR PRENDA (Colapsable) */}
                    <CollapsibleSection title="Cambiar Modelo" icon={<Shirt className="w-4 h-4" />}>
                        <div className="grid grid-cols-3 gap-2">
                            {GARMENTS.map((garment) => (
                                <button
                                    key={garment.id}
                                    onClick={() => changeGarment(garment.id)}
                                    className={`p-3 rounded-xl border transition-all text-center ${
                                        selectedGarment === garment.id
                                            ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20 ring-1 ring-pink-600'
                                            : 'border-gray-200 dark:border-slate-700 hover:border-pink-300'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{garment.icon}</div>
                                    <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">{garment.name}</div>
                                </button>
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* COLOR (Colapsable) */}
                    <CollapsibleSection title="Color Base" icon={<Palette className="w-4 h-4" />} defaultOpen={true}>
                        <div className="flex flex-wrap gap-3">
                            {presetColors.map((color) => (
                                <button 
                                    key={color} 
                                    onClick={() => setShirtColor(color)} 
                                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                                        shirtColor === color 
                                            ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-pink-600" 
                                            : "border-gray-200 dark:border-slate-700 hover:scale-105"
                                    }`} 
                                    style={{ backgroundColor: color }} 
                                />
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* TEXTO (Colapsable) */}
                    <CollapsibleSection title="Agregar Texto" icon={<Type className="w-4 h-4" />}>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder="Escribe aquí..."
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-600 outline-none text-sm"
                                maxLength={20}
                            />
                            
                            <div className="grid grid-cols-4 gap-2">
                                {AVAILABLE_FONTS.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => setNewFont(font.family)}
                                        className={`py-1.5 rounded text-[10px] border transition-all truncate ${
                                            newFont === font.family 
                                                ? 'bg-pink-600 text-white border-pink-600' 
                                                : 'bg-white dark:bg-slate-800 border-gray-200 hover:border-pink-400'
                                        }`}
                                        style={{ fontFamily: font.family }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    {['#ffffff', '#000000', '#E639A8'].map(c => (
                                        <button 
                                            key={c} 
                                            onClick={() => setNewTextColor(c)}
                                            className={`w-6 h-6 rounded-full border ${newTextColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : 'border-gray-300'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={addTextLayer}
                                    disabled={!newText.trim()}
                                    className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-xs font-bold disabled:opacity-50"
                                >
                                    Agregar +
                                </button>
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* IMAGEN (Colapsable) */}
                    <CollapsibleSection title="Subir Imagen" icon={<ImageIcon className="w-4 h-4" />}>
                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:border-pink-500 transition-all p-6 text-center">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-pink-500" />
                            <span className="text-xs text-gray-500">Click para subir PNG/JPG</span>
                        </div>
                    </CollapsibleSection>

                    {/* LISTA DE CAPAS (Se muestra solo si hay capas) */}
                    {layers.length > 0 && (
                        <CollapsibleSection title={`Capas (${layers.length})`} icon={<Layers className="w-4 h-4"/>} defaultOpen>
                            <div className="space-y-2">
                                {layers.map(layer => (
                                    <div key={layer.id} className="border rounded-lg p-2 dark:border-slate-700">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-gray-200 dark:bg-slate-700 px-1 rounded uppercase">{layer.side === 'front' ? 'F' : 'E'}</span>
                                                <span className="text-sm font-medium truncate w-24 dark:text-white">
                                                    {layer.type === 'text' ? layer.text : 'Imagen'}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => setEditingLayerId(editingLayerId === layer.id ? null : layer.id)}
                                                    className={`p-1 rounded ${editingLayerId === layer.id ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500'}`}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteLayer(layer.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Si esta capa esta seleccionada para editar, mostramos los sliders */}
                                        <AnimatePresence>
                                            {editingLayerId === layer.id && (
                                                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}>
                                                    <LayerEditor layer={layer} onUpdate={updateLayer} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>
                    )}

                </div>

                {/* Footer Fijo con Precio y Comprar */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-xs text-gray-400 uppercase font-bold">Total</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${(currentGarment?.price || 0) + (layers.length * 5)}
                        </span>
                    </div>
                    <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Presupuestar diseño
                    </button>
                </div>

            </div>
        </section>
    );
}