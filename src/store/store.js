import { createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const INITIAL_STATE = {
    loading: false,
    error: null,
    selectedId:null,
    selectedParking: null,
    selectedCapacity: null
}

function hkiAreas(state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'SET_MAP':
            return state
        case 'SET_AREA_DETAILS':
            const updatedState = {...state}
            updatedState.selectedCapacity = action.payload.capacity;
            updatedState.selectedParking = action.payload.currentParking;
            updatedState.selectedId = action.payload.id;

            return updatedState;
        default:
            return state;
    }
}

const middleWare = [thunk];
 
export default createStore(hkiAreas, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleWare)) );

