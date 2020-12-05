import Axios from "axios";


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

export const getAreaHistory = (area) => {
    return async dispatch => {

        Axios.get(process.env.REACT_APP_HISTORY_API +'/api/parking/stats/' + area.id)
            .then( function(response) {
                dispatch({
                    type: 'SET_AREA_HISTORY',
                    selectedHistory: response.data.parkingHistory,
                })
            })
            .catch( function(err) {
                dispatch({
                    type: 'SET_AREA_HISTORY',
                    selectedHistory: null
            })
        })
    }
}

export const getHistoryApi = () => {
    return async dispatch => {
        
        Axios.get(process.env.REACT_APP_HISTORY_API + '/api/parking/history/')
            .then( function(response) {
                dispatch({
                    type: 'GET_API_PARKING_HISTORY',
                    parkingHistory: response.data
                })
            })
            .catch( function(err) {
                console.warn(err);
            })
    }
}
