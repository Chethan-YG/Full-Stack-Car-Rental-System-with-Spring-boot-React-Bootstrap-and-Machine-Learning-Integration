import React from 'react';
import './footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-dark" width="100%">
      <footer id="section-footer" className="footer bg-black py-4">
        <div className="foot-container px-5">
          <div className="row d-flex justify-content-between">
            <div className="col-sm-4 my-4 info-section order-1 order-md-0">
              <a href="#" className="d-block mb-5 text-white fs-3">
                <img
                  src="https://i.postimg.cc/FRRBMB3H/QuickCar.png"
                  alt="Logo"
                  width="50px"
                  height="50px"
                /> QUICKCAR
              </a>
              <p className="fs-4 text-white">
                Plan Your Trip With QuickCar. <br />
                Rent a Car Online Today & Enjoy the Best Deals, Rates &
                Accessories.
              </p>
            </div>

            <div className="col-sm-4 mb-4 mt-5 order-0 order-md-1 text-md-start text-white fs-4">
              <h3 className="mb-5">Contact Us</h3>
              <p className="mb-1">
              <i className="bi bi-house me-3"></i> 4567, Brigade Road, Bangalore, <br/> <span className='ms-5'>Karnataka 560025</span>
              </p>
              <p className="mb-1">
              <i className="bi bi-telephone me-3"></i>(123) 456-7890
              </p>
              <p>
              <i className="bi bi-envelope me-3"></i> Info@demolink.org
              </p>
            </div>
          </div>
          <hr className="text-white" />
          <div className="row mb-0">
            <div className="col-12 text-center">
              <p className="text-white">
                © {currentYear} QUICKCAR. <a href="#" className='text-white'>All rights reserved</a>.
              </p>
              <p className="text-center text-white">
                Made by
                <a href="#" className="text-white fw-bold ms-2">
                  CHETHAN Y G
                </a>
             </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
