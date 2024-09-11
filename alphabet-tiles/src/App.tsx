import React, { useState } from 'react';

const App: React.FC = () => {
  const [outputString, setOutputString] = useState<string>('');

  // Generate an array of uppercase alphabets (A-Z)
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Handle tile clicks
  const handleTileClick = (letter: string) => {
    // Append the letter to the output string
    const newOutput = outputString + letter;

    // Replace consecutive identical letters with underscores
    const replacedString = newOutput.replace(/(.)\1{2,}/g, match => '_'.repeat(match.length));

    // Update the output string
    setOutputString(replacedString);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-6 gap-4">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleTileClick(letter)}
            className="w-16 h-16 bg-blue-500 text-white font-bold text-xl rounded shadow hover:bg-blue-600 transition-colors"
          >
            {letter}
          </button>
        ))}
      </div>
      <div id="outputString" className="mt-8 text-2xl font-mono bg-white p-4 rounded shadow">
        {outputString || 'Click tiles to start'}
      </div>
    </div>
  );
};

export default App;
