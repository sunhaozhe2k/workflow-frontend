import { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { saveWorkflow, startExecution } from '../api.js';
import socket from '../socket.js';

const statusColors = {
  waiting: '#e5e7eb',
  running: '#fde68a',
  done: '#bbf7d0',
  failed: '#fecaca',
};

const initialNodes = [
  {
    id: 'fetch',
    position: { x: 0, y: 0 },
    data: { label: 'Fetch Data', status: 'waiting' },
  },
  {
    id: 'process',
    position: { x: 200, y: 120 },
    data: { label: 'Process Data', status: 'waiting' },
  },
  {
    id: 'store',
    position: { x: 400, y: 0 },
    data: { label: 'Store Results', status: 'waiting' },
  },
];

const initialEdges = [
  { id: 'fetch-process', source: 'fetch', target: 'process', animated: true },
  { id: 'process-store', source: 'process', target: 'store' },
];

function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const styledNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        style: {
          border: '1px solid #94a3b8',
          borderRadius: 12,
          padding: 12,
          background: statusColors[node.data.status] ?? statusColors.waiting,
        },
        data: {
          ...node.data,
          label: `${node.data.label}\n(${node.data.status.toUpperCase()})`,
        },
      })),
    [nodes]
  );

  useEffect(() => {
    function handleTaskUpdate(update) {
      setNodes((current) =>
        current.map((node) =>
          node.id === update.id
            ? {
                ...node,
                data: { ...node.data, status: update.status },
              }
            : node
        )
      );
      setStatusMessage(`Task "${update.id}" → ${update.status}`);
    }

    socket.on('task_update', handleTaskUpdate);

    return () => {
      socket.off('task_update', handleTaskUpdate);
    };
  }, [setNodes]);

  const onConnect = (connection) => setEdges((eds) => addEdge(connection, eds));

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('Saving workflow...');
    try {
      await saveWorkflow({ nodes, edges });
      setStatusMessage('Workflow saved successfully.');
    } catch (error) {
      setStatusMessage(`Failed to save workflow: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    setStatusMessage('Starting workflow execution...');
    try {
      await startExecution();
      setStatusMessage('Workflow execution started. Await updates...');
    } catch (error) {
      setStatusMessage(`Failed to start workflow: ${error.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="workflow-wrapper">
      <div className="workflow-toolbar">
        <button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Workflow'}
        </button>
        <button type="button" onClick={handleStart} disabled={isStarting}>
          {isStarting ? 'Starting...' : 'Start Execution'}
        </button>
        <span className="status-message">{statusMessage}</span>
      </div>

      <div className="workflow-canvas">
        <ReactFlow
          nodes={styledNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background gap={16} color="#94a3b8" variant="dots" />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default WorkflowEditor;
