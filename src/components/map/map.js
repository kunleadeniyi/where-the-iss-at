import React, { Component } from 'react';
import './mapbox.css';
import './map.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { Container, Row, Col, Table } from 'react-bootstrap';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            centerMap: true,    
            lng: 5,
            lat: 34,
            zoom: 2,
            satelliteParams: []
        };
        this.handleChecked = this.handleChecked.bind(this);
    }

    /* fetch data from the ISS api */ 
    async getISS() {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        const data = await response.json();
    
        return data
    }; 

    /* toggle centerMap state with checkbox */
    handleChecked () {
        this.setState({centerMap: !this.state.centerMap});
    }

    /* Mount map */ 
    componentDidMount() {
        const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.state.lng, this.state.lat],
        zoom: this.state.zoom
        });

        var marker = new mapboxgl.Marker({element: this.marker})
            .setLngLat([12.550343, 55.665957])
            .addTo(map);
        
        map.on('load', () => {
            map.resize()
        })

        map.on('move', () => {
            this.setState({
            zoom: map.getZoom().toFixed(2)
            });
        });

        this.intervalID = setInterval(
            () => this.getISS().then(data => {
                // adding fetched data to the component satelliteParams variable
                // eslint-disable-next-line array-callback-return
                Object.keys(data).map(() => {
                    this.setState({satelliteParams: Object.entries(data)});
                });
                // update state values with fetched data
                this.setState({
                    lng: data.longitude,
                    lat: data.latitude
                });        
                marker.setLngLat([data.longitude, data.latitude]) /* set marker at new longitude and latitude */
                if (this.state.centerMap) { /* Checkbox function */
                    map.flyTo({center: [data.longitude, data.latitude], zoom: this.state.zoom});
                }
            }),
            3000
        );
        
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    
    render() {
        return (
            
            <Container fluid style={{padding: "6% 5%"}}>
            <Row>
                <Col xs={12} md={8}>
                    <div ref={el => this.mapContainer = el} className="mapContainer" style={{ height: '480px', width: '100%' }}/>
                    
                    <div ref={el => this.marker = el} className='marker'></div>  

                    <div className='sidebarStyle'>
                        <div>Longitude: {this.state.lng.toFixed(2)} | Latitude: {this.state.lat.toFixed(2)} | Zoom: {this.state.zoom}</div>
                    </div>
                </Col>
                
                <Col xs={12} md={4}>
                    
                    <Table striped hover size="sm">
                        <tbody>
                            <tr>
                                <td>
                                    <label for="centre-iss">Centre ISS</label>
                                    <input type="checkbox" id="centre-iss" name="centre-iss" onChange={this.handleChecked} checked={this.state.centerMap}/>
                                </td>
                                <td> </td>
                            </tr>
                            {
                            this.state.satelliteParams.map((parameter) => (
                                (typeof parameter[1] !== 'number') 
                                ? <tr><td>{parameter[0]}</td> <td>{parameter[1]}</td></tr>
                                : <tr><td>{parameter[0]}</td> <td>{parameter[1].toFixed(2)}</td></tr>
                            ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            </Container>
            
        )
    }
}


export default Map