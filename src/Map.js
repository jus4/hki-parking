import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useStore } from "react-redux";
import {getAreaDetails, getAreaHistory, getHistoryApi } from './actions';
import ParkingDetails from './components/parkingDetails';
import ParkingHistory from './components/parkingHistory';
import HistoryToggle from './components/historyToggle';
import mapboxgl from 'mapbox-gl';
import hkiParkingAreas from './hki-parking-areas.json';
import ParkingStats from './parkingStats.json';
import classnames from 'classnames';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [areaDetails, setAreaDetails] = useState(false);
    const [sidebar, toggleSidebar] = useState(false);
    const [showHistory, toggleHistory] = useState(false);
    const dispatch = useDispatch();
    const store = useStore();
    const state = store.getState();

    // Add id to properties because mapbox does not allow non integer values for id
    const editedData = {...hkiParkingAreas}
    editedData.features = hkiParkingAreas.features.map( (feature) => {
        feature.properties.id = feature.id;
        const stats = ParkingStats.results.find(x => x.id === feature.id);
        if (stats) {
            feature.properties.stats = stats.current_parking_count;
        }

        return feature;
    })


    useEffect( () => {
        if (map) {
            map.resize();
        }
    }, [sidebar])

    useEffect(() => {
        dispatch(getHistoryApi());

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: process.env.REACT_APP_MAPBOX_STYLE ? process.env.REACT_APP_MAPBOX_STYLE : 'mapbox://styles/mapbox/light-v10',
            center: [24.951552974429124, 60.17154054607087],
            zoom:14
        })
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        map.on('load', () => {
            map.addSource('areas',{
                type:'geojson',
                promoteId: 'id',
                data: editedData,
            })

            map.addLayer({
                'id': 'park-boundary',
                'type': 'fill',
                'generatedId': true,
                'source': 'areas',
                'paint': {
                'fill-color': '#0501f7',
                'fill-opacity': 1
                },
                'filter': ['==', '$type', 'Polygon']
            });

            map.addLayer({
                'id': 'park-boundary-highlight',
                'type': 'fill',
                'generatedId': true,
                'source': 'areas',
                'paint': {
                'fill-color': 'red',
                'fill-opacity': 1,
                },
                'layout': {
                    'visibility': 'none'
                },
                'filter': ['==', '$type', 'Polygon']
            });

            setMap(map);

        });


        map.on('click', 'park-boundary', function (e) {
            const bbox = [
                [e.point.x - 5, e.point.y - 5],
                [e.point.x + 5, e.point.y + 5]
                ];

            const features = map.queryRenderedFeatures(bbox, {
                layers: ['park-boundary']
            });

            const filter = features.reduce(
                function (memo, feature) {
                    memo.push(feature.properties.id);
                    return memo;
                },
                ['in', 'id']
            );
            console.log(filter);



            map.setLayoutProperty('park-boundary-highlight', 'visibility', 'visible');
            map.setFilter('park-boundary-highlight', filter );

            setAreaDetails(features.shift());
           
            return () => map.remove();
            
        }, [editedData]);

             
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'park-boundary', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'park-boundary', function () {
            map.getCanvas().style.cursor = '';
        });

    }, []);

    useEffect( () => {
        if (areaDetails) {
            dispatch(getAreaDetails(areaDetails));
            dispatch(getAreaHistory(areaDetails));
        }
    }, [areaDetails]);

    const toggleMap = () => {
        toggleHistory( !showHistory);
        const parkingApiHistory = state.parkingHistory;
        const filter = [
            'in',
            'id'
        ];
        parkingApiHistory.forEach(element => {
            filter.push(element);
        });

        map.setFilter('park-boundary', !showHistory ?  filter : ['all'] );
    }

    return (
        <div className="main-container">
            <div className={classnames('main-sidebar', {closed: sidebar})}>
                <div className={classnames('main-sidebar-content', {hidden: sidebar})}>
                    <HistoryToggle 
                        selected = {showHistory}
                        toggleSelected = { () => toggleMap()}
                    />
                    <hr className="divider"/>
                    <h1>Helsinki<br/>Parking<br/>Areas</h1>
                    {!areaDetails &&
                        <h2>Please select parking area</h2>
                    }
                    { areaDetails &&
                        <ParkingDetails />
                    }
                    { areaDetails &&
                        <ParkingHistory />
                    }
                </div>

            </div>
            <div className={classnames('map-container', {wide: sidebar} )}>
                <div ref={mapContainerRef}  />
            </div>
        </div>
    )
}

export default Map;