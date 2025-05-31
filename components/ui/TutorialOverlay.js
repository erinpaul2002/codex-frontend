'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TutorialOverlay({ steps, currentStep, onNext, onSkip, highlightRef }) {
  const [highlightRect, setHighlightRect] = useState(null);
  
  const step = steps[currentStep];

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

  const { title, description, placement } = step;

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
    cardStyle = {
      ...cardStyle,
      position: 'fixed',
      left: '50%',
      top: '20%',
      transform: 'translate(-50%, 0)',
      maxWidth: CARD_MAX_WIDTH,
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
      overflowWrap: 'break-word'
    };
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

      {/* Tutorial card with arrow */}
      <div
        className="z-50 bg-blue-900 border border-blue-500 rounded-lg shadow-lg p-6 absolute animate-fade-in"
        style={cardStyle}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-blue-200">{title}</h2>
          <button onClick={onSkip} className="text-gray-300 hover:text-white ml-2">
            <X size={18} />
          </button>
        </div>
        
        <p className="text-gray-100 mb-2" style={{wordBreak: 'break-word', whiteSpace: 'pre-line', overflowWrap: 'break-word'}}>
          {description}
        </p>
        
        <div className="flex justify-end">
          {!highlightRef && currentStep !== steps.length - 1 && (
            <button
              onClick={onNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
          {highlightRef && (
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

        {/* Arrow */}
        {highlightRect && (
          <div
            className={`absolute w-0 h-0 ${
              arrowDir === 'up' ? 'border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-blue-500' :
              arrowDir === 'down' ? 'border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-blue-500' :
              arrowDir === 'left' ? 'border-t-8 border-b-8 border-r-16 border-t-transparent border-b-transparent border-r-blue-500' :
              'border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-blue-500'
            }`}
            style={arrowStyle}
          />
        )}
      </div>

      <style>{`.tutorial-highlight-cursor { cursor: pointer !important; box-shadow: 0 0 0 4px #1e40af55 !important; }`}</style>
    </>
  );
}
