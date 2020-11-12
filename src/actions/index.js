import Axios from "axios";

export const setMap = () => {
    console.log('action');
    return dispatch  => {
        Axios.get('https://pubapi.parkkiopas.fi/public/v1/parking_area/', {
            params : {page_size: 2000}
        }).then(res => {
            dispatch({type: 'SET_MAP', payload: res.data})            
        }).catch(err => {
            console.log(err);
        })
    }
}

export const getAreaDetails = (area) => {
    return async dispatch => {
        Axios.get('https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/' + area.id)
            .then(function (response) {
                // handle success
                dispatch({type: 'SET_AREA_DETAILS', payload: {
                    currentParking: response.data.current_parking_count,
                    id: response.data.id,
                    capacity: area.properties.capacity_estimate
                }})
            })
            .catch(function (error) {
                console.log(error);
    
            })
    }
}