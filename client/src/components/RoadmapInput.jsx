import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faSpinner, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const RoadmapInput = ({ interest, setInterest, generateRoadmap, isGenerating }) => {
  const [inputError, setInputError] = useState("");

  const validateInput = (value) => {
    // Remove special characters and extra spaces
    const sanitizedValue = value.replace(/[^\w\s-]/g, '').trim();
    
    if (sanitizedValue.length < 2) {
      setInputError("Input must be at least 2 characters long");
      return false;
    }
    if (sanitizedValue.length > 50) {
      setInputError("Input must be less than 50 characters");
      return false;
    }
    if (!/^[a-zA-Z]/.test(sanitizedValue)) {
      setInputError("Input must start with a letter");
      return false;
    }
    
    setInputError("");
    return sanitizedValue;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^\w\s-]/g, ''); // Allow only letters, numbers, spaces, and hyphens
    setInterest(sanitizedValue);
    validateInput(sanitizedValue);
  };

  const handleGenerateClick = () => {
    const validatedInput = validateInput(interest);
    if (validatedInput) {
      setInterest(validatedInput);
      generateRoadmap();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mb-16 w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700/50 z-10"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-md"></div>
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center">
        Start Your Learning Journey
      </h1>
      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={interest}
            onChange={handleInputChange}
            placeholder="What do you want to master? (e.g., AI, Blockchain, React)"
            className={`p-5 w-full bg-gray-900/70 border ${
              inputError ? 'border-red-500/50' : 'border-gray-700/50'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition-all hover:border-gray-600/50`}
          />
          {inputError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{inputError}</span>
            </motion.div>
          )}
        </div>
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating || !interest.trim() || inputError}
          className={`p-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-indigo-500/30 ${
            isGenerating || !interest.trim() || inputError
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5"
          }`}
        >
          {isGenerating ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
              <span className="text-lg">Crafting Your Path...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRocket} className="text-xl" />
              <span className="text-lg">Launch Learning Path</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default RoadmapInput;