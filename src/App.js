import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const initialQuestions = [
    {
      questionText: 'What is the capital of India?',
      answerOptions: [
        { answerText: 'New Delhi', isCorrect: true },
        { answerText: 'Telangana', isCorrect: false },
        { answerText: 'Maharastra', isCorrect: false },
        { answerText: 'Gujarat', isCorrect: false },
      ],
    },
    {
      questionText: 'Who is CEO of Tesla?',
      answerOptions: [
        { answerText: 'Jeff Bezos', isCorrect: false },
        { answerText: 'Elon Musk', isCorrect: true },
        { answerText: 'Bill Gates', isCorrect: false },
        { answerText: 'Tony Stark', isCorrect: false },
      ],
    },
    {
      questionText: 'Who was the first Indian woman President of the United Nations General Assembly?',
      answerOptions: [
        { answerText: 'Indira Gandhi', isCorrect: false },
        { answerText: 'Vijaya Lakshmi', isCorrect: true },
        { answerText: 'Mother Teresa', isCorrect: false },
        { answerText: 'Margret Thatcher', isCorrect: false },
      ],
    },
    {
      questionText: 'Which Year did India win the First Cricket World Cup?',
      answerOptions: [
        { answerText: '1983', isCorrect: true },
        { answerText: '2011', isCorrect: false },
        { answerText: '2023', isCorrect: false },
        { answerText: '2008', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of the following is a mutable data type in Python?',
      answerOptions: [
        { answerText: 'String', isCorrect: false },
        { answerText: 'Tuple', isCorrect: false },
        { answerText: 'List', isCorrect: true },
        { answerText: 'Integer', isCorrect: false },
      ],
    },
  ];

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const [questions, setQuestions] = useState(shuffleArray([...initialQuestions]));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [topScore, setTopScore] = useState(parseInt(localStorage.getItem('highScore')) || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer for each question

  useEffect(() => {
    if (showScore) return;

    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, showScore]);

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      setWarningMessage('Please select an answer before proceeding.');
      return;
    }

    if (selectedAnswer.isCorrect) {
      setScore(score + 4);
    }

    const answerDetails = {
      question: questions[currentQuestion].questionText,
      answer: selectedAnswer.answerText,
      isCorrect: selectedAnswer.isCorrect,
    };
    setAnswers([...answers, answerDetails]);
    setSelectedAnswer(null);
    setWarningMessage('');
    setTimeLeft(10);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      if (score + 1 > topScore) {
        setTopScore(score + 1);
        localStorage.setItem('highScore', score + 1);
      }
    }
  };

  const handleAnswerSelection = (answerOption) => {
    setSelectedAnswer(answerOption);
    setWarningMessage('');
  };

  const handleRestartQuiz = () => {
    setQuestions(shuffleArray([...initialQuestions]));
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setWarningMessage('');
    setTimeLeft(10);
  };

  return (
    <div className='app'>
      {showScore ? (
        <div className='score-section'>
          <h2>You scored {score} out of 20</h2>
          <p>High Score: {topScore}</p>
          <h3>Your Answers:</h3>
          <ul className='your-answers'>
            {answers.map((answer, index) => (
              <li key={index} style={{ color: answer.isCorrect ? 'green' : 'red' }}>
                <span>Q: {answer.question}</span> - <span>Your Answer: {answer.answer}</span>
                {answer.isCorrect ? ' (Correct)' : ' (Incorrect)'}
              </li>
            ))}
          </ul>
          <button type='button' onClick={handleRestartQuiz}>Restart</button>
        </div>
      ) : (
        <>
          <div className='quiz-main-card'>
            <div className='question-section'>
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{questions.length}
              </div>
              <div className='question-text'>{questions[currentQuestion].questionText}</div>
              <div className='timer'>Time Left: {timeLeft}s</div>
            </div>
            <div className='answer-section'>
              {questions[currentQuestion].answerOptions.map((answerOption) => (
                <button
                  key={answerOption.answerText}
                  onClick={() => handleAnswerSelection(answerOption)}
                  className={selectedAnswer === answerOption ? 'selected' : ''}
                >
                  {answerOption.answerText}
                </button>
              ))}
            </div>
            {warningMessage && <p className="warning-message">{warningMessage}</p>}
            <div className='next-btn'>
              <button
                className='next-button'
                onClick={handleNextQuestion}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
