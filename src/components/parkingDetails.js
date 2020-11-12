import React from 'react';
import { useSelector } from 'react-redux';

const ParkingDetails = (props) => {
    const parkingCapacity = useSelector(state => state.selectedCapacity)
    const currentParking = useSelector(state => state.selectedParking)

    return(
        <div className="parking-details-container">
            <div className="parking-details">
                <h3>Available parking spaces</h3>
                <p>{parkingCapacity}</p>                
            </div>
            <div className="parking-details">
                <h3>Current parking</h3>
                {currentParking}
            </div>
        </div>
    )
}

export default ParkingDetails;