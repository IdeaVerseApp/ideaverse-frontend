"use client";

import React, { useMemo } from 'react';
// User will need to install React Flow: npm install reactflow / pnpm add reactflow
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, NodeProps, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css'; // Default styles
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Custom node component for hover functionality
const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              borderRadius: 8,
              backgroundColor: 'inherit',
              border: 'inherit',
              boxShadow: 'inherit',
              cursor: 'pointer',
              padding: '8px 12px',
              textAlign: 'center',
              fontSize: data.isMainIdea ? 14 : 12,
              fontWeight: data.isMainIdea ? 600 : 500,
              color: data.isMainIdea ? '#f9fafb' : '#1e293b',
              lineHeight: 1.2,
            }}
            title={data.title}
          >
            {data.title}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 text-white border-gray-700 max-w-xs break-words">
          <p className="font-bold">{data.title}</p>
          {data.similarity !== undefined && (
            <p className="text-sm text-gray-300 mt-1">
              Similarity: {(data.similarity * 100).toFixed(1)}%
            </p>
          )}
          {data.abstract && (
            <p className="text-xs text-gray-300 mt-2 line-clamp-3">
              {data.abstract}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Node types
const nodeTypes = {
  custom: CustomNode,
};

// Assuming IdeaItem and SimilarPaper types are available or can be imported
// For now, defining simplified versions here for clarity
interface SimplifiedIdeaItem {
  title?: string;
  Title?: string; // Legacy field for backward compatibility
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

    // Center position for the current idea
    const centerX = 400;
    const centerY = 300; // Increased vertical space

    // 1. Create a node for the current idea (centered) - distinct color and bigger rectangle
    const ideaTitle = currentIdea.title || currentIdea.Title || 'Untitled Idea';
    const mainWidth = 220;
    const mainHeight = 80;
    initialNodes.push({
      id: 'current-idea',
      type: 'custom',
      data: { 
        label: '',
        title: ideaTitle,
        isMainIdea: true
      },
      position: { x: centerX - mainWidth / 2, y: centerY - mainHeight / 2 },
      style: { 
        backgroundColor: '#8b5cf6', // Purple for main idea
        borderColor: '#7c3aed', 
        width: mainWidth,
        height: mainHeight,
        borderRadius: 10,
        border: '3px solid',
        color: '#f9fafb',
        fontWeight: 600,
        boxShadow: '0 8px 16px rgba(139, 92, 246, 0.4)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }
    });

    // 2. Sort papers by similarity (highest first) and create nodes positioned by similarity
    const sortedPapers = [...similarPapers].sort((a, b) => 
      (b.semantic_similarity || 0) - (a.semantic_similarity || 0)
    );

    // Calculate optimal layout to avoid overlaps
    const getOptimalLayout = (papers: SimplifiedSimilarPaper[]) => {
      // Divide papers into similarity tiers
      const highSimilarity = papers.filter(p => (p.semantic_similarity || 0) >= 0.7);
      const mediumSimilarity = papers.filter(p => (p.semantic_similarity || 0) >= 0.5 && (p.semantic_similarity || 0) < 0.7);
      const lowSimilarity = papers.filter(p => (p.semantic_similarity || 0) < 0.5);
      
      // Calculate positions for each tier
      const positions: {id: string, x: number, y: number, paper: SimplifiedSimilarPaper}[] = [];
      
      // High similarity - inner circle
      const innerRadius = 180;
      highSimilarity.forEach((paper, i) => {
        const angle = (i * (2 * Math.PI / highSimilarity.length)) + (Math.PI / 6);
        positions.push({
          id: `paper-high-${i}`,
          x: centerX + innerRadius * Math.cos(angle),
          y: centerY + innerRadius * Math.sin(angle),
          paper
        });
      });
      
      // Medium similarity - middle circle
      const middleRadius = 300;
      mediumSimilarity.forEach((paper, i) => {
        const angle = (i * (2 * Math.PI / mediumSimilarity.length)) + (Math.PI / 4);
        positions.push({
          id: `paper-med-${i}`,
          x: centerX + middleRadius * Math.cos(angle),
          y: centerY + middleRadius * Math.sin(angle),
          paper
        });
      });
      
      // Low similarity - outer circle
      const outerRadius = 420;
      lowSimilarity.forEach((paper, i) => {
        const angle = (i * (2 * Math.PI / lowSimilarity.length)) + (Math.PI / 3);
        positions.push({
          id: `paper-low-${i}`,
          x: centerX + outerRadius * Math.cos(angle),
          y: centerY + outerRadius * Math.sin(angle),
          paper
        });
      });
      
      return positions;
    };
    
    const paperPositions = getOptimalLayout(sortedPapers);
    
    // Create nodes and edges
    paperPositions.forEach((position) => {
      const paper = position.paper;
      const paperId = position.id;
      const similarity = paper.semantic_similarity || 0;
      
      // Calculate node dimensions - wider for longer titles
      const titleLength = paper.title.length;
      const width = Math.max(180, Math.min(300, 150 + titleLength * 3));
      const height = 60;
      
      // Node style based on similarity
      const getNodeStyle = (sim: number) => {
        // Color based on similarity tier
        let backgroundColor, borderColor;
        if (sim >= 0.7) {
          backgroundColor = '#d9f99d'; // Light green for high similarity
          borderColor = '#84cc16';
        } else if (sim >= 0.5) {
          backgroundColor = '#fef08a'; // Light yellow for medium similarity
          borderColor = '#eab308';
        } else {
          backgroundColor = '#fed7aa'; // Light orange for low similarity
          borderColor = '#f97316';
        }
        
        return {
          backgroundColor,
          borderColor,
          width,
          height,
          borderRadius: 8,
          border: '2px solid',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '8px 12px',
        };
      };
      
      const nodeStyle = getNodeStyle(similarity);
      
      initialNodes.push({
        id: paperId,
        type: 'custom',
        data: { 
          title: paper.title,
          similarity: similarity,
          abstract: paper.abstract
        },
        position: { 
          x: position.x - width/2, 
          y: position.y - height/2 
        },
        style: nodeStyle
      });

      // Create an edge from the current idea to this paper with visible similarity
      const similarityScore = similarity ? (similarity * 100).toFixed(1) + '%' : '';
      
      // Edge styling based on similarity
      const getEdgeStyle = (sim: number) => {
        let strokeColor;
        if (sim >= 0.7) {
          strokeColor = '#84cc16'; // Green for high similarity
        } else if (sim >= 0.5) {
          strokeColor = '#eab308'; // Yellow for medium similarity
        } else {
          strokeColor = '#f97316'; // Orange for low similarity
        }
        
        return {
          stroke: strokeColor,
          strokeWidth: Math.max(1.5, sim * 4)
        };
      };
      
      initialEdges.push({
        id: `edge-current-to-${paperId}`,
        source: 'current-idea',
        target: paperId,
        label: similarityScore,
        animated: similarity > 0.7,
        style: getEdgeStyle(similarity),
        labelStyle: { 
          fontSize: '13px', 
          fontWeight: 'bold',
          fill: '#f1f5f9',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: getEdgeStyle(similarity).stroke,
        },
        labelBgStyle: {
          fill: 'rgba(17,24,39,0.85)',
          stroke: '#374151',
          strokeWidth: 1,
        },
        labelBgPadding: [6, 4],
        labelBgBorderRadius: 4,
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [currentIdea, similarPapers]);

  return (
    <div className={`w-full h-[500px] bg-gray-900 border border-gray-700 rounded-lg shadow-inner ${className || ''}`}>
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          attributionPosition="bottom-right"
        >
          <MiniMap 
            nodeStrokeWidth={3} 
            zoomable 
            pannable 
            maskColor="rgba(0, 0, 0, 0.4)"
            nodeColor={(node) => {
              if (node.id === 'current-idea') return '#8b5cf6';
              const similarity = node.data?.similarity || 0;
              if (similarity >= 0.7) return '#84cc16';
              if (similarity >= 0.5) return '#eab308';
              return '#f97316';
            }}
          />
          <Controls />
          <Background color="#334155" gap={16} />
        </ReactFlow>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No data available for literature map.</p>
        </div>
      )}
    </div>
  );
};

export default LitMapDiagram; 