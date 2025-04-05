import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { fetchAifyResponse } from "../services/geminiService";
import Logo from "../assets/image.png";
import video from "../assets/video.png"; // Placeholder for video

// Inject styles for floating button, popup, and floating image
const styles = `
  .floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(45deg, #e91e63, #9c27b0);
    box-shadow: 0 4px 12px rgba(233, 30, 99, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .floating-button:hover {
    transform: scale(1.1);
  }

  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
    background: linear-gradient(135deg, #1e1e1e, #2c3e50);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 2000;
    color: white;
    overflow: hidden;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .popup-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .avatar-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .floating-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    animation: float 3s ease-in-out infinite;
  }

  .animation-container {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 10px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .animation-image {
    width: 300px;
    height: 180px;
    object-fit: cover;
    animation: float 3s ease-in-out infinite;
  }

  .caption {
    background: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
  }

  .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const AIExplain = ({ editorContent }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch Hinglish explanation from Gemini API
  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const prompt = `
Analyze this code:\n${editorContent}\n
Your task is to:
1. Detect the programming language based on the code’s syntax (e.g., Python, JavaScript, C++).
2. Provide a short explanation (3-5 sentences) of the code’s logic and approach in Hinglish just like you are explaining to the beginner  (Hindi + English mix).
3. Keep it simple, conversational, and beginner-friendly, as if explaining to a friend.
4. Return only the raw text of the explanation, no additional formatting or symbols.
`;
      const res = await fetchAifyResponse(prompt);
      setExplanation(res || "Kuch samajh nahi aaya, bhai!");
      return res;
    } catch (error) {
      setExplanation("Sorry, explanation generate nahi ho paya!");
      console.error("Gemini Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Text-to-Speech Integration
  const generateSpeech = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN"; // Hindi language
      utterance.pitch = 1; // Normal pitch
      utterance.rate = 1.5; // Normal speed
      utterance.volume = 1; // Full volume

      // Handle speech events
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setExplanation(prev => prev + " (Audio bolne mein problem hua)");
      };

      // Select a Hindi voice (if available)
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => voice.lang === "hi-IN");
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      } else {
        console.warn("No Hindi voice found, using default");
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Web Speech API not supported in this browser");
      setExplanation(prev => prev + " (Browser mein speech support nahi hai)");
    }
  };

  // Handle popup open and fetch data
  const handlePopupOpen = async () => {
    setIsPopupOpen(true);
    const explanationText = await fetchExplanation();
    if (explanationText) {
      generateSpeech(explanationText);
    }
  };

  // Stop speech when closing popup
  const handlePopupClose = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="floating-button" onClick={handlePopupOpen}>
        <FontAwesomeIcon icon={faPlay} size="2x" />
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-header">
            <h2 className="text-xl font-bold">Code Samjhaai</h2>
            <button className="close-btn" onClick={handlePopupClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="popup-content">
            {/* Avatar with Caption */}
            <div className="avatar-container">
              <img
                src={Logo}
                alt="Avatar"
                className="floating-image"
                onError={(e) => (e.target.src = "/fallback-avatar.png")}
              />
              <div className="caption">{loading ? "Thoda ruk, bhai..." : explanation}</div>
            </div>

            {/* Animation Container (Video-like) */}
            <div className="animation-container">
              <img
                src={video}
                alt="Animation"
                className="animation-image"
                onError={(e) => (e.target.src = "/fallback-animation.jpg")}
              />
            </div>

            {/* Speech Status */}
            {isSpeaking && !loading && (
              <div className="text-center text-sm text-green-300">
                Bol raha hai...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export  default AIExplain ;