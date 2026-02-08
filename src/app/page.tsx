"use client";

import React, { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type Stage = "closed" | "pulling" | "fullscreen";

/**
 * Flap emboss using a height map generated from your pattern.
 * Your /embossing_pattern.png has a dark background, so we invert luminance in shader
 * so the motif becomes the height.
 */
function EmbossPlane() {
  const tex = useTexture("/embossing_pattern.png");
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const configuredTex = useMemo(() => {
    const texture = tex.clone();
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.6, 2.6);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [tex]);

  useFrame(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += 0.01;
  });

  const shader = useMemo(() => {
    return {
      uniforms: {
        uTex: { value: configuredTex },
        uRepeat: { value: new THREE.Vector2(2.6, 2.6) },
        uHeight: { value: -0.075 }, // deboss depth (negative for sunken) - significantly increased for visibility
        uLightDir: { value: new THREE.Vector3(0.35, 0.55, 0.75).normalize() },
        uSpec: { value: 0.32 }, // satin highlight strength - increased for visibility
        uGloss: { value: 32.0 }, // highlight tightness - reduced for broader highlights
        uTime: { value: 0.0 },
        uTint: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uTex;
        uniform vec2 uRepeat;
        uniform float uHeight;
        uniform vec3 uLightDir;
        uniform float uSpec;
        uniform float uGloss;
        uniform vec3 uTint;
        uniform float uTime;

        varying vec2 vUv;

        float heightFromTex(vec2 uv) {
          vec2 tuv = uv * uRepeat;

          // sample pattern
          vec4 c = texture2D(uTex, tuv);

          // luminance
          float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));

          // use luminance directly for deboss (sunken) - dark areas are sunken
          float h = lum;

          // soften and clamp so it stays paper-like
          h = smoothstep(0.18, 0.92, h);
          return h;
        }

        void main() {
          // build a normal from height using screen-space derivatives
          float h = heightFromTex(vUv);

          float hx = heightFromTex(vUv + vec2(0.0022, 0.0));
          float hy = heightFromTex(vUv + vec2(0.0, 0.0022));

          // Calculate normals for deboss (inverted for sunken effect)
          vec3 dx = vec3(1.0, 0.0, (hx - h) * uHeight);
          vec3 dy = vec3(0.0, 1.0, (hy - h) * uHeight);

          vec3 n = normalize(cross(dx, dy));
          // Invert z component for deboss to create sunken appearance
          n = normalize(vec3(n.x, n.y, -abs(n.z) + 0.15));

          // lighting
          vec3 L = normalize(uLightDir);
          float ndl = clamp(dot(n, L) * 0.5 + 0.5, 0.0, 1.0);

          // subtle paper shading from deboss (sunken areas are darker)
          float diffuse = 0.50 + ndl * 0.50;

          // specular highlight on edges of sunken areas
          vec3 V = vec3(0.0, 0.0, 1.0);
          vec3 H = normalize(L + V);
          // Invert specular for deboss - highlights appear on edges
          float spec = pow(max(dot(-n, H), 0.0), uGloss) * uSpec * 0.6;

          // keep it white-on-white: deboss creates shadows in sunken areas - much stronger contrast
          float deboss = (diffuse - 0.55) * 0.50 - spec * 0.30;

          vec3 base = uTint;

          // final, very subtle deboss contribution (negative for sunken)
          vec3 color = base + vec3(deboss);

          // clamp to stay bright
          color = clamp(color, vec3(0.0), vec3(1.0));

          // alpha based on deboss so it blends nicely over flap - increased for maximum visibility
          float alpha = 0.85;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    } as const;
  }, [configuredTex]);

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial ref={materialRef} attach="material" {...shader} />
    </mesh>
  );
}

function FlapEmbossWebGL() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 34%, 50% 57%, 0% 34%)",
        opacity: 1.0,
        mixBlendMode: "soft-light",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 1.6], fov: 35 }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[-1, 1.2, 1.4]} intensity={0.85} />
        <EmbossPlane />
      </Canvas>
    </div>
  );
}

