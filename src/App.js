import React, { Component } from 'react';
import Calendar from './components/Calendar';
import './App.css';

import { mockEvents } from './mockData';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Calendar events={mockEvents} />
      </div>
    );
  }
}

export default App;
