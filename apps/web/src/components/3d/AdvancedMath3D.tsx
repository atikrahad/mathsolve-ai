'use client';

import type { CSSProperties } from 'react';

const services = [
  { name: 'Dynamic Programming', language: 'TypeScript', health: '96% solved' },
  { name: 'Graph Theory', language: 'Python', health: '92% solved' },
  { name: 'Concurrency', language: 'Go', health: '88% solved' },
  { name: 'Systems Design', language: 'Rust', health: '94% solved' },
  { name: 'Data Streaming', language: 'Swift', health: '89% solved' },
  { name: 'Security Kata', language: 'Kotlin', health: '91% solved' },
];

const events = [
  { title: 'New Challenges', value: '87', color: '#f97316' },
  { title: 'Live Participants', value: '4.3k', color: '#60a5fa' },
  { title: 'Solved Today', value: '12.5k', color: '#34d399' },
];

const regions = [
  { name: 'Algorithms', load: '72%', color: '#4ade80' },
  { name: 'Systems', load: '64%', color: '#a855f7' },
  { name: 'AI/ML', load: '58%', color: '#facc15' },
];

export default function AdvancedMath3D() {
  return (
    <div className="network-wrapper">
      <div className="network-gradient" />
      <div className="network-core">
        <div className="core-ring">
          <span className="core-label">Challenge Graph</span>
          <span className="core-metric">3.2M attempts/day</span>
          <div className="core-chip">Solve rate 82%</div>
        </div>
        <div className="core-pulse" />
        <div className="core-pulse core-pulse--secondary" />
      </div>

      <div className="node-orbit">
        {services.map((service, index) => (
          <div
            key={service.name}
            className="service-node"
            style={{ ['--index' as never]: index } as CSSProperties}
          >
            <div className="node-dot" />
            <div>
              <p className="node-name">{service.name}</p>
              <p className="node-meta">{service.language}</p>
            </div>
            <span className="node-health">{service.health}</span>
          </div>
        ))}
      </div>

      <div className="event-feed">
        {events.map((event) => (
          <div key={event.title} className="event-card">
            <span className="event-indicator" style={{ background: event.color }} />
            <div>
              <p className="event-title">{event.title}</p>
              <p className="event-value" style={{ color: event.color }}>
                {event.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="region-panel">
        {regions.map((region) => (
          <div key={region.name} className="region-row">
            <span>{region.name}</span>
            <div className="region-bar">
              <span style={{ width: region.load, background: region.color }} />
            </div>
            <strong>{region.load}</strong>
          </div>
        ))}
      </div>

      <style jsx>{`
        .network-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 18rem;
          border-radius: 1.5rem;
          overflow: hidden;
          background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2), transparent 55%),
            radial-gradient(circle at 80% 0%, rgba(236, 72, 153, 0.2), transparent 50%),
            linear-gradient(135deg, #020617, #030712);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: inset 0 0 60px rgba(15, 23, 42, 0.6);
        }

        .network-gradient {
          position: absolute;
          inset: -30% -20% auto;
          height: 60%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.35), transparent 70%);
          filter: blur(60px);
        }

        .network-core {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .core-ring {
          width: 230px;
          height: 230px;
          border-radius: 999px;
          border: 1px solid rgba(94, 234, 212, 0.4);
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          text-align: center;
          color: #e2e8f0;
          font-size: 0.85rem;
          letter-spacing: 0.03em;
        }

        .core-label {
          opacity: 0.8;
          text-transform: uppercase;
        }

        .core-metric {
          font-size: 1rem;
          font-weight: 600;
          color: #34d399;
        }

        .core-chip {
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #34d399;
        }

        .core-pulse {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          animation: pulseRing 8s ease-in-out infinite;
        }

        .core-pulse--secondary {
          width: 300px;
          height: 300px;
          border-color: rgba(14, 165, 233, 0.25);
          animation-duration: 12s;
        }

        .node-orbit {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          transform-style: preserve-3d;
          animation: rotateOrbit 28s linear infinite;
        }

        .service-node {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          padding: 0.85rem 1rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(147, 197, 253, 0.2);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transform-style: preserve-3d;
          transform: rotateY(calc(var(--index) * 60deg)) translateZ(260px) translate(-50%, -50%);
          box-shadow: 0 10px 30px rgba(15, 118, 110, 0.25);
          backdrop-filter: blur(6px);
        }

        .service-node:nth-child(even) {
          transform: rotateY(calc(var(--index) * 60deg)) translateZ(220px) translate(-50%, -50%) translateY(30px);
        }

        .node-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #38bdf8;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.8);
        }

        .node-name {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .node-meta {
          margin: 0;
          font-size: 0.75rem;
          opacity: 0.7;
          color: #cbd5f5;
        }

        .node-health {
          font-size: 0.85rem;
          font-weight: 600;
          color: #34d399;
        }

        .event-feed {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          display: flex;
          gap: 1rem;
          justify-content: space-between;
        }

        .event-card {
          flex: 1;
          display: flex;
          gap: 0.65rem;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          background: rgba(2, 6, 23, 0.85);
          border: 1px solid rgba(59, 130, 246, 0.35);
          min-width: 140px;
          box-shadow: 0 12px 25px rgba(59, 130, 246, 0.25);
        }

        .event-indicator {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          box-shadow: 0 0 14px currentColor;
        }

        .event-title {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .event-value {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.4;
          }
        }

        @keyframes rotateOrbit {
          from {
            transform: rotateX(18deg) rotateY(0deg);
          }
          to {
            transform: rotateX(18deg) rotateY(360deg);
          }
        }

        .region-panel {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 220px;
          border-radius: 1rem;
          background: rgba(2, 6, 23, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.25);
          padding: 0.9rem 1rem;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.45);
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .region-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #cbd5f5;
        }

        .region-row strong {
          margin-left: auto;
          font-size: 0.8rem;
        }

        .region-bar {
          flex: 1;
          height: 6px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 999px;
          overflow: hidden;
        }

        .region-bar span {
          display: block;
          height: 100%;
          border-radius: 999px;
        }

        @media (max-width: 768px) {
          .network-wrapper {
            height: 22rem;
          }

          .service-node {
            width: 160px;
          }

          .event-feed {
            flex-direction: column;
            bottom: 1rem;
          }

          .region-panel {
            position: absolute;
            inset: auto 1rem 1rem;
            width: calc(100% - 2rem);
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.6rem;
          }

          .region-row {
            width: 48%;
          }
        }
      `}</style>
    </div>
  );
}
