import React, { useState } from 'react';
import Question from './components/Question';
import Result from './components/Result';
import Footer from './components/Footer';
import { questions } from './data/questions';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    luffy: 0,
    zoro: 0,
    nami: 0,
    sanji: 0,
    usopp: 0,
    chopper: 0,
    robin: 0,
    franky: 0,
    brook: 0,
    jinbe: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (answerScores) => {
    const newScores = { ...scores };
    Object.keys(answerScores).forEach(character => {
      newScores[character] += answerScores[character];
    });
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScores({
      luffy: 0,
      zoro: 0,
      nami: 0,
      sanji: 0,
      usopp: 0,
      chopper: 0,
      robin: 0,
      franky: 0,
      brook: 0,
      jinbe: 0
    });
    setShowResult(false);
    setIsStarted(false);
  };

  const startQuiz = () => setIsStarted(true);

  // Professional subtle emoji layout (fixed deliberately balanced positions)
  const professionalEmojis = [
    // Left vertical arc
    { e: '🏴\u200d☠️', top: '6%', left: '5%',  size: '2.4rem', anim: 'animate-float-slow', delay: '0s',   opacity: 0.38 },
    { e: '⚓',          top: '15%', left: '8%',  size: '2.1rem', anim: 'animate-float-slower', delay: '1.2s', opacity: 0.34 },
    { e: '🧭',          top: '24%', left: '6%',  size: '1.9rem', anim: 'animate-sway', delay: '2.1s', opacity: 0.33 },
    // Lower left accent
    { e: '💰',          top: '74%', left: '7%',  size: '2.2rem', anim: 'animate-bob-rotate', delay: '1.4s', opacity: 0.30 },
    // Right side gentle curve
    { e: '⚔️',          top: '9%',  left: '88%', size: '2.3rem', anim: 'animate-float-slow', delay: '0.5s', opacity: 0.37 },
    { e: '💎',          top: '19%', left: '84%', size: '2.0rem', anim: 'animate-sway', delay: '1.7s', opacity: 0.32 },
    { e: '🍊',          top: '46%', left: '90%', size: '1.95rem', anim: 'animate-float-slower', delay: '2.4s', opacity: 0.30 },
    { e: '🗺️',          top: '70%', left: '86%', size: '2.05rem', anim: 'animate-drift', delay: '0.9s', opacity: 0.30 },
    { e: '🪙',          top: '81%', left: '92%', size: '1.8rem', anim: 'animate-bob-rotate', delay: '2.9s', opacity: 0.28 },
    { e: '🌊',          top: '87%', left: '84%', size: '2.1rem', anim: 'animate-float-slower', delay: '1.3s', opacity: 0.27 }
  ];

  if (showResult) {
    return (
      <>
        <Result scores={scores} onRestart={restartQuiz} />
        <Footer />
      </>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-x-hidden pb-16">
        {/* Professional balanced emoji decor */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          {professionalEmojis.map((it, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute ${it.anim} pirate-glow mix-blend-screen`}
              style={{
                top: it.top,
                left: it.left,
                fontSize: it.size,
                animationDelay: it.delay,
                animationDuration: it.anim.includes('slower') ? '10s' : '8s',
                opacity: it.opacity,
                filter: 'drop-shadow(0 0 5px rgba(255,190,120,0.25))'
              }}
            >
              {it.e}
            </span>
          ))}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(10,15,35,0) 62%, rgba(10,15,35,0.55))' }} />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-28 overflow-visible">
  {/* (Main content container replaced above with z-10 wrapper) */}
          <div className="text-center max-w-4xl mx-auto flex flex-col overflow-visible px-1 sm:px-2">
            {/* Logo with enhanced multi-layer glow */}
              <div className="flex justify-center mb-5 md:mb-8 relative">
                <div className="relative isolate">
                  {/* Simplified glow (no square artifact) */}
                  <div className="pointer-events-none absolute -inset-x-10 -top-6 -bottom-4 flex items-center justify-center">
                    <div className="w-full max-w-[900px] h-full">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[70%] rounded-[50%] blur-[70px] opacity-70" style={{
                        background: 'radial-gradient(ellipse at center, rgba(255,185,60,0.55) 0%, rgba(255,140,35,0.28) 55%, rgba(255,110,20,0.08) 75%, rgba(255,90,0,0) 100%)'
                      }} />
                      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[75%] h-[45%] rounded-[50%] blur-[35px] opacity-80" style={{
                        background: 'radial-gradient(ellipse at center, rgba(255,210,120,0.85) 0%, rgba(255,165,50,0.45) 60%, rgba(255,130,20,0.15) 85%, rgba(255,110,0,0) 100%)'
                      }} />
                      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[78%] h-[48%] rounded-[50%] blur-[22px] mix-blend-screen opacity-60" style={{
                        background: 'radial-gradient(ellipse at center, rgba(255,240,170,0.9) 0%, rgba(255,190,70,0.35) 55%, rgba(255,160,40,0.12) 78%, rgba(255,140,0,0) 100%)'
                      }} />
                    </div>
                  </div>
                  <img
                    src="/images/logo.png"
                    alt="One Piece Logo"
                    className="relative w-72 md:w-96 lg:w-[30rem] h-auto object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(255,170,40,0.55)) drop-shadow(0 0 45px rgba(255,120,10,0.35))'
                    }}
                    onError={(e) => {
                      if (e.currentTarget.src.includes('logo.png')) {
                        e.currentTarget.src = '/images/logo.svg';
                      }
                    }}
                  />
                </div>
              </div>

            {/* Title / Subtitle */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-wide">
              Personality Test
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 mb-6 md:mb-10 leading-relaxed">
              Discover which <span className="text-yellow-400 font-semibold">Straw Hat Pirate</span> matches your personality!
            </p>

            {/* Start Button (final fix: no clipping, simplified layers) */}
            <button
              onClick={startQuiz}
              className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-orange-400/40 hover:scale-[1.045] active:scale-[0.985] will-change-transform"
              style={{
                background: 'linear-gradient(110deg,#ffb347 0%,#ff7a33 30%,#ff4733 55%,#ff1d66 85%)',
                boxShadow: '0 4px 18px rgba(0,0,0,0.55), 0 0 22px 6px rgba(255,150,40,0.38), 0 0 42px 14px rgba(255,70,120,0.28)'
              }}
            >
              {/* Soft gloss */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.06) 70%)',
                  mixBlendMode: 'overlay'
                }}
              />
              {/* Sheen (smaller, no side clipping) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1/3 translate-x-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.0)_0%,rgba(255,255,255,0.55)_55%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-40 group-hover:translate-x-[260%] transition-all duration-[1300ms] ease-out will-change-transform"
                  style={{ transform: 'skewX(8deg)' }}
                />
              </span>
              {/* Outer aura (contained) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-60 group-hover:opacity-85 transition-opacity duration-500"
                style={{
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.08), 0 0 25px 8px rgba(255,160,50,0.45), 0 0 55px 22px rgba(255,70,120,0.30)'
                }}
              />
              <span className="relative z-10 flex items-center tracking-wide drop-shadow-sm">
                Start Your Adventure
                <svg className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <p className="text-blue-300 mt-6 md:mt-10 text-lg">
              Join Luffy's crew and find your place on the Thousand Sunny! ⚓
            </p>

            {/* Detailed Feature / Lore Section */}
            <div className="mt-6 md:mt-10 grid md:grid-cols-3 gap-5 md:gap-6 text-left flex-shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-yellow-300 font-semibold mb-2 tracking-wide text-sm">HOW IT WORKS</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Answer 32 scenario-based questions crafted to map your choices to the core traits of each Straw Hat pirate.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-orange-300 font-semibold mb-2 tracking-wide text-sm">WHAT YOU GET</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  A primary match, full ranking of all crew members, personality trait breakdown, and a dynamic poster view.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <h3 className="text-red-300 font-semibold mb-2 tracking-wide text-sm">ACCURACY FOCUS</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Balanced scoring weights prevent ties and ensure each answer pushes you toward the most authentic match.
                </p>
              </div>
            </div>

            {/* Interactive small emoji orbit cluster */}
            <div className="absolute -right-6 top-2 hidden md:block">
              <div className="relative w-28 h-28 opacity-80">
                <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-spin-slower"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xl pirate-glow animate-float-slow">⚓</div>
                <div className="absolute bottom-2 left-2 text-lg pirate-glow animate-bob-rotate" style={{ animationDelay: '1.4s' }}>🗺️</div>
                <div className="absolute right-1 top-8 text-xl pirate-glow animate-sway" style={{ animationDelay: '0.7s' }}>💎</div>
              </div>
            </div>

            {/* Sub info row */}
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6 text-[10px] sm:text-xs tracking-wide text-blue-300/70 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span>32 QUESTIONS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                <span>10 CHARACTERS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: '1.2s' }} />
                <span>UNLIMITED REPLAYS</span>
              </div>
            </div>
            {/* Subtle spacer (reduced) */}
            <div className="flex-grow min-h-4" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      <Footer />
    </>
  );
}

export default App;