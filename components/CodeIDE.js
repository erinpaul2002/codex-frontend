'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Square, Settings, FileText, Terminal, Keyboard, HelpCircle, ArrowRight, X } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  { id: 71, name: 'Python', monaco: 'python', extension: '.py' },
  { id: 50, name: 'C', monaco: 'c', extension: '.c' },
  { id: 54, name: 'C++', monaco: 'cpp', extension: '.cpp' },
  { id: 62, name: 'Java', monaco: 'java', extension: '.java' }
];

const DEFAULT_CODE = {
  python: `# Welcome to CodeIDE
print("Hello, World!")

# Try some basic operations
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Math operations
a = 10
b = 20
print(f"Sum: {a + b}")
`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    char name[100];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\\n", name);
    
    int a = 10, b = 20;
    printf("Sum: %d\\n", a + b);
    
    return 0;
}
`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    
    int a = 10, b = 20;
    cout << "Sum: " << a + b << endl;
    
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        
        int a = 10, b = 20;
        System.out.println("Sum: " + (a + b));
        
        scanner.close();
    }
}
`
};

function TutorialOverlay({ steps, currentStep, onNext, onSkip, highlightRef }) {
  const [highlightRect, setHighlightRect] = useState(null);
  useEffect(() => {
    if (highlightRef && highlightRef.current) {
      const rect = highlightRef.current.getBoundingClientRect();
      setHighlightRect(rect);
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add click handler to highlighted element
      const el = highlightRef.current;
      const handleClick = (e) => {
        e.stopPropagation();
        onNext();
      };
      el.classList.add('tutorial-highlight-cursor');
      el.addEventListener('click', handleClick, { once: true });
      return () => {
        el.classList.remove('tutorial-highlight-cursor');
        el.removeEventListener('click', handleClick);
      };
    } else {
      setHighlightRect(null);
    }
  }, [currentStep, highlightRef, onNext]);

  if (currentStep === null) return null;
  const { title, description, placement, highlightRef: stepHighlightRef } = steps[currentStep];

  // Position the tutorial card near the highlighted element
  let cardStyle = { zIndex: 1001 };
  let arrowStyle = {};
  let arrowDir = 'down';
  const CARD_MAX_WIDTH = 340;
  const CARD_HEIGHT = 180; // estimate for clamping
  if (highlightRect) {
    // Calculate initial position
    let left = placement === 'right' ? highlightRect.right + 24 : highlightRect.left;
    let top = highlightRect.top;
    if (placement === 'bottom') {
      top = highlightRect.bottom + 16;
      left = highlightRect.left;
      arrowStyle = { left: 24, top: -16 };
      arrowDir = 'up';
    }
    if (placement === 'top') {
      top = highlightRect.top - 120;
      left = highlightRect.left;
      arrowStyle = { left: 24, top: 104 };
      arrowDir = 'down';
    }
    if (placement === 'right') {
      left = highlightRect.right + 24;
      top = highlightRect.top;
      arrowStyle = { left: -16, top: 24 };
      arrowDir = 'left';
    }
    if (placement === 'left') {
      left = highlightRect.left - CARD_MAX_WIDTH - 20;
      top = highlightRect.top;
      arrowStyle = { left: CARD_MAX_WIDTH, top: 24 };
      arrowDir = 'right';
    }
    // Clamp to viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    left = Math.max(8, Math.min(left, viewportWidth - CARD_MAX_WIDTH - 8));
    top = Math.max(8, Math.min(top, viewportHeight - CARD_HEIGHT - 8));
    cardStyle = {
      ...cardStyle,
      position: 'fixed',
      left,
      top,
      maxWidth: CARD_MAX_WIDTH,
      transition: 'all 0.3s',
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
      overflowWrap: 'break-word',
    };
  } else {
    cardStyle = { ...cardStyle, position: 'fixed', left: '50%', top: '20%', transform: 'translate(-50%, 0)', maxWidth: CARD_MAX_WIDTH, wordBreak: 'break-word', whiteSpace: 'pre-line', overflowWrap: 'break-word' };
  }

  return (
    <>
      {/* Highlighted border with pulse and bounce */}
      {highlightRect && (
        <div
          className="fixed z-50 border-4 border-blue-500 rounded-lg pointer-events-none animate-pulse animate-bounce"
          style={{
            left: highlightRect.left - 6,
            top: highlightRect.top - 6,
            width: highlightRect.width + 12,
            height: highlightRect.height + 12,
            boxSizing: 'border-box',
            transition: 'all 0.3s',
            boxShadow: '0 0 0 8px rgba(30,64,175,0.15)',
          }}
        />
      )}
      {/* Tutorial card with arrow, Next button only if no highlightRef */}
      <div
        className="z-50 bg-blue-900 border border-blue-500 rounded-lg shadow-lg p-6 absolute animate-fade-in"
        style={{
          ...cardStyle,
          maxWidth: 340,
          wordBreak: 'break-word',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-blue-200">{title}</h2>
          <button onClick={onSkip} className="text-gray-300 hover:text-white ml-2"><X size={18} /></button>
        </div>
        <p className="text-gray-100 mb-2" style={{wordBreak: 'break-word', whiteSpace: 'pre-line', overflowWrap: 'break-word'}}>{description}</p>
        <div className="flex justify-end">
          {!stepHighlightRef && currentStep !== steps.length - 1 && (
            <button
              onClick={onNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {stepHighlightRef && (
            <span className="text-xs text-blue-300 mr-2">Click the highlighted area to continue</span>
          )}
          {currentStep === steps.length - 1 && (
            <button
              onClick={onNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Finish
            </button>
          )}
        </div>
      </div>
      <style>{`.tutorial-highlight-cursor { cursor: pointer !important; box-shadow: 0 0 0 4px #1e40af55 !important; }`}</style>
    </>
  );
}

export default function CodeIDE() {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(null);

  const editorRef = useRef(null);
  const langRef = useRef();
  const editorContainerRef = useRef();
  const runBtnRef = useRef();
  const tabsRef = useRef();
  const settingsRef = useRef();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      wordWrap: 'on',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language.monaco] || '// Start coding here...');
    setOutput('');
    setInput('');
  };

  const runCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Running...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: selectedLanguage.id,
          stdin: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      let outputText = '';
      if (result.stdout) {
        outputText += result.stdout;
      }
      if (result.stderr) {
        outputText += result.stderr;
      }
      if (result.compile_output) {
        outputText += `Compilation Output:\\n${result.compile_output}`;
      }
      if (!outputText && result.status && result.status.description) {
        outputText = `Status: ${result.status.description}`;
      }
      
      setOutput(outputText || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}\\n\\nMake sure the backend server is running on http://localhost:8000`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  const clearInput = () => {
    setInput('');
  };

  // Tutorial steps definition
  const tutorialSteps = [
    {
      title: 'Welcome to CodeIDE!',
      description: 'This is your online code editor. Let\'s take a quick tour of the main features.',
    },
    {
      title: 'Select Language',
      description: 'Choose your programming language from this dropdown.',
      highlightRef: langRef,
      placement: 'bottom',
    },
    {
      title: 'Code Editor',
      description: 'Write your code here. The editor supports syntax highlighting and more.',
      highlightRef: editorContainerRef,
      placement: 'right',
    },
    {
      title: 'Run Button',
      description: 'Click here or press Ctrl+Enter to run your code.',
      highlightRef: runBtnRef,
      placement: 'bottom',
    },
    {
      title: 'Input/Output Tabs',
      description: 'Switch between input and output for your program using these tabs.',
      highlightRef: tabsRef,
      placement: 'bottom',
    },
    {
      title: 'Settings',
      description: 'Adjust theme and font size from the settings panel.',
      highlightRef: settingsRef,
      placement: 'bottom',
    },
    {
      title: 'End of Tutorial',
      description: 'You are ready to use CodeIDE! You can restart this tutorial anytime.',
    },
  ];

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };
  const handleNextTutorial = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(null);
    }
  };
  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(null);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-blue-400">CodeIDE</h1>
          <div className="flex items-center space-x-2">
            <select
              ref={langRef}
              value={selectedLanguage.name}
              onChange={(e) => {
                const lang = LANGUAGE_OPTIONS.find(l => l.name === e.target.value);
                handleLanguageChange(lang);
              }}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.id} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={startTutorial}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
            title="Show Tutorial"
          >
            <HelpCircle size={16} />
            <span className="text-sm hidden sm:inline">Tutorial</span>
          </button>
          <button
            ref={settingsRef}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            ref={runBtnRef}
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition-colors"
            title="Run Code (Ctrl+Enter)"
          >
            {isRunning ? <Square size={16} /> : <Play size={16} />}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Font Size:</label>
              <input
                type="number"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-16"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
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
              onChange={(value) => setCode(value || '')}
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

        {/* Right Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700" ref={tabsRef}>
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm transition-colors ${
                activeTab === 'input'
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              <Keyboard size={16} />
              <span>Input</span>
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm transition-colors ${
                activeTab === 'output'
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-750'
              }`}
            >
              <Terminal size={16} />
              <span>Output</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'input' ? (
              <>
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-300">Program Input</span>
                  <button
                    onClick={clearInput}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your program here..."
                  className="flex-1 bg-gray-900 text-white p-3 font-mono text-sm resize-none border-none outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                />
              </>
            ) : (
              <>
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-300">Program Output</span>
                  <button
                    onClick={clearOutput}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex-1 bg-gray-900 p-3 overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-100">
                    {output || 'Run your code to see output here...'}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Language: {selectedLanguage.name}</span>
          <span>Theme: {theme}</span>
          <span>Font: {fontSize}px</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Press Ctrl+Enter to run</span>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-600'}`}></span>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay
          steps={tutorialSteps}
          currentStep={tutorialStep}
          onNext={handleNextTutorial}
          onSkip={handleSkipTutorial}
          highlightRef={tutorialSteps[tutorialStep]?.highlightRef}
        />
      )}
    </div>
  );
}
