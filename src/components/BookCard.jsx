import {useEffect} from 'react'

function BookCard({article}){

    useEffect( () => {
        console.log(article);
    }, [])

    const image = {
        display: "block",
        width: "50%",
        position: "static",
        transform: "translateX(0%)",
        margin: "auto",
    }
    const title = {
        fontSize: "1rem",
        textAlign: "center"
    }

    const authors = {
        fontSize: "0.5rem",
        textAlign: "center"
    }

    const card = {


    }

    return <div style={card}>
        <h2 style={title}>{article.title}</h2>
        <p style={authors}>{article.year}</p>
        
        
        
    </div>

}

export default BookCard