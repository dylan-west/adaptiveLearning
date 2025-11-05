import logo from "../assets/logo.png";
import {Link} from "react-router-dom"
import "../css/setup.css";

function Setup() {
  return (
    <div>
      <div className="header">
        <a href="setup.html">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className="main">
        <p>Please select a topic and describe what you'd like to learn</p>
        <form>
        <textarea></textarea>
        <br />
        <div className="selections">
          <select>
            <option>Subject</option>
          </select>
          <select>
            <option>Sub-topic</option>
          </select>
          <select>
            <option>Level</option>
          </select>
        </div>
        <Link to="/confirm">
            <button type="submit" className="setup-button">Continue</button>
        </Link>
        
        </form>
      </div>
    </div>
  );
}

export default Setup;
