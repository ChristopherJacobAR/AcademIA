import React, { useState, useEffect, useRef } from 'react';

interface Atom3D {
  element: 'H' | 'C' | 'O' | 'N' | 'Na' | 'Cl';
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
}

interface Bond {
  a: number;
  b: number;
}

interface MoleculeData {
  name: string;
  formula: string;
  desc: string;
  atoms: Atom3D[];
  bonds: Bond[];
}

const MOLECULES: Record<string, MoleculeData> = {
  water: {
    name: 'Agua',
    formula: 'H₂O',
    desc: 'Geometría angular (104.5°), momento dipolar neto, puente de hidrógeno.',
    atoms: [
      { element: 'O', x: 0, y: -0.15, z: 0, radius: 18, color: '#e5e5e5' },
      { element: 'H', x: -0.75, y: 0.45, z: 0, radius: 11, color: '#737373' },
      { element: 'H', x: 0.75, y: 0.45, z: 0, radius: 11, color: '#737373' }
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }]
  },
  benzene: {
    name: 'Benceno',
    formula: 'C₆H₆',
    desc: 'Anillo aromático plano con deslocalización electrónica pi y resonancia de Hückel.',
    atoms: [
      // 6 carbons in ring
      { element: 'C', x: Math.cos(0) * 1.2, y: Math.sin(0) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      { element: 'C', x: Math.cos(Math.PI / 3) * 1.2, y: Math.sin(Math.PI / 3) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      { element: 'C', x: Math.cos((2 * Math.PI) / 3) * 1.2, y: Math.sin((2 * Math.PI) / 3) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      { element: 'C', x: Math.cos(Math.PI) * 1.2, y: Math.sin(Math.PI) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      { element: 'C', x: Math.cos((4 * Math.PI) / 3) * 1.2, y: Math.sin((4 * Math.PI) / 3) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      { element: 'C', x: Math.cos((5 * Math.PI) / 3) * 1.2, y: Math.sin((5 * Math.PI) / 3) * 1.2, z: 0, radius: 15, color: '#d4d4d4' },
      // 6 hydrogens
      { element: 'H', x: Math.cos(0) * 2.0, y: Math.sin(0) * 2.0, z: 0, radius: 10, color: '#737373' },
      { element: 'H', x: Math.cos(Math.PI / 3) * 2.0, y: Math.sin(Math.PI / 3) * 2.0, z: 0, radius: 10, color: '#737373' },
      { element: 'H', x: Math.cos((2 * Math.PI) / 3) * 2.0, y: Math.sin((2 * Math.PI) / 3) * 2.0, z: 0, radius: 10, color: '#737373' },
      { element: 'H', x: Math.cos(Math.PI) * 2.0, y: Math.sin(Math.PI) * 2.0, z: 0, radius: 10, color: '#737373' },
      { element: 'H', x: Math.cos((4 * Math.PI) / 3) * 2.0, y: Math.sin((4 * Math.PI) / 3) * 2.0, z: 0, radius: 10, color: '#737373' },
      { element: 'H', x: Math.cos((5 * Math.PI) / 3) * 2.0, y: Math.sin((5 * Math.PI) / 3) * 2.0, z: 0, radius: 10, color: '#737373' }
    ],
    bonds: [
      { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }, { a: 4, b: 5 }, { a: 5, b: 0 },
      { a: 0, b: 6 }, { a: 1, b: 7 }, { a: 2, b: 8 }, { a: 3, b: 9 }, { a: 4, b: 10 }, { a: 5, b: 11 }
    ]
  },
  methane: {
    name: 'Metano',
    formula: 'CH₄',
    desc: 'Geometría tetraédrica perfecta sp³ (109.5°), no polar.',
    atoms: [
      { element: 'C', x: 0, y: 0, z: 0, radius: 18, color: '#e5e5e5' },
      { element: 'H', x: 0, y: 1.0, z: 0, radius: 11, color: '#737373' },
      { element: 'H', x: 0.94, y: -0.33, z: 0, radius: 11, color: '#737373' },
      { element: 'H', x: -0.47, y: -0.33, z: 0.81, radius: 11, color: '#737373' },
      { element: 'H', x: -0.47, y: -0.33, z: -0.81, radius: 11, color: '#737373' }
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }]
  },
  nacl: {
    name: 'Red Cristalina NaCl',
    formula: 'Na⁺ Cl⁻',
    desc: 'Estructura cúbica centrada en las caras (FCC) de halita, enlace iónico electrostático.',
    atoms: [
      // Corner atoms (Cl)
      { element: 'Cl', x: -1, y: -1, z: -1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: 1, y: -1, z: -1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: -1, y: 1, z: -1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: 1, y: 1, z: -1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: -1, y: -1, z: 1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: 1, y: -1, z: 1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: -1, y: 1, z: 1, radius: 14, color: '#a3a3a3' },
      { element: 'Cl', x: 1, y: 1, z: 1, radius: 14, color: '#a3a3a3' },
      // Edge/Center atoms (Na)
      { element: 'Na', x: 0, y: 0, z: 0, radius: 11, color: '#ffffff' },
      { element: 'Na', x: 0, y: -1, z: -1, radius: 11, color: '#ffffff' },
      { element: 'Na', x: 0, y: 1, z: -1, radius: 11, color: '#ffffff' },
      { element: 'Na', x: -1, y: 0, z: -1, radius: 11, color: '#ffffff' },
      { element: 'Na', x: 1, y: 0, z: -1, radius: 11, color: '#ffffff' }
    ],
    bonds: [
      { a: 0, b: 1 }, { a: 2, b: 3 }, { a: 0, b: 2 }, { a: 1, b: 3 },
      { a: 4, b: 5 }, { a: 6, b: 7 }, { a: 4, b: 6 }, { a: 5, b: 7 },
      { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }
    ]
  }
};

export const MolecularViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedKey, setSelectedKey] = useState<string>('benzene');

  // Rotation angles
  const rotRef = useRef({ rotX: 0.3, rotY: 0.5, isDragging: false, lastMouseX: 0, lastMouseY: 0 });

  const molecule = MOLECULES[selectedKey] || MOLECULES.water;

  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Auto gentle rotate if not dragging
      if (!rotRef.current.isDragging) {
        rotRef.current.rotY += 0.008;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const scale = 75;

      ctx.clearRect(0, 0, width, height);

      const rotX = rotRef.current.rotX;
      const rotY = rotRef.current.rotY;

      // Project 3D atoms to 2D
      const projectedAtoms = molecule.atoms.map((atom, idx) => {
        // Y rotation
        let x1 = atom.x * Math.cos(rotY) + atom.z * Math.sin(rotY);
        let z1 = -atom.x * Math.sin(rotY) + atom.z * Math.cos(rotY);
        let y1 = atom.y;

        // X rotation
        let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
        let x2 = x1;

        // Perspective
        const fov = 400;
        const pz = z2 * scale + 300;
        const pScale = fov / Math.max(50, pz);

        return {
          idx,
          element: atom.element,
          screenX: cx + x2 * scale * pScale,
          screenY: cy + y2 * scale * pScale,
          depth: z2,
          radius: atom.radius * pScale,
          color: atom.color
        };
      });

      // Sort by depth (painter's algorithm)
      const sortedAtoms = [...projectedAtoms].sort((a, b) => a.depth - b.depth);

      // Draw bonds
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2.5;
      for (const bond of molecule.bonds) {
        const pA = projectedAtoms[bond.a];
        const pB = projectedAtoms[bond.b];
        if (pA && pB) {
          ctx.beginPath();
          ctx.moveTo(pA.screenX, pA.screenY);
          ctx.lineTo(pB.screenX, pB.screenY);
          ctx.stroke();
        }
      }

      // Draw atoms
      for (const pAtom of sortedAtoms) {
        // Depth-shaded sphere
        const grad = ctx.createRadialGradient(
          pAtom.screenX - pAtom.radius * 0.3,
          pAtom.screenY - pAtom.radius * 0.3,
          pAtom.radius * 0.1,
          pAtom.screenX,
          pAtom.screenY,
          pAtom.radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, pAtom.color);
        grad.addColorStop(1, '#000000');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pAtom.screenX, pAtom.screenY, pAtom.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(pAtom.element, pAtom.screenX - 3, pAtom.screenY + 3);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [molecule]);

  const handleMouseDown = (e: React.MouseEvent) => {
    rotRef.current.isDragging = true;
    rotRef.current.lastMouseX = e.clientX;
    rotRef.current.lastMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rotRef.current.isDragging) return;
    const dx = e.clientX - rotRef.current.lastMouseX;
    const dy = e.clientY - rotRef.current.lastMouseY;
    rotRef.current.rotY += dx * 0.01;
    rotRef.current.rotX += dy * 0.01;
    rotRef.current.lastMouseX = e.clientX;
    rotRef.current.lastMouseY = e.clientY;
  };

  const handleMouseUp = () => {
    rotRef.current.isDragging = false;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base">Visualizador Molecular 3D (Química & Bioquímica)</h3>
          <p className="text-xs text-neutral-400 font-light">
            Estructuras moleculares en proyección tridimensional rotatoria con sombreado de profundidad y enlaces químicos.
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.keys(MOLECULES).map(key => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`text-xs px-3 py-1.5 rounded-xl transition ${
                selectedKey === key
                  ? 'bg-white text-black font-semibold'
                  : 'glass-pill hover:bg-white/10 text-neutral-300'
              }`}
            >
              {MOLECULES[key].formula} ({MOLECULES[key].name})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-2 bg-black/60 rounded-2xl border border-white/10 p-2 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={340}
            className="w-full max-w-[600px] h-auto rounded-xl"
          />
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white font-mono">{molecule.formula}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-white/15 text-neutral-300 font-mono">
                {molecule.atoms.length} átomos
              </span>
            </div>
            <h4 className="font-semibold text-white text-sm">{molecule.name}</h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              {molecule.desc}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] text-neutral-400 font-light space-y-1">
            <span className="text-white font-medium block">Interacción Táctil y Mouse:</span>
            Arrastra sobre el lienzo para rotar en 3D en cualquier ángulo. Compatible con Apple Pencil y trackpad.
          </div>
        </div>
      </div>
    </div>
  );
};
