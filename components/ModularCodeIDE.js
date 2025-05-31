'use client';

import { useState, useRef } from 'react';
import { LANGUAGE_OPTIONS, DEFAULT_CODE } from '../constants/languages';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useTutorial } from '../hooks/useTutorial';
import { useTerminal } from '../hooks/useTerminal';
import { getChatResponse } from '../utils/codeExecution';
import Header from './ui/Header';
import SettingsPanel from './ui/SettingsPanel';
import CodeEditor from './ui/CodeEditor';
import Terminal from './ui/Terminal';
import TutorialOverlay from './ui/TutorialOverlay';
import AIChat from './ui/AIChat';

export default function ModularCodeIDE() {
  // Core state
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  
  // Tab management state
  const [tabs, setTabs] = useState([
    {
      id: 'main',
      name: `main${LANGUAGE_OPTIONS[0].extension}`,
      code: DEFAULT_CODE.python,
      type: 'main'
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('main');
  // Refs for tutorial highlighting
  const langRef = useRef();
  const editorContainerRef = useRef();
  const runBtnRef = useRef();
  const settingsRef = useRef();
  const terminalDivRef = useRef();
  const aiChatRef = useRef();
  const lightbulbRef = useRef();
  const chatInputRef = useRef();

  const refs = {
    langRef,
    editorContainerRef,
    runBtnRef,
    settingsRef,
    terminalDivRef,
    aiChatRef,
    lightbulbRef,
    chatInputRef
  };// Custom hooks
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const codeExecution = useCodeExecution(selectedLanguage, activeTab?.code || '');
  const tutorial = useTutorial(refs);
  const terminalHandlers = useTerminal(
    codeExecution.isRunning,
    codeExecution.currentInput,
    codeExecution.setCurrentInput,
    codeExecution.sendInput,
    terminalDivRef
  );

  // Helper functions
  const updateActiveTabCode = (newCode) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, code: newCode }
          : tab
      )
    );
  };

  const createNewTab = (name, code, type = 'suggestion') => {
    const newTab = {
      id: `${type}-${Date.now()}`,
      name,
      code,
      type
    };
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
    return newTab.id;
  };

  const closeTab = (tabId) => {
    if (tabId === 'main') return; // Don't allow closing main tab
    
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId) {
        setActiveTabId(newTabs[0]?.id || 'main');
      }
      return newTabs;
    });
  };
  // Event handlers
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // Update the main tab with new language
    const newCode = DEFAULT_CODE[language.monaco] || '// Start coding here...';
    const newName = `main${language.extension}`;
    
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === 'main' 
          ? { ...tab, code: newCode, name: newName }
          : tab
      )
    );
    codeExecution.clearTerminal();
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };
  const handleSuggestCode = async () => {
    const currentCode = activeTab?.code || '';
    const languageName = selectedLanguage.name;
    
    if (!currentCode.trim()) {
      return "No code found in the current editor. Please write some code first and I'll analyze it for you!";
    }
    
    // Create a comprehensive prompt for code analysis
    const analysisPrompt = `Please analyze the following ${languageName} code and provide suggestions for improvements, potential bugs, optimizations, and best practices:

\`\`\`${languageName.toLowerCase()}
${currentCode}
\`\`\`

Please provide:
1. Code quality assessment
2. Potential bugs or issues
3. Performance optimizations
4. Best practice recommendations
5. Suggestions for improvement
6. Code readability enhancements

Format your response with clear sections and use code blocks for any code suggestions.`;
    
    try {
      const suggestion = await getChatResponse(analysisPrompt);
      return suggestion;
    } catch (error) {
      console.error('Error analyzing code:', error);
      return "Sorry, I encountered an error while analyzing your code. Please try again.";
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onStartTutorial={tutorial.startTutorial}
        showSettings={showSettings}
        onToggleSettings={handleToggleSettings}
        isRunning={codeExecution.isRunning}
        onRunCode={codeExecution.runCode}
        refs={refs}
      />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel 
          theme={theme}
          onThemeChange={setTheme}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      )}      {/* Main Content - VS Code Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left Side: Editor and Terminal */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor 
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={setActiveTabId}
              onTabClose={closeTab}
              code={activeTab?.code || ''}
              onCodeChange={updateActiveTabCode}
              selectedLanguage={selectedLanguage}
              theme={theme}
              fontSize={fontSize}
              onRunCode={codeExecution.runCode}
              editorContainerRef={editorContainerRef}
            />
          </div>
          
          {/* Terminal Panel - Below Editor */}
          <div className="h-64 border-t border-gray-700 flex-shrink-0">
            <Terminal 
              terminalLines={codeExecution.terminalLines}
              currentInput={codeExecution.currentInput}
              isRunning={codeExecution.isRunning}
              onClearTerminal={codeExecution.clearTerminal}
              terminalHandlers={terminalHandlers}
              terminalDivRef={terminalDivRef}
            />
          </div>
        </div>        {/* Right Sidebar: AI Chat */}
        <div className="w-80 flex-shrink-0" ref={aiChatRef}>
          <AIChat 
            onSuggestCode={handleSuggestCode}
            theme={theme === 'vs-dark' ? 'dark' : 'light'}
            lightbulbRef={lightbulbRef}
            chatInputRef={chatInputRef}
          />
        </div>
      </div>

      {/* Tutorial Overlay */}
      {tutorial.showTutorial && (
        <TutorialOverlay
          steps={tutorial.tutorialSteps}
          currentStep={tutorial.tutorialStep}
          onNext={tutorial.handleNextTutorial}
          onSkip={tutorial.handleSkipTutorial}
          highlightRef={tutorial.tutorialSteps[tutorial.tutorialStep]?.highlightRef || null}
        />
      )}

      {/* Styles */}
      <style>{`
        .blinking-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background-color: #2563eb;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
