import React from 'react';
import { storiesOf } from '@storybook/react';
import EventBar from '../';

import '../style/index.less';
import './EventBar.less';

class EventBarTest extends React.Component {
  render() {
    return (
      <EventBar bgColor="#43d1e3" color="#fff" width={200} className="event-bar-test">
        tom
      </EventBar>
    );
  }
}

storiesOf('EventBar 事件条', module).add('事件条', () => <EventBarTest />);
