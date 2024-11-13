import React from "react";

function Results({ score, totalQuestions, userAnswers, onRestart }) {
  const feedback = score >= 3 ? "Well done!" : "Try again!";

  return (
    <div className="results">
      <h2>Results</h2>
      <p>Score: {score} out of {totalQuestions}</p>
      <p>{feedback}</p>
      <ul>
        {userAnswers.map((answer, index) => (
          <li key={index}>
            <strong>Q{index + 1}: {answer.question}</strong>
            <p>Your answer: {answer.selectedOption} - {answer.isCorrect ? "Correct" : "Incorrect"}</p>
          </li>
        ))}
      </ul>
      <button onClick={onRestart}>Restart Quiz</button>
    </div>
  );
}

export default Results;
