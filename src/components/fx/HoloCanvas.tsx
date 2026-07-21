'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { Group } from 'three'

/**
 * The ONE WebGL moment (per approved scope): a floating holographic-look
 * knot in brand gold/navy with bloom. Lazy-loaded ssr:false by ImmersiveHero;
 * never rendered under reduced motion or on small screens.
 */
function HoloKnot() {
  const group = useRef<Group>(null)
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * 0.25
    g.rotation.x += (state.pointer.y * 0.3 - g.rotation.x) * 0.05
    g.rotation.z += (state.pointer.x * 0.2 - g.rotation.z) * 0.05
  })
  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh>
          <torusKnotGeometry args={[1, 0.32, 220, 32]} />
          <MeshDistortMaterial
            color="#C9A84C"
            emissive="#1B2A4A"
            emissiveIntensity={0.35}
            metalness={0.85}
            roughness={0.18}
            distort={0.28}
            speed={1.6}
          />
        </mesh>
      </Float>
    </group>
  )
}

export default function HoloCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 4, 6]} intensity={1.1} color="#fff7e0" />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#C9A84C" />
      <HoloKnot />
      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.25} luminanceSmoothing={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
