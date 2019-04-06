import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { allocateDailyEvents } from '../../utils/eventUtil';
import MonthlyCalendar from '../MonthlyCalendar';
import MonthDayView from '../MonthDayView';
import DateSwitcher from '../DateSwitcher';
import Tab from '../Tab';
import styles from './Calendar.module.css';

import { mockEvents } from './mockData';

const events = allocateDailyEvents(mockEvents);

const switchStepForMonthly = {
  unit: 'month',
  value: 1,
};

const tabs = [
  { key: 'singleDay', label: '单日' },
  { key: 'multiDay', label: '多日' },
  { key: 'singleWeek', label: '单周' },
  { key: 'multiWeek', label: '多周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
  { key: 'agenda', label: '议程' },
  { key: 'plan', label: '计划' },
];

export default class Calendar extends React.PureComponent {
  static defaultProps = {
    defaultActiveTab: 'month',
  };

  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      datePickerDefaultValue: moment(now),
      date: now,
      activeTab: props.defaultActiveTab,
    };
  }

  handleDateChange = value => {
    if (value) {
      this.setState({
        date: value.toDate(),
      });
    }
  };

  handleDateSwitch = value => {
    if (value) {
      this.setState({
        date: value,
      });
    }
  };

  switchTab = key => {
    this.setState({ activeTab: key });
  };

  render() {
    const { date, datePickerDefaultValue, activeTab } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.datePickers}>
            <DateSwitcher
              className={styles.dateSwitcher}
              step={switchStepForMonthly}
              value={date}
              onChange={this.handleDateSwitch}
            />
            <DatePicker defaultValue={datePickerDefaultValue} value={moment(date)} onChange={this.handleDateChange} />
          </div>
          <Tab onChange={this.switchTab} tabs={tabs} activeKey={activeTab} />
        </div>
        {activeTab === 'singleDay' && '单日'}
        {activeTab === 'multiDay' && '多日'}
        {activeTab === 'singleWeek' && '单周'}
        {activeTab === 'multiWeek' && '多周'}
        {activeTab === 'month' && (
          <MonthlyCalendar date={date} dayViewParams={events} dayViewComponent={MonthDayView} />
        )}
        {activeTab === 'year' && '年'}
        {activeTab === 'agenda' && '议程'}
        {activeTab === 'plan' && '计划'}
      </div>
    );
  }
}
