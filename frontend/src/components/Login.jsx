import logo from '../assets/logo.png'
import '../css/login.css'
import {Link} from "react-router-dom"


function Login(){

    return(
    <div>
        <div className="header">
            <a href="setup.html"><img src={logo} alt="logo" /></a>
        </div>
        <div className="main">
            <div className="login">
                <p>
                    Login to continue:
                </p>
                <form>
                    <input type="text" placeholder="Enter your email"/>
                    <br />
                    <input type="password" placeholder="Enter your password"/>
                    <br />
                    <br />

                    <Link to="/setup">
                        <input type="submit" value="Submit"/>
                    </Link>
                    
                    
                </form>
            </div>

        </div>
    </div>
    )
}

export default Login