import React, { useState, useEffect } from 'react';

const DriverPaymentModal = ({ show, handleClose, handleSubmit }) => {
  const [drivingTime, setDrivingTime] = useState('0');
  const [waitingTime, setWaitingTime] = useState('0');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) {
      setDrivingTime('0');
      setWaitingTime('0');
      setAmount(0);
      setError('');
    }
  }, [show]);

  const calculateAmount = (drivingTime, waitingTime) => {
    const drivingHours = parseFloat(drivingTime);
    const waitingHours = parseFloat(waitingTime);

    if (isNaN(drivingHours) || isNaN(waitingHours) || drivingHours < 0 || waitingHours < 0) {
      setError('Please enter valid positive numbers for driving and waiting time.');
      return 0;
    }

    let totalAmount = 0;

    if (drivingHours > 0) {
      totalAmount += 300;
      if (drivingHours > 2) {
        totalAmount += (drivingHours - 2) * 100;
      }
    }

    if (waitingHours > 0) {
      if (waitingHours > 0.5) {
        totalAmount += (waitingHours - 0.5) * 50;
      }
    }

    setError('');
    return totalAmount;
  };

  const onSubmit = () => {
    const calculatedAmount = calculateAmount(drivingTime, waitingTime);
    if (calculatedAmount > 0) {
      setAmount(calculatedAmount);
      handleSubmit(calculatedAmount);
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="driverPaymentModalLabel"
      aria-describedby="driverPaymentModalDesc"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-danger rounded-0">
          <div className="modal-header text-white">
            <h5 id="driverPaymentModalLabel" className="modal-title fw-bold text-dark fs-3">
              Enter Driving and Waiting Time
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body bg-light" id="driverPaymentModalDesc">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
              <label htmlFor="drivingTime" className="font-weight-bold">
                Driving Time (hours):
              </label>
              <input
                id="drivingTime"
                type="number"
                className="form-control fs-4 rounded-0"
                placeholder="Enter driving time"
                value={drivingTime}
                onChange={(e) => setDrivingTime(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="waitingTime" className="font-weight-bold">
                Waiting Time (hours):
              </label>
              <input
                id="waitingTime"
                type="number"
                className="form-control fs-4 rounded-0"
                placeholder="Enter waiting time"
                value={waitingTime}
                onChange={(e) => setWaitingTime(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group mt-3">
              <label className="font-weight-bold">Calculated Amount: ₹{amount}</label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="dash-button rounded-0 fs-3 px-5 py-2"
              onClick={onSubmit}
            >
              CheckOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPaymentModal;
