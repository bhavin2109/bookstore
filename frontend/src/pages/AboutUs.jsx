import React from "react";
import "../index.css";

function AboutUs() {
  const specialties = [
    {
      title: "Expert Curation",
      description: "Handpicked selections from bestsellers to hidden gems across all genres",
      icon: "📚"
    },
    {
      title: "Author Events",
      description: "Regular meet-and-greets with renowned and emerging authors",
      icon: "🎤"
    },
    {
      title: "Book Clubs",
      description: "Community-driven discussions and literary engagement programs",
      icon: "👥"
    },
    {
      title: "Fast Shipping",
      description: "Quick and reliable delivery with easy returns within 30 days",
      icon: "🚚"
    },
    {
      title: "Competitive Prices",
      description: "Best prices in town with regular discounts and loyalty rewards",
      icon: "💰"
    },
    {
      title: "Independent Support",
      description: "Dedicated space for indie authors and small publishers",
      icon: "⭐"
    }
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1>About Our Bookstore</h1>
          <p>Your gateway to worlds of imagination and knowledge</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        {/* Story & Mission */}
        <div className="about-grid-2">
          <div className="about-card">
            <h2>Our Story</h2>
            <p>
              Founded in 2010, our bookstore has been a beloved destination for 
              book lovers and readers of all ages. We're committed to providing 
              a curated selection of books across all genres. What started as a small 
              shop has grown into a thriving community hub for literature enthusiasts.
            </p>
            <p>
              Over the past decade, we've served thousands of customers and built lasting 
              relationships with our community. Our passion for books drives everything we do.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              To foster a love of reading and make quality books accessible to 
              everyone in our community while supporting independent authors 
              and publishers. We believe every person deserves access to stories 
              that inspire, educate, and entertain.
            </p>
            <p>
              We strive to create an inclusive space where all readers feel welcome 
              and valued, regardless of their background or literary preferences.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="about-values">
          <h2>Our Values</h2>
          <div className="about-values-grid">
            <div className="about-values-item">
              <h3 className="blue">Community First</h3>
              <p>We believe in building strong connections and fostering a vibrant literary community.</p>
            </div>
            <div className="about-values-item">
              <h3 className="purple">Quality Selection</h3>
              <p>Every book in our store is carefully selected to ensure the best reading experience.</p>
            </div>
            <div className="about-values-item">
              <h3 className="blue">Accessibility</h3>
              <p>We work to make books and literature accessible to everyone in our community.</p>
            </div>
          </div>
        </div>

        {/* Specialties with Gradient Cards */}
        <h2 className="about-specialties-title">Why Choose Us</h2>
        <div className="about-specialties-grid">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="about-specialty-card"
            >
              <div className="icon">{specialty.icon}</div>
              <h3>{specialty.title}</h3>
              <p>{specialty.description}</p>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="about-community">
          <h2>Join Our Community</h2>
          <p>
            Become part of a thriving community of book lovers. Attend our events, join book clubs, 
            and discover your next favorite read with fellow enthusiasts who share your passion for literature.
          </p>
          <div className="about-community-grid">
            <div className="about-community-item">
              <p className="stat blue">10K+</p>
              <p className="label">Active Members</p>
            </div>
            <div className="about-community-item">
              <p className="stat purple">500+</p>
              <p className="label">Books in Stock</p>
            </div>
            <div className="about-community-item">
              <p className="stat blue">50+</p>
              <p className="label">Events Per Year</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact">
        <div className="about-contact-container">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Reach out with any questions or inquiries.</p>
          <div className="about-contact-grid">
            <div className="about-contact-card">
              <p>📧 Email: info@bookstore.com</p>
            </div>
            <div className="about-contact-card">
              <p>📞 Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="about-footer">
        <div className="about-footer-container">
          <p>&copy; 2024 Our Bookstore. All rights reserved. Dedicated to readers everywhere.</p>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
