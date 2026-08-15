'use client'

import Particles, { ParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function ParticlesBackground() {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
      <ParticlesProvider init={particlesInit}>
        <Particles
          id="tsparticles"
          className="w-full h-full"
          options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.3,
                },
              },
            },
          },
          particles: {
            color: {
              value: "#06b6d4",
            },
            links: {
              color: "#06b6d4",
              distance: 150,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    </ParticlesProvider>
    </div>
  )
}
