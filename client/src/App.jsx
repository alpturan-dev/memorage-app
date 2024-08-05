import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([])

  const getBooks = async () => {
    axios
      .get('http://localhost:5001/books')
      .then((response) => {
        console.log("response", response.data)
        setBooks(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getBooks();
  }, [])

  return (
    <div>
      Books
      {books.map((book) => (
        <div key={book._id}>
          {book.title} | {book.author} | {book.publishYear}
        </div>
      ))}
    </div>
  )
}

export default App
