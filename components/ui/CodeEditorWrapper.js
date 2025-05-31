'use client';

export default function CodeEditor({ 
  code, 
  onCodeChange, 
  selectedLanguage, 
  theme, 
  fontSize, 
  onRunCode,
  editorContainerRef 
}) {
  return (
    <div className="flex-1 flex flex-col" ref={editorContainerRef}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText size={16} />
          <span className="text-sm text-gray-300">
            main{selectedLanguage.extension}
          </span>
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
