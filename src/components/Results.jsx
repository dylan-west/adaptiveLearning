import logo from "../assets/logo.png"
import {Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'


function Results(){
      const location = useLocation();
    const quizData = location.state?.quizData;
    let questionBank = quizData[0];
    let responses = quizData[1];
    let questionAnswers = [];
    let correctAnswers = [];
    let incorrectAnswers = [];


    responses.forEach((response, index) => {
        let question = questionBank[index].question;
        let correct = (questionBank[index].answer === response);
        let actual = questionBank[index].answer;
        questionAnswers.push({
            question: question,
            response: response,
            correct: correct,
            actualAnswer: actual
        })
    });

    questionAnswers.forEach(
        (pair) => {
            if (pair.correct){
                correctAnswers.push(pair);
            }
            else{
                incorrectAnswers.push(pair);
            }
        }

    )
    return <div>
        <div className="header">
            <Link to="/setup"><img src={logo} alt="logo" /></Link>
        </div>
        <div className="main">
            <h1>Results</h1>
            <h2>Incorrect Answers <FontAwesomeIcon icon={faCircleXmark} /></h2>
            <div>{incorrectAnswers.map((questionAnswer) => (<div><p>Question: {questionAnswer.question}</p><p>Correct Answer: {questionAnswer.actualAnswer}</p><p>Response: {questionAnswer.response}</p></div>))}</div>
            <h2>Correct Answers <FontAwesomeIcon icon={faCircleCheck} /></h2>
            <p>{correctAnswers.map((questionAnswer) => (<div><p>Question: {questionAnswer.question}</p><p>Answer: {questionAnswer.response}</p></div>))}</p>
        </div>
        <Link to="/setup"><button>Start a New Quiz</button></Link>
    </div>
}

export default Results