export default function WeddingInvite() {
  const [stage, setStage] = useState<Stage>("closed");

  const springPull = useMemo(
    () => ({ type: "spring" as const, stiffness: 140, damping: 22, mass: 1.1 }),
    []
  );

  const springExpand = useMemo(
    () => ({ type: "spring" as const, stiffness: 120, damping: 20, mass: 1.25 }),
    []
  );

  const isOpen = stage !== "closed";
  const isFullscreen = stage === "fullscreen";

  function openFromSeal() {
    if (stage !== "closed") return;
    setStage("pulling");
  }

  function goFullscreen() {
    setStage("fullscreen");
  }

  function closeAll() {
    setStage("pulling");
    window.setTimeout(() => setStage("closed"), 260);
  }

  return (
    <div className="min-h-[100svh] bg-[#E7EEE6]">
      <div className="min-h-[100svh] flex items-center justify-center px-4 py-8">
        <div className="relative perspective-scene env-frame">
          {/* Background lighting */}
          <div className="absolute -inset-10 pointer-events-none">
            <div className="absolute inset-0 env-vignette" />
            <div className="absolute inset-0 env-light" />
            <div className="absolute inset-0 env-grain" />
          </div>

          {/* Envelope fades when fullscreen */}
          <motion.div
            animate={
              isFullscreen
                ? { opacity: 0, scale: 0.985, filter: "blur(2px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Cast shadow */}
            <div className="absolute inset-0 rounded-[28px] env-cast-shadow pointer-events-none" />

            {/* Base */}
            <div className="absolute inset-0 rounded-[28px] envelope-white shadow-envelope envelope-depth-shadow" />

            {/* realism overlays */}
            <div className="absolute inset-0 rounded-[28px] env-paper-fibers pointer-events-none z-[5]" />
            <div className="absolute inset-0 rounded-[28px] env-paper-grain pointer-events-none z-[6]" />

            {/* Pocket */}
            <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none z-20">
              <div className="pocket-left-fill" />
              <div className="pocket-right-fill" />
              <div className="pocket-bottom-fill" />
              <div className="seam-left" />
              <div className="seam-right" />
              <div className="seam-bottom" />
              <div className="pocket-center-soft" />
            </div>

            {/* Flap */}
            <motion.div
              className="absolute inset-0 origin-top z-[45] rounded-[28px] overflow-hidden"
              style={{ 
                transformStyle: "preserve-3d", 
                backfaceVisibility: "hidden",
                transform: isOpen ? undefined : "translateY(-4px) translateZ(2px)"
              }}
              animate={isOpen ? { rotateX: -175 } : { rotateX: 0 }}
              transition={springPull}
            >
              {/* Cast shadow from elevated flap - minimal for white appearance */}
              {!isOpen && <div className="flap-cast-shadow" />}
              <div className="absolute inset-0 flap" />
              <div className="absolute inset-0 flap-texture pointer-events-none" />
              <div className="absolute inset-0 flap-grain pointer-events-none" />
              <div className="absolute inset-0 flap-paper-microtexture pointer-events-none" />
              <div className="absolute inset-0 flap-vignette pointer-events-none" />
              <div className="absolute inset-0 flap-depth pointer-events-none" />

              {/* CSS-based emboss layers for additional depth */}
              <div className="absolute inset-0 flap-emboss-base pointer-events-none" />
              <div className="absolute inset-0 flap-emboss-deboss-shadow pointer-events-none" />
              <div className="absolute inset-0 flap-emboss-deboss-highlight pointer-events-none" />

              {/* Highest quality emboss on flap only */}
              <FlapEmbossWebGL />

              <div className="absolute inset-0 flap-edge-thickness pointer-events-none" />
              <div className="absolute inset-0 flap-bevel pointer-events-none" />
              <div className="absolute inset-0 flap-overlap-shadow pointer-events-none" />
              <div className="absolute inset-0 flap-edge-bevels pointer-events-none" />
              <div className="absolute inset-0 flap-tip-contact pointer-events-none" />
              <div className="absolute inset-0 flap-rim-light pointer-events-none" />
            </motion.div>

            {/* Seal only when closed */}
            <AnimatePresence>
              {stage === "closed" && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.25 } }}
                  className="absolute inset-0 z-50"
                >
                  <button
                    type="button"
                    onClick={openFromSeal}
                    className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    aria-label="Open invitation"
                  >
                    <div className="seal-contact-shadow pointer-events-none" />
                    <div className="relative w-[148px] h-[148px] rounded-full overflow-hidden seal-img">
                      <Image
                        src="/Seal Picture.png"
                        alt="Wax Seal"
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 seal-spec pointer-events-none" />
                    </div>
                  </button>

                  <div className="absolute bottom-9 inset-x-0 text-center">
                    <h1 className="font-wedding text-[58px] leading-[0.92] text-[#233323]">
                      Nada &amp; Karim
                    </h1>
                    <p className="mt-3 font-sans text-[10px] tracking-[0.5em] uppercase text-black/32">
                      May 2026
                    </p>
                    <p className="mt-6 font-sans text-[10px] tracking-[0.35em] uppercase text-black/36">
                      Tap seal to open
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rim + sheen */}
            <div className="absolute inset-0 rounded-[28px] pointer-events-none envelope-rim z-10" />
            <div className="absolute inset-0 rounded-[28px] pointer-events-none envelope-sheen z-10" />
          </motion.div>

          {/* CARD PHASE 1: pull out */}
          <AnimatePresence>
            {(stage === "pulling" || stage === "fullscreen") && (
              <motion.div
                key="card"
                initial={{ y: "94%", opacity: 0 }}
                animate={{ y: "14%", opacity: 1 }}
                transition={springPull}
                onAnimationComplete={() => {
                  if (stage === "pulling") {
                    window.setTimeout(() => goFullscreen(), 140);
                  }
                }}
                className="absolute inset-x-[14px] h-[80%] rounded-[22px] z-[60] overflow-hidden paper shadow-paper paper-thickness-shadow"
              >
                <div className="absolute inset-0 paper-texture-overlay" />
                <div className="h-full flex flex-col relative">
                  <div className="px-7 pt-8 pb-5 text-center">
                    <p className="font-sans text-[10px] tracking-[0.38em] uppercase invite-ink">
                      You are cordially invited
                    </p>
                    <h2 className="mt-6 font-wedding text-[58px] leading-[0.95] invite-ink">
                      Nada <span className="opacity-40">&</span> Karim
                    </h2>
                    <div className="mt-6 h-px w-28 mx-auto bg-gradient-to-r from-transparent via-black/15 to-transparent" />
                  </div>

                  <div className="relative flex-1 overflow-hidden">
                    <div className="invite-scroll h-full overflow-y-auto px-7 pb-10 pt-3">
                      <section className="text-center invite-ink">
                        <p className="font-sans text-[11px] tracking-[0.22em] uppercase opacity-80">
                          May 22, 2026
                        </p>
                        <p className="mt-2 font-sans text-[11px] tracking-[0.22em] uppercase opacity-70">
                          Royal Garden Estate
                        </p>
                        <p className="mt-2 font-sans text-[11px] tracking-[0.22em] uppercase opacity-60">
                          London, United Kingdom
                        </p>
                      </section>

                      <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                      <section className="mt-8">
                        <h3 className="text-center font-sans text-[10px] tracking-[0.4em] uppercase invite-ink opacity-75">
                          RSVP
                        </h3>
                        <div className="mt-4 rounded-2xl border border-black/10 bg-white/30 px-5 py-4">
                          <p className="text-center text-[14px] invite-ink leading-relaxed opacity-85">
                            Add your RSVP UI here.
                          </p>
                        </div>
                      </section>

                      <section className="mt-8">
                        <h3 className="text-center font-sans text-[10px] tracking-[0.4em] uppercase invite-ink opacity-75">
                          Add to calendar
                        </h3>
                        <div className="mt-4 rounded-2xl border border-black/10 bg-white/30 px-5 py-4">
                          <p className="text-center text-[14px] invite-ink leading-relaxed opacity-85">
                            Add your iCalendar / Google Calendar buttons here.
                          </p>
                        </div>
                      </section>

                      <div className="h-12" />
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 invite-fade" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CARD PHASE 2: fullscreen */}
          <AnimatePresence>
            {stage === "fullscreen" && (
              <motion.div
                key="fullscreen"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={springExpand}
                className="fixed inset-0 z-[90] paper shadow-paper paper-thickness-shadow overflow-hidden"
              >
                <div className="absolute inset-0 paper-texture-overlay" />
                <div className="h-full flex flex-col relative">
                  <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-black/10 bg-white/25">
                    <button
                      onClick={closeAll}
                      className="text-[12px] tracking-[0.22em] uppercase invite-ink opacity-75"
                    >
                      Close
                    </button>
                    <p className="text-[11px] tracking-[0.25em] uppercase invite-ink opacity-60">
                      Invitation
                    </p>
                    <div className="w-[52px]" />
                  </div>

                  <div className="relative flex-1 overflow-hidden">
                    <div className="invite-scroll h-full overflow-y-auto px-7 pt-10 pb-14">
                      <div className="text-center invite-ink">
                        <p className="font-sans text-[10px] tracking-[0.38em] uppercase opacity-75">
                          You are cordially invited
                        </p>

                        <h2 className="mt-7 font-wedding text-[66px] leading-[0.95] opacity-95">
                          Nada <span className="opacity-40">&</span> Karim
                        </h2>

                        <div className="mt-7 h-px w-28 mx-auto bg-gradient-to-r from-transparent via-black/15 to-transparent" />

                        <p className="mt-7 font-sans text-[11px] tracking-[0.22em] uppercase opacity-80">
                          May 22, 2026
                        </p>
                        <p className="mt-2 font-sans text-[11px] tracking-[0.22em] uppercase opacity-70">
                          Royal Garden Estate
                        </p>
                        <p className="mt-2 font-sans text-[11px] tracking-[0.22em] uppercase opacity-60">
                          London, United Kingdom
                        </p>
                      </div>

                      <div className="mt-10 space-y-8">
                        <section>
                          <h3 className="text-center font-sans text-[10px] tracking-[0.4em] uppercase invite-ink opacity-75">
                            RSVP
                          </h3>
                          <div className="mt-4 rounded-2xl border border-black/10 bg-white/30 px-5 py-4">
                            <p className="text-center text-[14px] invite-ink leading-relaxed opacity-85">
                              Add your RSVP UI here.
                            </p>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-center font-sans text-[10px] tracking-[0.4em] uppercase invite-ink opacity-75">
                            Add to calendar
                          </h3>
                          <div className="mt-4 rounded-2xl border border-black/10 bg-white/30 px-5 py-4">
                            <p className="text-center text-[14px] invite-ink leading-relaxed opacity-85">
                              Add your iCalendar / Google Calendar buttons here.
                            </p>
                          </div>
                        </section>
                      </div>

                      <div className="h-14" />
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 invite-fade" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
