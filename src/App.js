import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      },
    };
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocations = (data) => {
    const boundingBoxes = data.outputs[0].data.regions.map(
      (region) => region.region_info.bounding_box
    );

    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    const boxes = boundingBoxes.map((bb) => {
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
        .predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
        .then(this.calculateFaceLocations)
        .catch(console.log);
    });
  };

  onRouteChange = (route) => {
    if (route === 'sign-out') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesParams} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
          </div>
        ) : route === 'sign-in' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
