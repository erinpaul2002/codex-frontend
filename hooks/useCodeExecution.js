import { useState, useRef, useEffect } from 'react';
import { WebSocketManager } from '../utils/webSocketManager';
import { executeCode, isInteractiveLanguage } from '../utils/codeExecution';

export const useCodeExecution = (selectedLanguage, code) => {
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [pendingInput, setPendingInput] = useState([]);
  
  const wsManagerRef = useRef(null);

  useEffect(() => {
    if (!wsManagerRef.current) {
      wsManagerRef.current = new WebSocketManager();
    }

    const wsManager = wsManagerRef.current;

    wsManager.onConnected(() => {
      setWsConnected(true);
      wsManager.send({ 
        code, 
        input: '', 
        language: selectedLanguage.name.toLowerCase() 
      });
    });

    wsManager.onDisconnected((error) => {
      setIsRunning(false);
      setWsConnected(false);
      if (error) {
        setTerminalLines(lines => [...lines, { type: 'output', text: '[WebSocket error]' }]);
      }
    });

    wsManager.onMessage((event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'stdout') {
          setTerminalLines(lines => [...lines, { type: 'output', text: msg.data }]);
        } else if (msg.type === 'stderr') {
          setTerminalLines(lines => [...lines, { type: 'output', text: msg.data }]);
        } else if (msg.type === 'exit') {
          setTerminalLines(lines => [...lines, { type: 'output', text: `\n[Process exited with code ${msg.code}]` }]);
          setIsRunning(false);
          setWsConnected(false);
        } else if (msg.type === 'error') {
          setTerminalLines(lines => [...lines, { type: 'output', text: `[Error] ${msg.error}` }]);
          setIsRunning(false);
          setWsConnected(false);
        }
      } catch (e) {
        setTerminalLines(lines => [...lines, { type: 'output', text: `[Parse error] ${event.data}` }]);
      }
    });

    return () => {
      wsManager.disconnect();
    };
  }, [selectedLanguage.name, code]);

  const runCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTerminalLines([{ type: 'output', text: 'Running...' }]);
    setCurrentInput('');
    setPendingInput([]);

    if (isInteractiveLanguage(selectedLanguage.name)) {
      // Real-time execution via WebSocket
      wsManagerRef.current.connect('ws://localhost:8000/python-terminal');
    } else {
      // HTTP execution for non-interactive languages
      try {
        const output = await executeCode(code, selectedLanguage, terminalLines);
        setTerminalLines(lines => [...lines, { type: 'output', text: output }]);
      } catch (error) {
        setTerminalLines(lines => [...lines, { type: 'output', text: `Error: ${error.message}` }]);
      } finally {
        setIsRunning(false);
      }
    }
  };

  const sendInput = (input) => {
    setTerminalLines(lines => [...lines, { type: 'input', text: input }]);
    if (isInteractiveLanguage(selectedLanguage.name) && wsManagerRef.current && wsConnected) {
      wsManagerRef.current.send({ input });
    }
  };

  const clearTerminal = () => {
    setTerminalLines([]);
    setCurrentInput('');
  };

  return {
    isRunning,
    terminalLines,
    currentInput,
    setCurrentInput,
    wsConnected,
    pendingInput,
    setPendingInput,
    runCode,
    sendInput,
    clearTerminal
  };
};
