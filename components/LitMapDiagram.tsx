"use client";

import React, { useMemo } from 'react';
// User will need to install React Flow: npm install reactflow / pnpm add reactflow
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css'; // Default styles

// Assuming IdeaItem and SimilarPaper types are available or can be imported
// For now, defining simplified versions here for clarity
interface SimplifiedIdeaItem {
  Title: string;
  description?: string;
  // Add other relevant fields you want to display or use for node properties
}

interface SimplifiedSimilarPaper {
  title: string;
  abstract?: string;
  semantic_similarity?: number;
  source_url?: string;
  // Add other relevant fields
}

interface LitMapDiagramProps {
  currentIdea: SimplifiedIdeaItem;
  similarPapers: SimplifiedSimilarPaper[];
  className?: string;
}

const LitMapDiagram: React.FC<LitMapDiagramProps> = ({ currentIdea, similarPapers, className }) => {
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // 1. Create a node for the current idea
    initialNodes.push({
      id: 'current-idea',
      type: 'default', // You can create custom node types
      data: { label: `Proposed Idea: ${currentIdea.Title}` },
      position: { x: 250, y: 5 }, // Example position
      style: { backgroundColor: '#b3e5fc', borderColor: '#03a9f4', padding: '10px', borderRadius: '8px', width: 180 },
    });

    // 2. Create nodes for similar papers and edges connecting them to the current idea
    similarPapers.forEach((paper, index) => {
      const paperId = `paper-${index}`;
      initialNodes.push({
        id: paperId,
        type: 'default',
        data: { label: paper.title },
        position: { x: index * 200, y: 150 + (index % 2 === 0 ? 0 : 60) }, // Stagger positions
        style: { backgroundColor: '#e6ee9c', borderColor: '#cddc39', padding: '10px', borderRadius: '8px', width: 150, fontSize: '12px' },
      });

      // Create an edge from the current idea to this paper
      // Edge strength/label could be based on semantic_similarity
      const similarityScore = paper.semantic_similarity 
        ? (paper.semantic_similarity * 100).toFixed(0) + '%' 
        : '';
      
      initialEdges.push({
        id: `edge-current-to-${paperId}`,
        source: 'current-idea',
        target: paperId,
        label: similarityScore ? `Similarity: ${similarityScore}` : undefined,
        animated: !!similarityScore, // Animate edge if similarity exists
        style: { strokeWidth: paper.semantic_similarity ? Math.max(1, paper.semantic_similarity * 4) : 1 },
      });
    });
    
    // TODO: Add logic for inter-paper connections if desired (e.g., based on shared keywords or other metrics)

    return { nodes: initialNodes, edges: initialEdges };
  }, [currentIdea, similarPapers]);

  return (
    <div className={`w-full h-96 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg shadow-inner ${className || ''}`}>
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          // You can add onNodeClick, onEdgeClick, etc. for interactivity
          // onNodesChange={onNodesChange} - if you need to handle node position changes
          // onEdgesChange={onEdgesChange} - if you need to handle edge changes
        >
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No data available for literature map.</p>
        </div>
      )}
    </div>
  );
};

export default LitMapDiagram; 