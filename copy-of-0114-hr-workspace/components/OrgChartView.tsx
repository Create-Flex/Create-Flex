import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  Connection, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import { Search, UserPlus, Trash2, X, Save, User, Briefcase, Network } from 'lucide-react';

// --- Custom Node Component ---
const CustomNode = ({ data, selected }: { data: any, selected: boolean }) => {
  return (
    <div className={`px-4 py-3 bg-white rounded-lg border-2 transition-all w-[220px] ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm'}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${data.color || 'bg-gray-400'}`}>
          {data.emoji || data.label.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-sm text-gray-800">{data.label}</div>
          <div className="text-[10px] text-gray-500 font-medium">{data.role}</div>
          <div className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full inline-block mt-1">
             {data.dept}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// --- Initial Data ---
const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 400, y: 0 }, data: { label: '이채연', role: 'CEO', dept: 'Executive', color: 'bg-black', emoji: '👑' } },
  { id: '2', type: 'custom', position: { x: 200, y: 150 }, data: { label: '김철수', role: 'CTO', dept: 'Engineering', color: 'bg-blue-600' } },
  { id: '3', type: 'custom', position: { x: 600, y: 150 }, data: { label: '박영희', role: 'CPO', dept: 'Product', color: 'bg-green-600' } },
  { id: '4', type: 'custom', position: { x: 100, y: 300 }, data: { label: '최지훈', role: 'Frontend Lead', dept: 'Engineering', color: 'bg-blue-500' } },
  { id: '5', type: 'custom', position: { x: 300, y: 300 }, data: { label: '정수민', role: 'Backend Lead', dept: 'Engineering', color: 'bg-blue-500' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-5', source: '2', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

// --- Main Inner Component ---
const OrgChartInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, [setEdges]);

  // Add New Node
  const handleAddNode = () => {
    const id = Date.now().toString();
    const newNode: Node = {
      id,
      type: 'custom',
      position: { x: 400, y: 300 }, // Center-ish
      data: { 
        label: '신규 직원', 
        role: 'Position', 
        dept: 'Team', 
        color: 'bg-gray-400' 
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
    
    // Pan to new node
    reactFlowInstance.setCenter(400, 300, { zoom: 1, duration: 800 });
  };

  // Node Selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update Node Data
  const handleUpdateNode = (field: string, value: string) => {
    if (!selectedNode) return;
    
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === selectedNode.id) {
            const updatedNode = { 
                ...node, 
                data: { ...node.data, [field]: value } 
            };
            setSelectedNode(updatedNode); // Update local state for immediate reflect in sidebar
            return updatedNode;
        }
        return node;
      })
    );
  };

  // Delete Node
  const handleDeleteNode = () => {
    if (!selectedNode) return;
    if (window.confirm(`${selectedNode.data.label} 직원을 조직도에서 삭제하시겠습니까?`)) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
    }
  };

  // Search Function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const foundNode = nodes.find(n => 
        n.data.label.includes(searchQuery) || n.data.role.includes(searchQuery)
    );

    if (foundNode) {
        reactFlowInstance.setCenter(foundNode.position.x, foundNode.position.y, { zoom: 1.5, duration: 800 });
        setSelectedNode(foundNode);
    } else {
        alert('검색 결과가 없습니다.');
    }
  };

  return (
    <div className="flex-1 h-full relative flex flex-col">
       {/* Toolbar */}
       <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-white p-2 rounded-lg shadow-md border border-gray-200 flex gap-2">
             <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded px-2">
                <Search size={16} className="text-gray-400" />
                <input 
                    className="bg-transparent border-none focus:outline-none text-sm px-2 py-1.5 w-48"
                    placeholder="이름 또는 직책 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </form>
          </div>
          <div className="pointer-events-auto">
             <button 
                onClick={handleAddNode}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium text-sm"
             >
                <UserPlus size={16} /> 직원 추가
             </button>
          </div>
       </div>

       {/* React Flow Canvas */}
       <div className="flex-1 bg-[#F7F9FB]">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
        >
            <Background color="#ccc" gap={20} size={1} />
            <Controls />
        </ReactFlow>
       </div>

       {/* Right Sidebar (Inspector) */}
       {selectedNode && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl p-6 z-20 animate-[slideIn_0.2s_ease-out]">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                   <Network size={18} /> 직원 정보 수정
                </h2>
                <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600">
                   <X size={20} />
                </button>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">이름</label>
                   <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
                      <User size={16} className="text-gray-400" />
                      <input 
                         value={selectedNode.data.label}
                         onChange={(e) => handleUpdateNode('label', e.target.value)}
                         className="bg-transparent w-full text-sm outline-none"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">직책 (Role)</label>
                   <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
                      <Briefcase size={16} className="text-gray-400" />
                      <input 
                         value={selectedNode.data.role}
                         onChange={(e) => handleUpdateNode('role', e.target.value)}
                         className="bg-transparent w-full text-sm outline-none"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">부서 (Dept)</label>
                   <input 
                        value={selectedNode.data.dept}
                        onChange={(e) => handleUpdateNode('dept', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors"
                   />
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">색상 테마</label>
                   <div className="flex flex-wrap gap-2 mt-2">
                      {['bg-black', 'bg-blue-600', 'bg-green-600', 'bg-red-500', 'bg-purple-600', 'bg-orange-500'].map(color => (
                         <button 
                            key={color}
                            onClick={() => handleUpdateNode('color', color)}
                            className={`w-6 h-6 rounded-full ${color} ${selectedNode.data.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                         />
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                   onClick={handleDeleteNode}
                   className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                   <Trash2 size={16} />
                   퇴사 처리 (직원 삭제)
                </button>
             </div>
             
             <div className="mt-4 text-[11px] text-gray-400 leading-relaxed bg-gray-50 p-3 rounded">
                💡 <strong>Tip:</strong> 노드의 상단/하단 점(Handle)을 드래그하여 다른 직원과 연결할 수 있습니다.
             </div>
          </div>
       )}
    </div>
  );
};

// --- Wrapper for Provider ---
export const OrgChartView = () => {
    return (
        <ReactFlowProvider>
            <div className="h-screen w-full flex flex-col">
                <OrgChartInner />
            </div>
        </ReactFlowProvider>
    );
};