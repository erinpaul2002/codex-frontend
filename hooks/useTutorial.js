import { useState } from 'react';
import { createTutorialSteps } from '../constants/tutorialSteps';

export const useTutorial = (refs) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(null);

  const tutorialSteps = createTutorialSteps(refs);

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

  return {
    showTutorial,
    tutorialStep,
    tutorialSteps,
    startTutorial,
    handleNextTutorial,
    handleSkipTutorial
  };
};
