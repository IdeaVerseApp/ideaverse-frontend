const MockPaper3 = () => {
  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700/50 h-full w-full text-left">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        A Framework for Ethical AI Development
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800/50 animate-pulse"></div>
          <div className="h-2 w-4/5 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800/50 animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="h-2 w-3/5 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800/50 animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="h-2 w-4/5 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <div className="w-1/3 h-12 bg-gray-100 dark:bg-gray-700/30 rounded-md animate-pulse"></div>
        <div className="w-1/3 h-12 bg-gray-100 dark:bg-gray-700/30 rounded-md animate-pulse" style={{animationDelay: '0.1s'}}></div>
      </div>
    </div>
  );
};

export default MockPaper3; 