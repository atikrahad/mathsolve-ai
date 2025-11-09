'use client';

import { useEffect, useRef } from 'react';

const stacks = [
  { name: 'Algorithms', progress: 0.82, color: '#34d399' },
  { name: 'Systems', progress: 0.67, color: '#f97316' },
  { name: 'AI & ML', progress: 0.59, color: '#38bdf8' },
];

const metrics = [
  { label: 'Active Rooms', value: '284', accent: '#5eead4' },
  { label: 'Solve Rate', value: '97.4%', accent: '#f97316' },
  { label: 'Runtime Budget', value: '42ms', accent: '#a78bfa' },
];

const timeline = [
  'Decomposing prompt → 5 nodes',
  'Synthesizing solution variants',
  'Running 142 assertions',
  'Packaging insights for review',
];

export default function MathScene3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      element.style.setProperty('--tilt-x', `${(0.5 - y) * 10}deg`);
      element.style.setProperty('--tilt-y', `${(x - 0.5) * 14}deg`);
      element.style.setProperty('--cursor-x', `${x * 100}%`);
      element.style.setProperty('--cursor-y', `${y * 100}%`);
    };

    const reset = () => {
      element.style.setProperty('--tilt-x', '0deg');
      element.style.setProperty('--tilt-y', '0deg');
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', reset);

    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="solver-scene">
      <div className="scene-grid" />
      <div className="scene-glow" />

      <div className="solver-core" aria-label="Interactive problem solving showcase">
        <div className="core-header">
          <span className="core-status">
            <span className="dot" />
            Mission · Graph Optimizer
          </span>
          <span className="core-chip">Phase 03 · Evaluate</span>
        </div>
        <pre className="core-code">
{`function solve(problem) {
  const plan = planner(problem);
  const options = simulate(plan);
  return rank(options).best();
}`}
        </pre>
        <div className="core-footer">
          Next checkpoint in <strong>00:18</strong>
          <span className="core-progress">
            <span />
          </span>
        </div>
      </div>

      <div className="orbit-ring orbit-ring--outer" />
      <div className="orbit-ring orbit-ring--inner" />

      <div className="stack-panel">
        <h4>Challenge Mix</h4>
        {stacks.map((stack) => (
          <div key={stack.name} className="stack-row">
            <span>{stack.name}</span>
            <div className="stack-bar">
              <span style={{ width: `${stack.progress * 100}%`, background: stack.color }} />
            </div>
            <strong>{Math.round(stack.progress * 100)}%</strong>
          </div>
        ))}
      </div>

      <div className="metric-column">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <p>{metric.label}</p>
            <strong style={{ color: metric.accent }}>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className="timeline-panel">
        <p className="timeline-title">Live reasoning feed</p>
        <div className="timeline-items">
          {timeline.map((item, index) => (
            <div key={item} className="timeline-item">
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .solver-scene {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: clamp(32rem, 90vh, 100vh);
          border-radius: 1.5rem;
          overflow: hidden;
          background: radial-gradient(circle at 20% 0%, rgba(14, 165, 233, 0.15), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(45, 212, 191, 0.15), transparent 50%),
            linear-gradient(135deg, #020617, #030712, #050816);
          border: 1px solid rgba(56, 189, 248, 0.15);
          box-shadow: inset 0 0 80px rgba(2, 6, 23, 0.8);
          perspective: 1400px;
          --tilt-x: 0deg;
          --tilt-y: 0deg;
        }

        .scene-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 180px 180px;
          transform: rotateX(70deg) translateY(65%);
          opacity: 0.2;
        }

        .scene-glow {
          position: absolute;
          inset: -15%;
          background: radial-gradient(circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(59, 130, 246, 0.35), transparent 45%);
          filter: blur(90px);
          transition: background 0.3s ease-out;
        }

        .solver-core {
          position: absolute;
          top: 25%;
          left: 50%;
          transform-style: preserve-3d;
          transform: translate(-50%, -50%) rotateX(calc(8deg + var(--tilt-x))) rotateY(var(--tilt-y));
          width: min(520px, 80%);
          border-radius: 1.5rem;
          padding: 1.75rem;
          background: rgba(2, 6, 23, 0.9);
          border: 1px solid rgba(14, 165, 233, 0.25);
          backdrop-filter: blur(12px);
          box-shadow: 0 40px 80px rgba(2, 132, 199, 0.15);
        }

        .solver-core::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), transparent);
          pointer-events: none;
        }

        .core-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #cbd5f5;
        }

        .core-status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #34d399;
          box-shadow: 0 0 12px rgba(52, 211, 153, 0.7);
        }

        .core-chip {
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(94, 234, 212, 0.25);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: #a5f3fc;
        }

        .core-code {
          margin: 1.5rem 0;
          padding: 1.25rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(14, 165, 233, 0.15);
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.95rem;
          color: #e2e8f0;
          line-height: 1.5;
          box-shadow: inset 0 0 30px rgba(2, 132, 199, 0.15);
        }

        .core-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #cbd5f5;
        }

        .core-progress {
          position: relative;
          width: 160px;
          height: 4px;
          background: rgba(148, 163, 184, 0.3);
          border-radius: 999px;
          overflow: hidden;
        }

        .core-progress span {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #22d3ee, #14b8a6);
          animation: sweep 4s ease-in-out infinite;
        }

        .orbit-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          border-radius: 999px;
          border: 1px dashed rgba(56, 189, 248, 0.25);
          transform: translate(-50%, -50%) rotateX(calc(18deg + var(--tilt-x))) rotateY(var(--tilt-y));
          animation: orbitGlow 14s linear infinite;
        }

        .orbit-ring--outer {
          width: 540px;
          height: 540px;
        }

        .orbit-ring--inner {
          width: 420px;
          height: 420px;
          animation-duration: 10s;
        }

        .stack-panel {
          position: absolute;
          top: 2rem;
          left: 2rem;
          width: 260px;
          padding: 1.25rem;
          border-radius: 1rem;
          background: rgba(5, 12, 25, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: #cbd5f5;
          backdrop-filter: blur(8px);
        }

        .stack-panel h4 {
          margin: 0 0 1rem;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e2e8f0;
        }

        .stack-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .stack-bar {
          flex: 1;
          height: 6px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 999px;
          overflow: hidden;
        }

        .stack-bar span {
          display: block;
          height: 100%;
          border-radius: 999px;
        }

        .metric-column {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .metric-card {
          width: 200px;
          padding: 0.95rem 1.1rem;
          border-radius: 1rem;
          background: rgba(2, 6, 23, 0.85);
          border: 1px solid rgba(125, 211, 252, 0.2);
          color: #94a3b8;
          box-shadow: 0 20px 40px rgba(2, 132, 199, 0.15);
        }

        .metric-card p {
          margin: 0 0 0.35rem;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .metric-card strong {
          font-size: 1.4rem;
        }

        .timeline-panel {
          position: absolute;
          bottom: 13rem;
          left: 50%;
          transform: translateX(-50%);
          width: min(640px, calc(100% - 2rem));
          padding: 1.1rem 1.4rem;
          border-radius: 1.25rem;
          background: rgba(3, 7, 18, 0.92);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 25px 50px rgba(8, 47, 73, 0.35);
          color: #cbd5f5;
        }

        .timeline-title {
          margin: 0 0 0.75rem;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e2e8f0;
        }

        .timeline-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.9rem;
        }

        .timeline-item {
          display: flex;
          gap: 0.65rem;
          align-items: center;
          font-size: 0.85rem;
          background: rgba(8, 47, 73, 0.55);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 0.9rem;
          padding: 0.9rem 1rem;
        }

        .timeline-item span {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          border: 1px solid rgba(94, 234, 212, 0.5);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #5eead4;
        }

        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes orbitGlow {
          from {
            transform: translate(-50%, -50%) rotateX(calc(18deg + var(--tilt-x))) rotateY(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotateX(calc(18deg + var(--tilt-x))) rotateY(360deg);
          }
        }

        @media (max-width: 1024px) {
          .stack-panel,
          .metric-column {
            position: static;
            width: 100%;
            margin-bottom: 1rem;
          }

          .metric-column {
            flex-direction: row;
            justify-content: space-between;
          }

          .metric-card {
            flex: 1;
          }
        }

        @media (max-width: 768px) {
          .solver-core {
            width: calc(100% - 2rem);
            padding: 1.25rem;
          }

          .stack-panel,
          .metric-column {
            flex-wrap: wrap;
          }

          .metric-card {
            width: 100%;
          }

          .timeline-items {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
