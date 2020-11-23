import React from 'react';
import { useSelector } from 'react-redux';

const ParkingHistory = (props) => {
    const parkingHistory = useSelector(state => state.selectedHistory)
    if ( parkingHistory) {
        const history = parkingHistory.map( (element, key) => {
            return(
                <li key={key}>
                    Count: {element.parkingCount}
                    Date: {element.time}
                </li>
            )
        })
    }

    return(
        <div className="parking-history-container">
            <h2>History</h2>
            {!parkingHistory &&
                <p>No connection to parking history API</p>
            }
            <ul className="parking-history-list">
            { parkingHistory &&
                parkingHistory.map( ( element, key ) => {
                    let date = new Date(element.time).toLocaleString('fi-FI').split(' ')[0];
                    return(
                        <li key={key} className="parking-history-list-item">
                            <span className="parking-history-count">
                            Count: {element.parkingCount}
                            </span>
                            <span className="parking-history-date">
                            {date}
                            </span> 
                        </li>
                    )
                }) 
            }

            </ul>
        </div>
    )
}

export default ParkingHistory;