import logo from "../assets/logo.png";
import {Link} from "react-router-dom"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import "../css/setup.css";

function Setup() {

  const navigate = useNavigate();


  const [textField, changeTextField] = useState("");
  const [select, changeSelect] = useState("None Selected");
  let formData = [textField, select];


  const subjects = ["Computer Science", "Medicine", "Chemistry", "Biology", "Materials Science", "Physics", "Geology", "Psychology", "Art", "History", "Geography", "Sociology", "Business", "Political Science", "Economics", "Philosophy", "Mathematics", "Engineering", "Environmental Science", "Agricultural and Food Sciences", "Education", "Law", "Linguistics"];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/confirm", {state: {formData}});
  }

  return (
    <div>
      <div className="header">
        <a href="setup.html">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className="main">
        <h3>{textField}</h3>
        <h3>{select}</h3>
        <p>Please select a topic and describe what you'd like to learn</p>
        <form onSubmit={handleSubmit}>
        <textarea value={textField} onChange={(e) => {
            changeTextField(e.target.value);
        }}></textarea>
        <br />
        <div className="selections">
          <select onChange={(e) => {
            changeSelect(e.target.value);
          }}>
            <option>None selected</option>
            {subjects.map((subject) => {
              return <option>{subject}</option>
            })}
          </select>
        </div>
        
            <button type="submit" className="setup-button">Continue</button>
        
        
        </form>
      </div>
    </div>
  );
}

export default Setup;
