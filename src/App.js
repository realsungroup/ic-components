import React, { Component } from 'react';
import Calendar from './components/Calendar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Calendar />
      </div>
    );
  }
}

export default App;
