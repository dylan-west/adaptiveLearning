import logo from "../assets/logo.png"
import "../css/quiz.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'
import {useState} from "react"
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"

function Quiz(){
    const navigate = useNavigate();

    console.log("quiz");
    const [currQuestion, changeCurrQuestion] = useState(0);
    const [selection, changeSelection] = useState("null");
    let selectionArr = ["null", "null"];
    const [userAnswers, changeUserAnswers] = useState(selectionArr);
    const [isAnswered, changeIsAnswered] = useState(false);


    let questionBank = [{
        question: "What color is the sky?",
        options: ["red", "orange", "green", "blue"],
        answer: "blue"
    },
    {
        question: "Where is Mexico?",
        options: ["North America", "South America", "West America", "East America"],
        answer: "North America"
    }]


    function handleClick(option){
        if(!isAnswered)
            changeSelection(option);
    }

    function goPrev(){
        if(currQuestion > 0){
            changeSelection(userAnswers[currQuestion-1]);
            changeCurrQuestion(currQuestion - 1);
        }
    }
    function goNext(){
        if (currQuestion < questionBank.length - 1){
            if(userAnswers[currQuestion + 1] === "null"){
                changeIsAnswered(false);
            }
            changeSelection(userAnswers[currQuestion + 1]);
            changeCurrQuestion(currQuestion + 1);
        }
    }

    function checkAnswer(){
        selectionArr = userAnswers;
        selectionArr[currQuestion] = selection;
        changeUserAnswers(selectionArr);
        changeIsAnswered(true);
        if(selection === "null"){
            console.log("something went wrong");
        }
        if(selection === questionBank[currQuestion].answer){
            console.log("You answered correctly!!");
        }
        else{
            console.log("Incorrect answer");
        }
    }

    function handleEndQuiz(){
        let quizData = [questionBank, userAnswers];
        navigate("/results", {state: {quizData}});
    }

    return (
        <div>
            <div className="header">
                <Link to="/setup"><img src={logo} alt="logo" /></Link>
            </div>
            <div className="main">
                <div className="quiz-content-container">
                    <div onClick={goPrev}><FontAwesomeIcon icon={faCircleArrowLeft} className={"arrow" + (currQuestion == 0 ? " disabled" : "")}/></div>
                    <div className="quiz-content">
                        <h1>Question {currQuestion + 1}</h1>
                        <h2>{questionBank[currQuestion].question}</h2>
                        <div>
                            {
                                questionBank[currQuestion].options.map((option) => (<button className={"quiz-option" + (isAnswered ? " answered" : "") + ((selection === option && !isAnswered) ? " option-selected" : (isAnswered && option === questionBank[currQuestion].answer) ? " correct-selected" : (isAnswered && selection === option && selection !== questionBank[currQuestion].answer) ? " incorrect-selected" : " ")} onClick={() => handleClick(option)}>{option}</button>))
                            }
                        </div>
                        <p>{selection}</p>
                        <p>{userAnswers.map((answer) => answer)}</p>
                    </div>
                    <div onClick={goNext}><FontAwesomeIcon icon={faCircleArrowRight} className="arrow"/></div>             
                </div>

                <div className="nav-buttons">
                    <button className={selection === "null" ? "disabled" : ""} onClick={checkAnswer} disabled={selection === "null" || isAnswered}>Check Answer</button>
                    <button onClick={handleEndQuiz}>End Quiz</button>
                </div>
            </div>

        </div>
    )
}


export default Quiz