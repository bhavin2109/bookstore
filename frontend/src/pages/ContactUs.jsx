import React from 'react'

const ContactUs = () => {
  return (
    <div>
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us today.</p>
        
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your full name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your.email@example.com" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="How can we help?" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Please describe your inquiry..." required></textarea>
          </div>
          
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
        
        <div className="contact-info">
          <h2>Other Ways to Reach Us</h2>
          <div className="info-item">
            <h3>Email</h3>
            <p>info@bookstore.com</p>
          </div>
          <div className="info-item">
            <h3>Phone</h3>
            <p>(555) 123-4567</p>
          </div>
          <div className="info-item">
            <h3>Address</h3>
            <p>123 Book Street, Reading City, RC 12345</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
