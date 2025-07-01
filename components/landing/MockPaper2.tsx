const MockPaper2 = () => {
  return (
    <div className="bg-white dark:bg-gray-800/60 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700/50 h-full w-full text-left">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Synthetic Data Augmentation with GANs
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        J. Chen, et al.
      </p>

      <div>
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Methodology</h4>
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
          <div className="h-2 w-5/6 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Results</h4>
        <div className="w-full h-20 bg-gray-100 dark:bg-gray-700/30 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default MockPaper2; 