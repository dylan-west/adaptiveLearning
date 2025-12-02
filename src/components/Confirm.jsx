import logo from "../assets/logo.png"
import "../css/confirm.css"
import BookCard from "./BookCard"
import {useEffect} from "react"
import {Link} from "react-router-dom"
import { useLocation } from 'react-router-dom';
import {getArticles} from '../services/api'
import {useState} from 'react'


function Confirm(){
  
  const [loading, changeLoading] = useState(true);
  const location = useLocation();
  const formData = location.state?.formData;
  let searchQuery = formData[0];
  let category = formData[1];
  const [articles, setArticles] = useState({
            data: [
              {
                title: "Trying to load articles",
              },
            ],
          });


    useEffect(() => {
      const loadArticles = async () => {
        try{
          console.log("attempting to grab articles");
          setArticles(await getArticles(searchQuery, category));

        }
        catch(err){
          console.log("couldnt load articles. throwing error");
          console.log(err);
           setArticles({
            data: [
              {
                title: "Failed to load articles!!",
              },
            ],
          });
    
        }
        finally{
          console.log("loading off");
          changeLoading(false);
        }
      };
      loadArticles();
      console.log('finished');
      console.log(articles);
    }, []);


    const p = {
        marginBottom: "3em"
    }
    const container = {
        display: "flex",
        gap: "3em"

    }
    
    const buttonContain = {
        display: "flex",
        justifyContent: "space-between",
        width: "70%",
        margin: "2em auto"
    }


    return <div>
            <div className="header">
        <a href="setup.html"><img src={logo} alt="logo" /></a>
    </div>

    <div className="confirm-main">
        <h1>Your Learning Materials</h1>
        <p style={p}>Here is a list of the learning material we'll be referencing for this session.</p>
        <div id="book-container" style={container}>
            {articles.data.map((article) => (
              <BookCard article={article} />
            ))}
        </div>
        <div className="confirm-buttons" style={buttonContain}>
            <Link to="/setup">
                <button className="revise" >Revise Choices</button>
            </Link>
            <Link to="/quiz">
            <button className="confirm">Start Learning</button>
            </Link>
        </div>
    </div>
    </div>
}

export default Confirm