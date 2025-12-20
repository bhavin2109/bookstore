import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'

const Header = () => {
  return (
    <div className="header w-full h-15 bg-blue-400 flex justify-around items-center">
      <div className="logo">Logo</div>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/contact-us">Contact Us</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}

export default Header
