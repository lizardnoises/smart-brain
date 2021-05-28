import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'sign-in',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
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
      fetch('https://agile-dawn-08811.herokuapp.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: this.state.imageUrl }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            fetch('https://agile-dawn-08811.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: this.state.user.id }),
            })
              .then((response) => response.json())
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              })
              .catch(console.log);
            this.calculateFaceLocations(response);
          }
        })
        .catch(console.log);
    });
  };

  onRouteChange = (route) => {
    if (route === 'sign-out') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    const { name, entries } = this.state.user;
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
            <Rank name={name} entries={entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
          </div>
        ) : route === 'register' ? (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        ) : (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )}
      </div>
    );
  }
}

export default App;
