'use client';

import { HelpCircle, Settings, Play, Square } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../../constants/languages';

export default function Header({ 
  selectedLanguage, 
  onLanguageChange, 
  onStartTutorial, 
  showSettings, 
  onToggleSettings, 
  isRunning, 
  onRunCode,
  refs 
}) {
  const { langRef, settingsRef, runBtnRef } = refs;

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-400">CodeIDE</h1>
        <div className="flex items-center space-x-2">
          <select
            ref={langRef}
            value={selectedLanguage.name}
            onChange={(e) => {
              const lang = LANGUAGE_OPTIONS.find(l => l.name === e.target.value);
              onLanguageChange(lang);
            }}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.name}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onStartTutorial}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
          title="Show Tutorial"
        >
          <HelpCircle size={16} />
          <span className="text-sm hidden sm:inline">Tutorial</span>
        </button>
        
        <button
          ref={settingsRef}
          onClick={onToggleSettings}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title="Settings"
        >
          <Settings size={16} />
        </button>
          <button
          ref={runBtnRef}
          onClick={onRunCode}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition-colors"
          title="Run Code (Ctrl+Enter)"
        >
          {isRunning ? <Square size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </button>
      </div>
    </div>
  );
}
