import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useStore } from "react-redux";
import {getAreaDetails} from './actions';
import ParkingDetails from './components/parkingDetails';
import mapboxgl from 'mapbox-gl';
import testDataLarge from './testDataLarge.json';
import ParkingStats from './parkingStats.json';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
    const mapContainerRef = useRef(null);
    const [areaDetails, setAreaDetails] = useState(false);
    const dispatch = useDispatch();
    const store = useStore();
    const state = store.getState();

    // Add id to properties because mapbox does not allow non integer values for id
    const editedData = {...testDataLarge}
    editedData.features = testDataLarge.features.map( (feature) => {
        feature.properties.id = feature.id;
        const stats = ParkingStats.results.find(x => x.id === feature.id);
        if (stats) {
            feature.properties.stats = stats.current_parking_count;
        }


        return feature;
    });


    useEffect(() => {
        const map = new mapboxgl.Map({
            //accessToken : process.env.MAPBOX_ACCESS_TOKEN,
            container: mapContainerRef.current,
            style: 'mapbox://styles/jus4/ckgtpwvbk1aad19p6ysmpz9bb',
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
            map.setLayoutProperty('park-boundary-highlight', 'visibility', 'visible');
            map.setFilter('park-boundary-highlight', filter );

            setAreaDetails(features.shift());
            
        });

             
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'park-boundary', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
         
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'park-boundary', function () {
            map.getCanvas().style.cursor = '';
        });

    });

    useEffect( () => {
        if (areaDetails) {
            dispatch(getAreaDetails(areaDetails));
        }
    }, [areaDetails, dispatch]);


    return (
        <div>
            <div ref={mapContainerRef}  />
            { areaDetails &&
                <ParkingDetails state={state} />
            }
        </div>
    )
}

export default Map;