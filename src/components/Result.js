import React, { useState } from 'react';
import { characters } from '../data/questions';

const Result = ({ scores = {}, onRestart }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Safely determine top character
  const scoreKeys = Object.keys(scores);
  const topCharacterKey = scoreKeys.length
    ? scoreKeys.reduce((a, b) => (scores[a] > scores[b] ? a : b))
    : Object.keys(characters)[0];
  const character = characters[topCharacterKey];

  // Calculate percentages for all characters
  const totalPossibleScore = 32 * 3; // 32 questions, max 3 points each
  const characterPercentages = Object.entries(characters).map(([key, char]) => {
    const raw = scores[key] || 0;
    return {
      key,
      name: char.name,
      percentage: Math.round((raw / totalPossibleScore) * 100),
      color: char.color,
      emoji: char.emoji,
      image: char.image
    };
  });

  const sortedPercentages = [...characterPercentages].sort(
    (a, b) => b.percentage - a.percentage
  );

  const openImageModal = (imageSrc, name, description, color, traits = []) => 
    setSelectedImage({ src: imageSrc, name, description, color, traits });
  const closeImageModal = () => setSelectedImage(null);

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative pb-24">
      {/* Hero */}
  <div className="relative flex-shrink-0 overflow-visible">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${character.color}40, ${character.color}10)`
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 text-center">
          <div className="mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full border-4 overflow-hidden shadow-2xl"
              style={{ borderColor: character.color }}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 items-center justify-center text-5xl">
                <span>{character.emoji}</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your One Piece Character is
          </h1>
          <h2
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${character.color}, ${character.color}80)`
            }}
          >
            {character.name}
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {character.title}
          </p>
          <div className="flex justify-center mb-4 md:mb-8">
            <div className="relative">
              <svg className="w-28 h-28 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke={character.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - sortedPercentages[0].percentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-bold"
                  style={{ color: character.color }}
                >
                  {sortedPercentages[0].percentage}%
                </span>
                <span className="text-xs md:text-sm text-blue-200">Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Character Card */}
  <div className="container mx-auto px-4 py-4 md:py-6 flex-shrink-0 overflow-visible">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Image */}
            <div className="text-center">
              <div
                className="relative w-56 h-72 md:w-64 md:h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform hover:scale-[1.025] transition-transform duration-300 will-change-transform"
                style={{ boxShadow: `0 20px 40px ${character.color}30` }}
                onClick={() => openImageModal(character.image, character.name, character.description, character.color, character.traits)}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-contain bg-slate-900/40"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden w-full h-full items-center justify-center text-6xl"
                  style={{ backgroundColor: character.color }}
                >
                  <span>{character.emoji}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm md:text-base">View Wanted Poster</span>
                </div>
              </div>
            </div>
            {/* Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{character.title}</h3>
                <p className="text-blue-200 text-base md:text-lg leading-relaxed">
                  {character.description}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Your Personality Traits</h4>
                <div className="flex flex-wrap gap-3">
                  {character.traits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border"
                      style={{
                        backgroundColor: `${character.color}20`,
                        borderColor: character.color,
                        color: character.color
                      }}
                    >
                      #{trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Character Grid (scrollable) */}
  <div className="flex-1 flex flex-col overflow-visible">
        <div className="container mx-auto px-4 pt-2 pb-1 flex-shrink-0 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Complete Personality Analysis</h3>
          <p className="text-blue-200 text-xs md:text-sm">See how you match with all One Piece characters</p>
        </div>
        <div className="flex-1 overflow-y-auto pt-4 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
            {sortedPercentages.map((char, index) => (
              <div
                key={char.key}
                className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 cursor-pointer transform hover:scale-[1.02] transition-transform duration-300 will-change-transform ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}
                style={{ overflow: 'visible', zIndex: index === 0 ? 5 : 'auto', transformOrigin: 'center center' }}
                onClick={() => openImageModal(char.image, char.name, characters[char.key].description, characters[char.key].color, characters[char.key].traits)}
              >
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                    Best Match
                  </div>
                )}
                <div className="text-center space-y-3">
                  <div className="text-sm font-bold text-blue-200">#{index + 1}</div>
                  <div className="w-16 h-20 mx-auto rounded-lg overflow-hidden">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-contain bg-slate-900/40"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className="hidden w-full h-full items-center justify-center text-2xl"
                      style={{ backgroundColor: char.color }}
                    >
                      {char.emoji}
                    </div>
                  </div>
                  <div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${char.percentage}%`, backgroundColor: char.color }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: char.color }}>
                      {char.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
  <div className="container mx-auto px-4 py-4 flex-shrink-0 text-center relative z-20">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <span>🔄</span>
            <span>Take Quiz Again</span>
          </button>
          <button
            onClick={() => {
              const text = `I got ${character.name} in the One Piece Personality Test! ${character.description}`;
              if (navigator.share) {
                navigator.share({
                  title: 'One Piece Personality Test Result',
                  text,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(text + ` - ${window.location.href}`);
                alert('Result copied to clipboard!');
              }
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <span>📤</span>
            <span>Share Result</span>
          </button>
        </div>
      </div>


      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl shadow-2xl bg-slate-900/90 border border-white/15 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-950/60 flex items-center justify-center p-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.name}
                className="max-h-[340px] w-auto object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto max-h-[260px]">
              <h3 className="text-xl font-bold text-white text-center tracking-wide" style={{ color: selectedImage.color }}>
                {selectedImage.name}
              </h3>
              {selectedImage.description && (
                <p className="text-sm leading-relaxed text-blue-200 text-center">
                  {selectedImage.description}
                </p>
              )}
              {selectedImage.traits && selectedImage.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {selectedImage.traits.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full text-[11px] font-medium border"
                      style={{
                        backgroundColor: selectedImage.color + '22',
                        borderColor: selectedImage.color,
                        color: selectedImage.color
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;