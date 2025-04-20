import React, { useEffect, useState } from 'react';
import { logger, LogEntry } from '../services/logger';

export const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = logger.subscribe((entry) => {
      setLogs(prevLogs => [...prevLogs, entry]);
    });

    return () => unsubscribe();
  }, []);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'debug': return 'text-gray-600';
      default: return 'text-gray-900';
    }
  };

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-2xl w-full bg-white rounded-lg shadow-lg">
      <div 
        className="p-4 border-b cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold">System Logs</h3>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-2 text-sm">
              <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={`ml-2 font-medium ${getLevelColor(log.level)}`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="ml-2">{log.message}</span>
              {log.data && (
                <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}