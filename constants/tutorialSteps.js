export const createTutorialSteps = (refs) => [
  {
    title: 'Welcome to CodeIDE!',
    description: 'This is your online code editor with AI-powered assistance. Let\'s take a quick tour of the main features.',
  },
  {
    title: 'Select Language',
    description: 'Choose your programming language from this dropdown. Supported: Python, C, C++, Java.',
    highlightRef: refs.langRef,
    placement: 'bottom',
  },
  {
    title: 'Code Editor',
    description: 'Write your code here. The editor supports syntax highlighting, autocompletion, and more.',
    highlightRef: refs.editorContainerRef,
    placement: 'right',
  },
  {
    title: 'Run Button',
    description: 'Click here or press Ctrl+Enter to run your code. The output will appear in the terminal below.',
    highlightRef: refs.runBtnRef,
    placement: 'bottom',
  },
  {
    title: 'Terminal',
    description: 'View output and interact with your program in this terminal area. For interactive programs, type your input and press Enter.',
    highlightRef: refs.terminalDivRef,
    placement: 'bottom',
  },
  {
    title: 'AI Assistant',
    description: 'Your AI coding assistant is here to help! Ask questions, get explanations, debug code, and get programming assistance.',
    highlightRef: refs.aiChatRef,
    placement: 'left',
  },
  {
    title: 'Code Analysis',
    description: 'Click this lightbulb to analyze your current code. The AI will provide suggestions for improvements, identify potential bugs, and recommend best practices.',
    highlightRef: refs.lightbulbRef,
    placement: 'left',
  },  {
    title: 'Chat with AI',
    description: 'Type any programming question or ask for help with your code. The AI can explain concepts, help debug issues, suggest improvements, and provide coding guidance.',
    highlightRef: refs.chatInputRef,
    placement: 'left',
  },
  {
    title: 'Settings',
    description: 'Adjust the editor theme and font size from the settings panel.',
    highlightRef: refs.settingsRef,
    placement: 'bottom',
  },
  {
    title: 'End of Tutorial',
    description: 'You are ready to use CodeIDE with AI assistance! You can restart this tutorial anytime by clicking the Tutorial button. Happy coding!',
  },
];
