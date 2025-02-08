import React, { useEffect } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Aarav Gupta",
    role: "Frequent Driver",
    text: "The QuickCar service was exceptional! The booking process was smooth, and the car was in perfect condition. Highly recommend!",
    image: "https://i.postimg.cc/gJXLWCkK/76b255a26ea10d1d080976b2e1a3de97-1424-2144.webp",
  },
  {
    name: "Isha Patel",
    role: "Regular Traveler",
    text: "Fantastic experience with QuickCar. Friendly staff and great deals. I'll definitely use them again for my next trip.",
    image: "https://i.postimg.cc/2SkPKm2g/image.png",
  },
  {
    name: "Rohan Sharma",
    role: "Occasional Driver",
    text: "QuickCar made my car rental experience hassle-free. The car was clean and well-maintained. Excellent service!",
    image: "https://i.postimg.cc/W4QbMhTM/0fe929f96e4a7a06e04e77e1e309320d.jpg",
  },
  {
    name: "Kiara Singh",
    role: "Road Trip Enthusiast",
    text: "QuickCar’s service is top-notch. The booking system is user-friendly and the cars are always reliable.",
    image: "https://i.postimg.cc/7ZJgDJsz/90c489613438c5678aee00ffe6c26af2-1376-2064.webp",
  },
  {
    name: "Vivaan Kumar",
    role: "Adventurer",
    text: "Great experience with QuickCar. The car was perfect for our trip and the customer service was excellent.",
    image: "https://i.postimg.cc/prVN8Hhf/b10c5d7f5adfb4e3a0ed7af4367639f8.webp",
  },
  {
    name: "Zara Khan",
    role: "Car Enthusiast",
    text: "I had a wonderful experience with QuickCar. The car was in great condition, and the service was very professional.",
    image: "https://i.postimg.cc/bYKngwNN/4b281c21dc6b93b7eebf79dbb194f8a3.jpg",
  },
];


  
const Testimonials = () => {
  useEffect(() => {
    const carouselElement = document.querySelector('#testimonialCarousel');
    if (carouselElement) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 3000,
        ride: 'carousel',
      });

      return () => {
        carousel.dispose();
      };
    }
  }, []);

  return (
    <div className="testimonials bg-gradient">
      <div className="test-container">
        <div className="d-flex justify-content-center mb-4">
          <p className="display-3 fw-bold">Hear from Our Happy Customers!</p>
        </div>
        <div id="testimonialCarousel" className="carousel slide">
          <div className="carousel-inner">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`carousel-item mb-3 ${index === 0 ? "active" : ""}`}
              >
                <div className="d-flex justify-content-center">
                  <div className="testimonial-card p-4 mb-5 bg-white border-0 rounded shadow-lg">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={"48px"}
                        height={"50px"}
                        className="rounded-circle me-3"
                      />
                      <div>
                        <p className="testimonial-author fw-bold mb-0">{testimonial.name}</p>
                        <p className="testimonial-role text-muted">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="testimonial-text">{testimonial.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
