'use client';

export default function Terminal({ 
  terminalLines, 
  currentInput, 
  isRunning, 
  onClearTerminal, 
  terminalHandlers,
  terminalDivRef 
}) {
  const { handleTerminalKeyDown, handleTerminalClick } = terminalHandlers;
  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <span className="text-sm text-gray-300">Terminal</span>
        <button
          onClick={onClearTerminal}
          className="text-xs text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded"
        >
          Clear
        </button>
      </div>
      
      <div
        className="flex-1 bg-gray-900 p-3 overflow-auto outline-none"
        style={{ fontFamily: 'var(--font-geist-mono)', cursor: 'text' }}
        tabIndex={0}
        ref={terminalDivRef}
        onClick={handleTerminalClick}
        onKeyDown={handleTerminalKeyDown}
      >
        {terminalLines.map((line, idx) => (
          <div key={idx} className={line.type === 'input' ? 'text-blue-300' : 'text-gray-100'}>
            {line.type === 'input' ? (
              <span>&gt; {line.text}</span>
            ) : (
              <pre className="whitespace-pre-wrap" style={{ margin: 0 }}>{line.text}</pre>
            )}
          </div>
        ))}
        
        {/* Inline input prompt for REPL UX for all languages */}
        {isRunning && (
          <div className="text-blue-300" style={{ display: 'flex', alignItems: 'center' }}>
            <span>&gt; </span>
            <span style={{ whiteSpace: 'pre', minWidth: '1ch' }}>{currentInput}</span>
            <span className="blinking-cursor">&#9608;</span>
          </div>
        )}
        
        <div style={{ height: 1 }} />
      </div>
    </div>
  );
}
