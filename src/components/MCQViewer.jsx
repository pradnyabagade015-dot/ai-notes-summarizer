import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const MCQViewer = ({ mcqs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentMcq = mcqs[currentIndex];

  const handleOptionSelect = (option) => {
    if (showAnswer) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setShowAnswer(true);
    if (selectedOption === currentMcq.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };
  
    const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="p-6 text-center rounded-3xl bg-white shadow-xl border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800">Quiz Completed!</h3>
        <p className="mt-4 text-lg text-slate-600">
          Your score: <span className="font-bold text-indigo-600">{score}</span> out of {mcqs.length}
        </p>
        <button
          onClick={handleRestart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <FiRefreshCw />
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white shadow-xl border border-slate-100">
        <p className="text-sm font-semibold text-indigo-600">
          Question {currentIndex + 1} of {mcqs.length}
        </p>
        <p className="mt-3 text-xl font-semibold text-slate-800">{currentMcq.question}</p>
      </div>

      <div className="space-y-3">
        {currentMcq.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = currentMcq.correctAnswer === option;

          let optionClass = 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300';
          if (showAnswer) {
            if (isCorrect) {
              optionClass = 'border-emerald-300 bg-emerald-50 text-emerald-800';
            } else if (isSelected) {
              optionClass = 'border-rose-300 bg-rose-50 text-rose-800';
            }
          } else if (isSelected) {
            optionClass = 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200';
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={showAnswer}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${optionClass}`}
            >
              <span className="font-medium">{option}</span>
              {showAnswer && isCorrect && <FiCheck className="text-emerald-600" />}
              {showAnswer && isSelected && !isCorrect && <FiX className="text-rose-600" />}
            </button>
          );
        })}
      </div>

      {showAnswer && currentMcq.explanation ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <p className="font-semibold">Explanation</p>
          <p className="mt-1 leading-6 text-indigo-800">{currentMcq.explanation}</p>
        </div>
      ) : null}
      
      <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <FiArrowLeft />
            Prev
          </button>

        {!showAnswer ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {currentIndex < mcqs.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <FiArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MCQViewer;
