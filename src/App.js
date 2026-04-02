import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MarkerType,
  Panel,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import { Download, Eye, Link2, MoonStar, Plus, Save } from 'lucide-react';
import SkillNode from './SkillNode.jsx';
import 'reactflow/dist/style.css';

const INITIAL_NODES = [
  {
    id: 'html-css',
    type: 'skillNode',
    position: { x: 80, y: 80 },
    data: {
      label: 'HTML & CSS',
      description: 'Семантика, адаптивность, современная вёрстка, доступность и работа с layout-системами.',
      color: '#172554',
      status: 'Core',
      subTasks: ['Semantic HTML', 'Flexbox & Grid', 'Responsive UI']
    }
  },
  {
    id: 'javascript-core',
    type: 'skillNode',
    position: { x: 420, y: 80 },
    data: {
      label: 'JavaScript Core',
      description: 'Функции, замыкания, массивы, объекты, асинхронность и DOM API.',
      color: '#1e293b',
      status: 'Core',
      subTasks: ['Closures', 'Async / Await', 'DOM events']
    }
  },
  {
    id: 'react',
    type: 'skillNode',
    position: { x: 760, y: 80 },
    data: {
      label: 'React',
      description: 'Компоненты, состояние, эффекты, роутинг и композиция UI на современном React.',
      color: '#0f766e',
      status: 'Build',
      subTasks: ['Hooks', 'State flow', 'Routing']
    }
  }
];

const INITIAL_EDGES = [
  {
    id: 'edge-html-js',
    source: 'html-css',
    target: 'javascript-core',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  },
  {
    id: 'edge-js-react',
    source: 'javascript-core',
    target: 'react',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed }
  }
];

const STORAGE_KEY = 'roadstar-roadmap-studio';

