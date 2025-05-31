'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileText, X, Brain } from 'lucide-react';

export default function CodeEditor({ 
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  code, 
  onCodeChange, 
  selectedLanguage, 
  theme, 
  fontSize, 
  onRunCode,
  editorContainerRef 
}) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      wordWrap: 'on',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });
  };  return (
    <div className="h-full flex flex-col" ref={editorContainerRef}>
      {/* Tab Bar */}
      <div className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer group min-w-0 flex-shrink-0 ${
                activeTabId === tab.id 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.type === 'suggestion' ? (
                <Brain size={14} className="text-purple-400 flex-shrink-0" />
              ) : (
                <FileText size={14} className="flex-shrink-0" />
              )}
              <span className="text-sm truncate max-w-32">{tab.name}</span>
              {tab.id !== 'main' && (
                <X 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={selectedLanguage.monaco}
          theme={theme}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            minimap: { enabled: true },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
