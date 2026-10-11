"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ─── Build the letter "F" via ExtrudeGeometry ──────────────────────── */
function createFPath(): THREE.Shape {
  const shape = new THREE.Shape();

  // Start at bottom-left corner of vertical stem
  shape.moveTo(-0.55, -1.1);

  // Up left side of stem to top-left
  shape.lineTo(-0.55, 1.1);

  // Across top to top-right tip of top arm
  shape.lineTo(0.55, 1.1);

  // Down right edge of top arm
  shape.lineTo(0.55, 0.72);

  // Inner corner under top arm (back to stem)
  shape.lineTo(-0.27, 0.72);

  // Down stem to top edge of middle arm
  shape.lineTo(-0.27, 0.22);

  // Across middle arm to right tip
  shape.lineTo(0.42, 0.22);

  // Down right edge of middle arm
  shape.lineTo(0.42, -0.15);

  // Inner corner under middle arm (back to stem)
  shape.lineTo(-0.27, -0.15);

  // Down stem right side to bottom right
  shape.lineTo(-0.27, -1.1);

  shape.closePath();

  return shape;
}

/* ─── 3D F object ───────────────────────────────────────────────────── */
function LetterF() {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  const geometry = useMemo(() => {
    const shape = createFPath();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 12,
      curveSegments: 32,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  useFrame((_, delta) => {
    time.current += delta;
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.9;
    groupRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.18;
    groupRef.current.position.y = Math.sin(time.current * 0.7) * 0.08;
  });

  return (
    <group ref={groupRef} scale={1.1}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#C4622D"
          metalness={0.85}
          roughness={0.1}
          envMapIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

/* ─── Orbiting particles ────────────────────────────────────────────── */
function Particles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.2 + Math.random() * 1.2;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#C4622D" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ─── Scene ─────────────────────────────────────────────────────────── */
function FScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 6, 4]}  intensity={3}   color="#FFF5E0" castShadow />
      <pointLight position={[-4, -3, -4]} intensity={1.2} color="#C4622D" />
      <spotLight
        position={[0, 8, 2]}
        intensity={2}
        angle={0.35}
        penumbra={0.9}
        color="#FFFDF5"
        castShadow
      />
      <Environment preset="studio" />
      <LetterF />
      <Particles />
    </>
  );
}

/* ─── Fallback (shown while Canvas initialises) ─────────────────────── */
function FFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="font-display text-[8rem] md:text-[12rem] font-bold text-sienna select-none leading-none"
        style={{
          backgroundImage: "linear-gradient(135deg, #C4622D 0%, #D4824F 40%, #A0501F 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 4px 24px rgba(196,98,45,0.35))",
        }}
      >
        F
      </div>
    </div>
  );
}

/* ─── Exported component ─────────────────────────────────────────────── */
export function CoinAnimation() {
  return (
    <section className="py-24 bg-beige-50 flex flex-col items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 px-4"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-3 font-sans">
          The FASHION Standard
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
          Crafted with Purpose
        </h2>
        <p className="text-charcoal-500 text-sm mt-4 max-w-md mx-auto leading-relaxed">
          Every piece carries our mark — a promise of quality, honesty, and
          design that stands the test of time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
      >
        <Suspense fallback={<FFallback />}>
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <FScene />
          </Canvas>
        </Suspense>
      </motion.div>
    </section>
  );
}
