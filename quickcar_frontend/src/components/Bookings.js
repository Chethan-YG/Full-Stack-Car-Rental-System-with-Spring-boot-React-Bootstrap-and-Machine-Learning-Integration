import React from 'react';
import BookingCard from './BookingCard';
import HiringCard from './HiringCard';


const Bookings = () => {

  return (
    <div className="bookings-container">
      <BookingCard/>
      <HiringCard/>
    </div>
  );
};

export default Bookings;
