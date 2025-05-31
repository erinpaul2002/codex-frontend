'use client';

export default function SettingsPanel({ theme, onThemeChange, fontSize, onFontSizeChange }) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-300">Theme:</label>
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
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
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-16"
          />
        </div>
      </div>
    </div>
  );
}