function RoadmapApp() {
  const [isDevMode, setIsDevMode] = useState(true);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [savedLayout, setSavedLayout] = useState(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [detailNodeId, setDetailNodeId] = useState(null);
  const [isAddConnectionMode, setIsAddConnectionMode] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!stored) return;
      if (stored.nodes?.length) {
        setNodes(stored.nodes);
        setSavedLayout(stored.nodes);
      }
      if (stored.edges?.length) {
        setEdges(stored.edges);
      }
      if (typeof stored.isDevMode === 'boolean') {
        setIsDevMode(stored.isDevMode);
      }
    } catch {
      // ignore malformed local state and fall back to defaults
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        nodes: savedLayout,
        edges,
        isDevMode
      })
    );
  }, [savedLayout, edges, isDevMode]);

  const openSettings = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setDetailNodeId(null);
  }, []);

  const openDetails = useCallback((nodeId) => {
    setDetailNodeId(nodeId);
    if (!isDevMode) {
      setSelectedNodeId(null);
    }
  }, [isDevMode]);

  const withNodeActions = useCallback((nodeList) => (
    nodeList.map((node) => ({
      ...node,
      draggable: true,
      data: {
        ...node.data,
        isDevMode,
        onOpenSettings: openSettings,
        onViewDetails: openDetails
      }
    }))
  ), [isDevMode, openDetails, openSettings]);

  const nodesWithActions = useMemo(() => withNodeActions(nodes), [nodes, withNodeActions]);

  const onNodesChange = useCallback((changes) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  }, []);

  const onConnect = useCallback((connection) => {
    if (!isDevMode || !isAddConnectionMode) return;
    setEdges((currentEdges) => addEdge({
      ...connection,
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed }
    }, currentEdges));
  }, [isAddConnectionMode, isDevMode]);

  const onNodeDragStop = useCallback((_, node) => {
    if (isDevMode) {
      setSavedLayout((currentSaved) => currentSaved.map((item) => (
        item.id === node.id ? { ...node, data: { ...item.data, ...node.data } } : item
      )));
      return;
    }

    setNodes(savedLayout);
  }, [isDevMode, savedLayout]);

  const addNewSkill = useCallback(() => {
    const nextNode = {
      id: `skill-${Date.now()}`,
      type: 'skillNode',
      position: { x: 180 + nodes.length * 40, y: 220 + nodes.length * 24 },
      data: {
        label: 'New Skill',
        description: 'Добавь описание навыка, примеры задач и ожидаемый результат.',
        color: '#312e81',
        status: 'Draft',
        subTasks: []
      }
    };
    setNodes((current) => [...current, nextNode]);
    setSavedLayout((current) => [...current, nextNode]);
    setSelectedNodeId(nextNode.id);
  }, [nodes.length]);

  const saveRoadmap = useCallback(() => {
    const formatted = {
      nodes: savedLayout,
      edges
    };
    console.log(JSON.stringify(formatted, null, 2));
  }, [edges, savedLayout]);

  const downloadConfiguration = useCallback(() => {
    const payload = JSON.stringify({ nodes: savedLayout, edges }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roadmap-configuration.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [edges, savedLayout]);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;
  const detailNode = nodes.find((node) => node.id === detailNodeId) || null;

  const updateSelectedNode = useCallback((patch) => {
    if (!selectedNodeId) return;
    setNodes((currentNodes) => currentNodes.map((node) => (
      node.id === selectedNodeId
        ? { ...node, data: { ...node.data, ...patch } }
        : node
    )));
    setSavedLayout((currentNodes) => currentNodes.map((node) => (
      node.id === selectedNodeId
        ? { ...node, data: { ...node.data, ...patch } }
        : node
    )));
  }, [selectedNodeId]);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#09090f] text-slate-100">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">Roadmap as a Service</p>
            <h1 className="mt-1 font-['Unbounded'] text-lg md:text-2xl">Roadstar Roadmap Studio</h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDevMode((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                isDevMode
                  ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-100'
                  : 'border-white/10 bg-white/5 text-slate-200'
              }`}
            >
              <MoonStar size={16} />
              {isDevMode ? 'Dev Mode' : 'User Mode'}
            </button>

            <button
              type="button"
              onClick={saveRoadmap}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              <Save size={16} />
              Save
            </button>

            <button
              type="button"
              onClick={downloadConfiguration}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              <Download size={16} />
              Download Configuration
            </button>
          </div>
        </header>

        <div className="relative flex-1">
          <ReactFlow
            nodes={nodesWithActions}
            edges={edges}
            nodeTypes={{ skillNode: SkillNode }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              if (isDevMode) {
                setSelectedNodeId(node.id);
              } else {
                openDetails(node.id);
              }
            }}
            onNodeDragStop={onNodeDragStop}
            onPaneClick={() => {
              if (isDevMode) setSelectedNodeId(null);
              setDetailNodeId(null);
            }}
            fitView
            panOnScroll
            selectionOnDrag
            nodesDraggable
            nodesConnectable={isDevMode && isAddConnectionMode}
            edgesFocusable={isDevMode}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed }
            }}
            className="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_28%),linear-gradient(180deg,#09090f_0%,#111827_100%)]"
          >
            <Background gap={20} size={1.2} color="#1f2937" />
            <Controls showInteractive={false} />

            {isDevMode ? (
              <Panel position="top-left">
                <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
                  <button
                    type="button"
                    onClick={addNewSkill}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    <Plus size={15} />
                    Add New Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddConnectionMode((value) => !value)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isAddConnectionMode
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 text-slate-100 hover:bg-white/10'
                    }`}
                  >
                    <Link2 size={15} />
                    Add Connection
                  </button>
                </div>
              </Panel>
            ) : (
              <Panel position="top-left">
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
                  Перетаскивать можно свободно, но позиции в User Mode не сохраняются.
                </div>
              </Panel>
            )}
          </ReactFlow>

          {selectedNode && isDevMode ? (
            <aside className="absolute right-4 top-4 z-20 w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-slate-950/90 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Sidebar</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">Node settings</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2 text-sm text-slate-200">
                  Label
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(event) => updateSelectedNode({ label: event.target.value })}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-200">
                  Color
                  <input
                    type="text"
                    value={selectedNode.data.color}
                    onChange={(event) => updateSelectedNode({ color: event.target.value })}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-200">
                  Description
                  <textarea
                    rows="6"
                    value={selectedNode.data.description}
                    onChange={(event) => updateSelectedNode({ description: event.target.value })}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  />
                </label>
              </div>
            </aside>
          ) : null}

          {detailNode ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-4 pb-4 md:items-start md:justify-end md:p-4">
              <div className="pointer-events-auto w-full max-w-[420px] rounded-3xl border border-white/10 bg-slate-950/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">View Details</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{detailNode.data.label}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailNodeId(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
                    aria-label="Close details"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <p className="text-sm leading-7 text-slate-300">{detailNode.data.description}</p>

                {detailNode.data.subTasks?.length ? (
                  <div className="mt-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">Sub tasks</p>
                    <div className="flex flex-wrap gap-2">
                      {detailNode.data.subTasks.map((subTask) => (
                        <span
                          key={subTask}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                        >
                          {subTask}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <RoadmapApp />
    </ReactFlowProvider>
  );
}
