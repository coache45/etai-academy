'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { Group, Mesh } from 'three'

/**
 * "Bringing AI Down to Earth" — the brand hologram, rebuilt from the commercial:
 * a neon circuit-Earth (electric-cyan wireframe globe over deep space) with a
 * gold orbit ring and the AI spark descending to touch it. All unlit basic
 * materials + bloom = clean neon glow (no muddy shading). Lazy-loaded ssr:false
 * by ImmersiveHero; never rendered under reduced motion or on small screens.
 */

const ELECTRIC = '#00B3ED'
const AZURE = '#0A72D2'
const GOLD = '#F49E08'
const SPACE = '#061233'

function CircuitEarth() {
  const group = useRef<Group>(null)
  const spark = useRef<Mesh>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (g) {
      g.rotation.y += delta * 0.18
      g.rotation.x += (state.pointer.y * 0.25 - g.rotation.x) * 0.04
      g.rotation.z += (state.pointer.x * 0.12 - g.rotation.z) * 0.04
    }
    const s = spark.current
    if (s) {
      const t = state.clock.elapsedTime
      s.position.y = 1.78 + Math.sin(t * 1.6) * 0.08
      s.rotation.y += delta * 1.2
      s.rotation.x += delta * 0.6
    }
  })

  return (
    <group ref={group}>
      {/* Solid deep-space core so the wireframe reads as a globe */}
      <mesh>
        <sphereGeometry args={[1.19, 48, 48]} />
        <meshBasicMaterial color={SPACE} />
      </mesh>
      {/* Electric circuit-grid shell */}
      <mesh>
        <sphereGeometry args={[1.21, 28, 28]} />
        <meshBasicMaterial color={ELECTRIC} wireframe transparent opacity={0.5} />
      </mesh>
      {/* Inner azure glow shell */}
      <mesh>
        <sphereGeometry args={[1.24, 16, 16]} />
        <meshBasicMaterial color={AZURE} wireframe transparent opacity={0.14} />
      </mesh>
      {/* Gold orbit ring (tilted like the brand's equatorial sweep) */}
      <mesh rotation={[Math.PI / 2.6, 0, 0.4]}>
        <torusGeometry args={[1.62, 0.014, 12, 96]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.9} />
      </mesh>
      {/* Thin cyan counter-ring */}
      <mesh rotation={[Math.PI / 1.8, 0.5, -0.3]}>
        <torusGeometry args={[1.48, 0.006, 8, 96]} />
        <meshBasicMaterial color={ELECTRIC} transparent opacity={0.45} />
      </mesh>
      {/* The AI spark, descending to touch Earth */}
      <mesh ref={spark} position={[0, 1.78, 0]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshBasicMaterial color="#FFE9A8" />
      </mesh>
      {/* Beam from spark toward the globe */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.012, 0.03, 0.5, 8]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
      </mesh>
      {/* Ambient particles: gold + cyan */}
      <Sparkles count={40} scale={4.2} size={2.2} speed={0.35} color={GOLD} opacity={0.7} />
      <Sparkles count={60} scale={5} size={1.6} speed={0.25} color={ELECTRIC} opacity={0.5} />
    </group>
  )
}

export default function HoloCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <CircuitEarth />
      <EffectComposer>
        <Bloom intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.55} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
