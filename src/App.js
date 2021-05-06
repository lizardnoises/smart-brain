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
      box: {},
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = (data) => {
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    const box = {
      left: boundingBox.left_col * width,
      top: boundingBox.top_row * height,
      right: width * (1 - boundingBox.right_col),
      bottom: height * (1 - boundingBox.bottom_row),
    };

    this.setState({ box: box });
  };

  onButtonSubmit = (event) => {
    this.setState({ imageUrl: this.state.input }, () => {
      app.models
        .predict(
          Clarifai.FACE_DETECT_MODEL,
          this.state.imageUrl
        )
        .then(this.calculateFaceLocation)
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
          box={this.state.box}
        />
      </div>
    );
  }
}

export default App;
