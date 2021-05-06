import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'b20458da099c4cb79a73d3202896af1e',
});

const particlesParams = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocations = (data) => {
    const boundingBoxes = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);

    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    const boxes = boundingBoxes.map(bb => {
      return {
        left: bb.left_col * width,
        top: bb.top_row * height,
        right: width * (1 - bb.right_col),
        bottom: height * (1 - bb.bottom_row),
      };
    });

    this.setState({ boxes: boxes });
  };

  onButtonSubmit = (event) => {
    this.setState({ imageUrl: this.state.input }, () => {
      app.models
        .predict(
          Clarifai.FACE_DETECT_MODEL,
          this.state.imageUrl
        )
        .then(this.calculateFaceLocations)
        .catch(console.log);
    });
  };

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesParams} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition
          imageUrl={this.state.imageUrl}
          boxes={this.state.boxes}
        />
      </div>
    );
  }
}

export default App;
