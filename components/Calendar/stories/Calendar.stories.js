import React from 'react';
import { storiesOf } from '@storybook/react';
import Calendar from '../Calendar';
import { mockEvents } from './mockData';
import 'antd/dist/antd.css';

import '../style/index.less';

const stories = storiesOf('Calendar 日历', module);

const DesktopWrap = ({ children }) => {
  return (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>{children}</div>
  );
};

stories
  .add('单日（PC 端）', () => (
    <DesktopWrap>
      <Calendar events={mockEvents} defaultActiveTab="singleDay" />
    </DesktopWrap>
  ))
  .add(
    '单日（移动端）',
    () => (
      <div>
        <Calendar events={mockEvents} defaultActiveTab="singleDay" />
      </div>
    ),
    { viewport: { defaultViewport: 'iphone5' } }
  )
  .add('多日（PC 端）', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar height={600} events={mockEvents} defaultActiveTab="multiDay" />
    </div>
  ))
  .add(
    '多日（移动端）',
    () => (
      <div>
        <Calendar events={mockEvents} defaultActiveTab="multiDay" />
      </div>
    ),
    { viewport: { defaultViewport: 'iphone5' } }
  )
  .add('单周', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="singleWeek" />
    </div>
  ))
  .add('多周', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="multiWeek" />
    </div>
  ))
  .add('月', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="month" />
    </div>
  ))
  .add('年', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="year" />
    </div>
  ))
  .add('议程', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="agenda" />
    </div>
  ))
  .add('计划（PC 端）', () => (
    <div style={{ height: '100vh', padding: '20px 40px', background: '#f5f5f5', overflowY: 'auto' }}>
      <Calendar events={mockEvents} defaultActiveTab="plan" />
    </div>
  ))
  .add('计划（移动 端）', () => <Calendar events={mockEvents} defaultActiveTab="plan" />, {
    viewport: { defaultViewport: 'iphone5' },
  });
