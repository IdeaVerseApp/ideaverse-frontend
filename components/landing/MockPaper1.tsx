import { BarChart, BrainCircuit, Dna } from 'lucide-react';

const MockPaper1 = () => {
  return (
    <div className="bg-white dark:bg-gray-800/80 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700/50 h-full w-full text-left">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
        Quantum Entanglement in Neural Network Architectures
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Dr. Evelyn Reed, Dr. Kenji Tanaka
      </p>

      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">Abstract</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          This paper explores a novel paradigm integrating principles of quantum entanglement to create highly interconnected neural network layers. Our Q-Net architecture demonstrates a 150% improvement in learning efficiency for complex pattern recognition tasks...
        </p>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3">
          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Performance Benchmark</h4>
          <div className="flex items-end gap-2 h-24">
            <div className="w-1/3 bg-blue-200 dark:bg-blue-800/50 rounded-t-sm h-1/2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1/3 bg-blue-300 dark:bg-blue-700/50 rounded-t-sm h-2/3 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1/3 bg-blue-400 dark:bg-blue-600/50 rounded-t-sm h-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
        <div className="w-1/3">
          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Keywords</h4>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">Quantum AI</span>
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">Neural Nets</span>
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">Entanglement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPaper1; 