import React from 'react'
import '../index.css'

const Products = () => {
  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, image: 'https://covers.openlibrary.org/b/id/7725318-M.jpg', description: 'A classic American novel' },
    { id: 2, title: '1984', author: 'George Orwell', price: 13.99, image: 'https://covers.openlibrary.org/b/id/7878060-M.jpg', description: 'Dystopian fiction masterpiece' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 14.99, image: 'https://covers.openlibrary.org/b/id/8406147-M.jpg', description: 'A gripping tale of racial injustice' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, image: 'https://covers.openlibrary.org/b/id/7725318-M.jpg', description: 'Romantic novel of manners' },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 13.99, image: 'https://covers.openlibrary.org/b/id/7947826-M.jpg', description: 'Coming-of-age classic' },
    { id: 6, title: 'Jane Eyre', author: 'Charlotte Brontë', price: 12.99, image: 'https://covers.openlibrary.org/b/id/7878060-M.jpg', description: 'Gothic romance novel' },
    { id: 7, title: 'Wuthering Heights', author: 'Emily Brontë', price: 12.99, image: 'https://covers.openlibrary.org/b/id/8406147-M.jpg', description: 'Dark passionate tale' },
    { id: 8, title: 'Moby Dick', author: 'Herman Melville', price: 15.99, image: 'https://covers.openlibrary.org/b/id/7725318-M.jpg', description: 'Epic adventure at sea' },
    { id: 9, title: 'The Odyssey', author: 'Homer', price: 14.99, image: 'https://covers.openlibrary.org/b/id/7947826-M.jpg', description: 'Ancient Greek epic poem' },
    { id: 10, title: 'Frankenstein', author: 'Mary Shelley', price: 11.99, image: 'https://covers.openlibrary.org/b/id/7878060-M.jpg', description: 'Gothic science fiction novel' }
  ]

  return (
    <div>
    <div className="book-container">
      {books.map(book => (
        <div key={book.id} className="book">
      <img src={book.image} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>${book.price.toFixed(2)}</p>
      <p>{book.description}</p>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Products
