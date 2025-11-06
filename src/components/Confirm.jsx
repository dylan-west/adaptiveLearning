import logo from "../assets/logo.png"
import "../css/confirm.css"
import BookCard from "./BookCard"
import {useEffect} from "react"
import {Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { getArticles } from '../services/api';


function Confirm(){


  const location = useLocation();
  const formData = location.state?.formData;
  const searchQuery = formData[0];
  const subject = formData[1];
  
  
  useEffect( () => {
      
      const fetchArticles = async () => {
      try{
        console.log("search query: " + searchQuery);
        console.log("subject: " + subject);
        const articles = await getArticles("Math");
      } catch(err){
        console.error("Error fetching articles:", err);
      }
    
  }
  fetchArticles();
}, [])


    const p = {
        marginBottom: "3em"
    }
    const container = {
        display: "flex",

    }
    
    const buttonContain = {
        display: "flex",
        justifyContent: "space-between",
        width: "70%",
        margin: "2em auto"
    }



    const textbooks = [
      {
        title: "Geology 101",
        authors: ["Greg Smith", "Mary Watson"],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.thenile.io%2Fr1000%2F9781473601550.jpg&f=1&nofb=1&ipt=5c5b097fe58ff3c9245d6f4abf57ca83decadf7772563046b3dfdc3680abd6f0"
      },
      {
        title: "California Geology",
        authors: ["Stanley Jacobs", "John Henry"],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.thenile.io%2Fr1000%2F9781473601550.jpg&f=1&nofb=1&ipt=5c5b097fe58ff3c9245d6f4abf57ca83decadf7772563046b3dfdc3680abd6f0"
      },
      {
        title: "Introduction to Mineralogy",
        authors: ["Sarah Collins", "David Lee"],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.thenile.io%2Fr1000%2F9781473601550.jpg&f=1&nofb=1&ipt=5c5b097fe58ff3c9245d6f4abf57ca83decadf7772563046b3dfdc3680abd6f0"
      },
      {
        title: "Plate Tectonics Explained",
        authors: ["Rachel Green", "Thomas Patel"],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.thenile.io%2Fr1000%2F9781473601550.jpg&f=1&nofb=1&ipt=5c5b097fe58ff3c9245d6f4abf57ca83decadf7772563046b3dfdc3680abd6f0"
      },
      {
        title: "The Earth's Layers",
        authors: ["Linda Perez", "Mark Robinson"],
        img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.thenile.io%2Fr1000%2F9781473601550.jpg&f=1&nofb=1&ipt=5c5b097fe58ff3c9245d6f4abf57ca83decadf7772563046b3dfdc3680abd6f0"
      },
    ];
    return <div>
            <div className="header">
        <a href="setup.html"><img src={logo} alt="logo" /></a>
    </div>

    <div className="confirm-main">
        <h1>Your Learning Materials</h1>
        <p style={p}>Here is a list of the learning material we'll be referencing for this session.</p>
        <div id="book-container" style={container}>
            {textbooks.map((textbook) => (
                <BookCard book={textbook}></BookCard>
            ))}
        </div>
        <div className="confirm-buttons" style={buttonContain}>
            <Link to="/setup">
                <button className="revise" >Revise Choices</button>
            </Link>
            <button className="confirm">Start Learning</button>
        </div>
    </div>
    </div>
}

export default Confirm