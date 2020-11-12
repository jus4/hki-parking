import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import {setMap} from './actions';
import Map from './Map';
import './App.css';

const App = (props) => {
  useEffect(() => {
    //props.setMap();
  },[]);

  return (
    <div className="App">
        <Map />
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setMap: () => {
      dispatch(setMap() );
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(App);
