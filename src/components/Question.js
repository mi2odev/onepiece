import React from 'react';

const Question = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  // Ensure first question shows 0% progress visually
  const rawProgress = (currentQuestion - 1) / totalQuestions;
  const progressPercentage = Math.max(0, Math.min(100, rawProgress * 100));
  
  return (
  <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 sm:p-6 pb-28 flex flex-col relative overflow-hidden overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] select-none">
        <div className="absolute -top-10 -left-10 w-56 h-56 bg-gradient-to-br from-blue-500/40 to-purple-600/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-pink-500/30 to-orange-400/30 blur-3xl rounded-full" />
      </div>
  <div className="w-full max-w-5xl mx-auto flex flex-col flex-1 overflow-hidden">
        {/* Progress Section */}
  <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 text-xs sm:text-sm font-medium tracking-wide text-blue-200/80">
            <span className="uppercase">Question {currentQuestion} / {totalQuestions}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-700/40 border border-slate-600/30 shadow-inner overflow-hidden">
            <div
              className="h-full relative rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.35)_45%,rgba(255,255,255,0)_80%)] animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* (Top pills removed - restoring original design positioning) */}

        {/* Question Card */}
  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 border border-white/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col flex-grow">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,transparent_60%)]" />
          {/* Question Number Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-7 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider shadow-lg border border-white/10">
              QUESTION {currentQuestion}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-10 md:mb-12 leading-relaxed tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {question.question}
          </h2>
          
          {/* Answers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow overflow-y-auto pr-1 pb-2 pl-1 md:pl-2 overscroll-contain">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-700/70 hover:from-indigo-600/90 hover:to-purple-600/90 text-white p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-600/30 hover:border-indigo-400/60 transition-all duration-300 ease-out backdrop-blur-sm will-change-transform overflow-hidden origin-center hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.55)]"
                style={{ transform: 'translateZ(0)' }}
                onClick={() => onAnswer(answer.scores)}
              >
                  {/* Inline Letter + Text */}
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-lg border border-white/10 flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed group-hover:text-white transition-colors duration-300 tracking-wide text-left">
                      {answer.text}
                    </p>
                  </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Click Ripple Effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 transform scale-0 group-active:scale-100 transition-transform duration-150 rounded-2xl" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Pills (original bottom position, with extra bottom space so footer doesn't cover) */}
  <div className="flex justify-center mt-5 md:mt-6 space-x-1.5 md:space-x-2 relative z-20">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const isAnswered = i < currentQuestion - 1;
            const isCurrent = i === currentQuestion - 1;
            return (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isAnswered
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md w-4 md:w-5'
                    : isCurrent
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500 w-6 md:w-7 shadow-lg scale-110'
                    : 'bg-slate-600/50 w-2 md:w-3'
                }`}
              />
            );
          })}
        </div>

        {/* Spacer for fixed footer safety */}
  <div className="h-4" />

      </div>
    </div>
  );
};

export default Question;