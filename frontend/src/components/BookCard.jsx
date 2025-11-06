function BookCard({book}){
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
        <img src={book.img} alt={book.title} style={image}/>
        <h2 style={title}>{book.title}</h2>
        <p style={authors}>{book.authors.map( (author) => (
            author + " "
        ))}</p>
    </div>

}

export default BookCard