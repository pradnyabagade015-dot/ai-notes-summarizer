import { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MCQViewer = ({ mcqs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentMCQ = mcqs[currentIndex];

  const handleNext = () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
      setShowAnswer(true);
    }
  };

  const getOptionClassName = (option) => {
    if (!showAnswer) {
      return "hover:bg-gray-200";
    }
    if (option === currentMCQ.correctAnswer) {
      return "bg-green-200 border-green-500";
    }
    if (option === selectedOption) {
      return "bg-red-200 border-red-500";
    }
    return "bg-gray-100";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="mb-4 text-gray-600">
        Question {currentIndex + 1} of {mcqs.length}
      </div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {currentMCQ.question}
      </h2>

      <div className="space-y-3 mb-6">
        {currentMCQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={showAnswer}
            className={`w-full text-left p-3 border rounded-md transition-colors duration-200 flex items-center justify-between ${getOptionClassName(
              option
            )}`}
          >
            <span>{option}</span>
            {showAnswer && option === currentMCQ.correctAnswer && (
              <FaCheckCircle className="text-green-600" />
            )}
            {showAnswer &&
              option === selectedOption &&
              option !== currentMCQ.correctAnswer && (
                <FaTimesCircle className="text-red-600" />
              )}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <h4 className="font-bold text-blue-800">Explanation</h4>
          <p className="text-blue-700">{currentMCQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Prev
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === mcqs.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center"
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default MCQViewer;