import React from 'react';
import { useSelector } from 'react-redux';

const HistoryToggle = (props) => {
    const { selected, toggleSelected } = props;
    return(
        <div className="history-toggle-container" onClick={props.toggleSelected}>
            <div className="history-toggle-label">Toggle history view </div>
            <div className={`history-toggle-select ${selected ? "active" : "disabled"}`} >
                {selected ? <span className="history-toggle-item active"></span> : <span className="history-toggle-item deactive"></span>}
            </div>
        </div>
    )
}

export default HistoryToggle;