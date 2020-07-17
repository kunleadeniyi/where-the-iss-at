import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Map from '../map/map'
import Footer from '../footer/footer'
import { Container, Row } from 'react-bootstrap';

class App extends Component {

  render () {
    return (
      <div>
        <Container fluid style={{height: "300px", padding: "0px"}}>
          <div className="banner_image" >
            <div className="banner_overlay"></div>
            <div>
              <h1 className="header_text justify-content-md-center">Where is the ISS?</h1>
            </div>
          </div>
        </Container>

        <Container fluid style={{position: "relative", padding: '0% 6%', backgroundColor: '#f4f5f6'}}>
          <Row className="justify-content-md-center" style={{position: "relative", top: "-40px", backgroundColor: "white"}}>
            <Map className="map" />
          </Row>
        </Container>
        
        <Footer />
      </div>
    )
  }
}

export default App;

