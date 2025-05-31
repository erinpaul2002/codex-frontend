import { useState, useRef, useEffect } from 'react';

export const useTerminal = (isRunning, currentInput, setCurrentInput, sendInput, terminalDivRef) => {
  const terminalEndRef = useRef();

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);  useEffect(() => {
    if (isRunning && terminalDivRef && terminalDivRef.current) {
      // Add a small delay to ensure the element is ready and any UI updates are complete
      const timeoutId = setTimeout(() => {
        if (terminalDivRef.current) {
          terminalDivRef.current.focus();
          // Ensure the element is scrolled into view
          terminalDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isRunning, terminalDivRef]);

  const handleTerminalKeyDown = (e) => {
    if (!isRunning) return;

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setCurrentInput(inp => inp + e.key);
      e.preventDefault();
    } else if (e.key === 'Backspace') {
      setCurrentInput(inp => inp.slice(0, -1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (currentInput.trim()) {
        sendInput(currentInput);
        setCurrentInput('');
      }
      e.preventDefault();
    } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      // Prevent cursor movement
      e.preventDefault();
    }
  };
  const handleTerminalClick = () => {
    if (terminalDivRef && terminalDivRef.current) {
      terminalDivRef.current.focus();
    }
  };

  return {
    terminalEndRef,
    handleTerminalKeyDown,
    handleTerminalClick
  };
};
