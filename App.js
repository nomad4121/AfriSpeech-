import React, { useState, useEffect } from 'react';
import './App.css';
import wordList from './words.json';

function App() {
  const [language, setLanguage] = useState('en');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isListening, setIsListening] = useState(false);
  const currentWord = wordList[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % wordList.length);
    setFeedback('');
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    handleNext();
  };

  const handleSpeak = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : language === 'sw' ? 'sw-KE' : language === 'so' ? 'so-SO' : 'am-ET';
    recognition.start();
    setIsListening(true);
    setFeedback('🎙 Listening...');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const target = currentWord[language].toLowerCase();
      if (transcript.includes(target)) {
        setFeedback('✅ Correct!');
        setScore(score + 1);
      } else {
        setFeedback('❌ Try again!');
      }
      setTotal(total + 1);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setFeedback('⚠️ Error occurred during speech recognition');
      setIsListening(false);
    };
  };

  return (
    <div className="App">
      <h1>AfriSpeech</h1>
      <div className="controls">
        <label>Language: </label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="so">Somali</option>
          <option value="am">Amharic</option>
        </select>
      </div>
      <div className="card">
        <img src={currentWord.image} alt="illustration" />
        <h2>{currentWord[language]}</h2>
        <button onClick={handleSpeak}>🎤 Speak</button>
        <button onClick={handleNext}>➡️ Next</button>
        <p className={isListening ? 'listening' : ''}>{feedback}</p>
        <p>Score: {score}/{total}</p>
      </div>
    </div>
  );
}

export default App;
