import { Handle, Position } from 'reactflow';
import { Eye, Settings2 } from 'lucide-react';

export default function SkillNode({ id, data }) {
  const {
    label,
    description,
    color,
    status = 'Draft',
    isDevMode,
    onOpenSettings,
    onViewDetails
  } = data;

  return (
    <div
      className="group relative min-w-[220px] max-w-[260px] rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur"
      style={{ backgroundColor: color || '#18212f' }}
    >
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !border-2 !border-slate-950 !bg-cyan-300" />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
              Status
            </span>
            <span className="rounded-full bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
              {status}
            </span>
          </div>
          <h3 className="truncate text-base font-semibold text-white">{label}</h3>
        </div>

        {isDevMode ? (
          <button
            type="button"
            onClick={() => onOpenSettings?.(id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/20 text-white/80 transition hover:bg-black/30 hover:text-white"
            aria-label="Open settings"
          >
            <Settings2 size={16} />
          </button>
        ) : null}
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-6 text-white/82">
        {description || 'Добавь описание навыка, чтобы пользователь мог быстро понять, что именно изучать в этом узле.'}
      </p>

      <button
        type="button"
        onClick={() => onViewDetails?.(id)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-black/30"
      >
        <Eye size={15} />
        View Details
      </button>

      <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !border-2 !border-slate-950 !bg-cyan-300" />
    </div>
  );
}
