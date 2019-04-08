import React from 'react';
import { storiesOf } from '@storybook/react';
import Calendar from '../Calendar';
import { mockEvents } from './mockData';
import 'antd/dist/antd.css';

import '../style/index.less';
import '../../Agenda/style/index.less';
import '../../Calendar/style/index.less';
import '../../DailyCalendar/style/index.less';
import '../../DatePicker/style/index.less';
import '../../DateSwitcher/style/index.less';
import '../../DayTimeLine/style/index.less';
import '../../EventContainer/style/index.less';
import '../../MonthDayView/style/index.less';
import '../../MonthlyCalendar/style/index.less';
import '../../MonthlyCalendarBody/style/index.less';
import '../../MonthlyCalendarHeader/style/index.less';
import '../../SingleDayView/style/index.less';
import '../../Tab/style/index.less';
import '../../ViewContainer/style/index.less';

storiesOf('Calendar 日历', module)
  .add('单日', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('多日', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('单周', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('多周', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('月', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('年', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('议程', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ))
  .add('计划', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} />
    </div>
  ));
