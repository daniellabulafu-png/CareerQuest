import { Lock, Code, Network, Brain, Crown, MessageSquare, Cloud, Lightbulb, Users, Mic, Circle } from 'lucide-react';
import { naceForNode, naceColors } from '@/lib/nace';

const iconMap = { Code, Network, Brain, Crown, MessageSquare, Cloud, Lightbulb, Users, Mic, Circle };

const categoryColors = {
  Technical: { from: 'from-violet-500', to: 'to-fuchsia-500', glow: 'glow-primary' },
  Leadership: { from: 'from-amber-400', to: 'to-orange-500', glow: 'glow-xp' },
  Communication: { from: 'from-emerald-400', to: 'to-teal-500', glow: 'glow-success' },
  'Problem Solving': { from: 'from-cyan-400', to: 'to-blue-500', glow: '' },
  Teamwork: { from: 'from-pink-400', to: 'to-rose-500', glow: '' },
};

function computeLayout(nodes) {
  if (!nodes.length) return [];
  const roots = nodes.filter((n) => !n.prerequisite || !nodes.some((p) => p.name === n.prerequisite));
  const children = nodes.filter((n) => !roots.includes(n));

  const rootY = {};
  roots.forEach((r, i) => {
    r._x = 50;
    r._y = roots.length === 1 ? 50 : 15 + (i * 70) / (roots.length - 1);
    rootY[r.name] = r._y;
  });

  const findRoot = (node, seen = new Set()) => {
    if (seen.has(node.name)) return node;
    seen.add(node.name);
    const p = nodes.find((n) => n.name === node.prerequisite);
    return p ? findRoot(p, seen) : node;
  };
  const depthOf = (node, d = 0) => {
    if (!node.prerequisite) return d;
    const p = nodes.find((n) => n.name === node.prerequisite);
    return p ? depthOf(p, d + 1) : d;
  };
  const side = (node) => {
    const c = node.category;
    return c === 'Leadership' || c === 'Teamwork' ? 'left' : 'right';
  };

  children.forEach((node) => {
    node._depth = Math.min(depthOf(node), 2);
    node._side = side(node);
    node._rootY = findRoot(node)._y;
  });

  const cols = {};
  children.forEach((n) => {
    const k = n._side + n._depth;
    (cols[k] = cols[k] || []).push(n);
  });
  Object.values(cols).forEach((arr) => {
    arr.sort((a, b) => a._rootY - b._rootY);
    const x = arr[0]._side === 'right' ? (arr[0]._depth === 1 ? 70 : 88) : arr[0]._depth === 1 ? 30 : 12;
    arr.forEach((n, i) => {
      n._x = x;
      n._y = arr.length === 1 ? n._rootY : 10 + (i * 80) / (arr.length - 1);
    });
  });

  return nodes;
}

export default function SkillTreeGraph({ nodes, gapSkills = [], matchedSkills = [] }) {
  const laid = computeLayout(nodes);
  const edges = nodes
    .filter((n) => n.prerequisite)
    .map((n) => {
      const prereq = nodes.find((p) => p.name === n.prerequisite);
      return prereq ? { from: prereq, to: n } : null;
    })
    .filter(Boolean);

  const statusOf = (node) =>
    matchedSkills.includes(node.name) ? 'matched' : gapSkills.includes(node.name) ? 'gap' : null;

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto">
      {/* Trunk line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="50" y1="6" x2="50" y2="94" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.5" strokeDasharray="1 2" />
        {edges.map((edge, i) => {
          const both = edge.from.unlocked && edge.to.unlocked;
          return (
            <line
              key={i}
              x1={edge.from._x} y1={edge.from._y} x2={edge.to._x} y2={edge.to._y}
              className={both ? 'text-primary' : 'text-border'}
              stroke="currentColor"
              strokeWidth={both ? '0.6' : '0.3'}
              strokeDasharray={both ? '' : '1.5'}
              opacity={both ? '0.5' : '0.3'}
            />
          );
        })}
      </svg>

      {/* Branch labels */}
      <span className="absolute top-1 left-[18%] -translate-x-1/2 text-[9px] font-bold text-amber-400/70 uppercase tracking-wider hidden md:block">Social Sci & Policy</span>
      <span className="absolute bottom-1 left-[18%] -translate-x-1/2 text-[9px] font-bold text-pink-400/70 uppercase tracking-wider hidden md:block">Arts & Performance</span>
      <span className="absolute top-1 right-[18%] translate-x-1/2 text-[9px] font-bold text-violet-400/70 uppercase tracking-wider hidden md:block">STEM & Research</span>
      <span className="absolute bottom-1 right-[18%] translate-x-1/2 text-[9px] font-bold text-emerald-400/70 uppercase tracking-wider hidden md:block">Humanities & Media</span>

      {laid.map((node) => {
        const Icon = iconMap[node.icon] || Circle;
        const colors = categoryColors[node.category] || categoryColors.Technical;
        const status = statusOf(node);
        const ring =
          status === 'matched' ? 'ring-2 ring-success ring-offset-2 ring-offset-card glow-success' :
          status === 'gap' ? 'ring-2 ring-warning ring-offset-2 ring-offset-card' : '';
        const nace = naceForNode(node);

        return (
          <div key={node.id || node.name} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${node._x}%`, top: `${node._y}%` }}>
            <div
              className={`relative w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                node.unlocked
                  ? `bg-gradient-to-br ${colors.from} ${colors.to} ${colors.glow} ${ring} border-2 border-solid border-primary/50`
                  : 'bg-secondary/60 border-2 border-dashed border-border/80 grayscale'
              }`}
              role="img"
              aria-label={`${node.name} skill node, ${node.unlocked ? `unlocked level ${node.level}` : 'locked'}`}
            >
              {node.unlocked ? <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Lock className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />}
              {node.unlocked && node.level > 0 && (
                <div className="absolute -bottom-1.5 -right-1.5 bg-card border border-border rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[9px] md:text-[11px] font-black text-xp">{node.level}</div>
              )}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 text-center pointer-events-none w-20">
              <p className={`text-[9px] md:text-[11px] font-semibold leading-tight ${node.unlocked ? 'text-foreground' : 'text-muted-foreground/60'}`}>{node.name}</p>
              <div className="flex justify-center gap-0.5 mt-0.5">
                {nace.slice(0, 2).map((n) => (
                  <span key={n} className={`w-1.5 h-1.5 rounded-full ${naceColors[n].split(' ')[1]}`} title={n} />
                ))}
              </div>
              {status === 'matched' && <p className="text-[8px] text-success font-bold">✓ MATCH</p>}
              {status === 'gap' && <p className="text-[8px] text-warning font-bold">⚠ GAP</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}