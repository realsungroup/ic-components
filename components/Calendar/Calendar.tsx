import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getDateSectionOfMultiDay } from '../utils/dateUtil';
import Tab from './Tab';
import DatePicker from './DatePicker';
import DateSwitcher from './DateSwitcher';
import ViewContainer from './ViewContainer';
import MonthlyCalendar from './MonthlyCalendar';
import Agenda from './Agenda';
import DailyCalendar from './DailyCalendar';

const switchStepForMonthly = {
  unit: 'month',
  value: 1,
};

const tabs = [
  { key: 'singleDay', label: '单日', },
  { key: 'multiDay', label: '多日' },
  { key: 'singleWeek', label: '单周' },
  { key: 'multiWeek', label: '多周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
  { key: 'agenda', label: '议程' },
  { key: 'plan', label: '计划' },
];

const switchSteps = {
  singleDay: '1:d',
  multiDay: '3:d',
  singleWeek: '1:w',
  multiWeek: '4:w',
  month: '1:M',
  year: '1:y',
}

export default class Calendar extends React.PureComponent<any, any> {
  static defaultProps = {
    defaultActiveTab: 'month',
  };

  constructor(props) {
    super(props);

    const now = moment();
    this.state = {
      datePickerDefaultValue: now,
      date: now.toDate(),
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

  handleTabSwitch = key => {
    this.setState({ activeTab: key });
  };

  handleAgendaRangeChange = value => {
    console.log(value);
  };

  render() {
    const { events } = this.props;
    const { date, datePickerDefaultValue, activeTab } = this.state;
    const [startDateOfMultiDay, endDateOfMultiDay] = getDateSectionOfMultiDay(date, 3);

    return (
      <div className="ic-calendar">
        <div className="ic-calendar__header">
          <div className="ic-calendar__date-pickers">
            <DateSwitcher
              className="ic-calendar__date-switcher"
              step={switchSteps[activeTab] || '1:M'}
              value={date}
              onChange={this.handleDateSwitch}
            />
            <DatePicker defaultValue={datePickerDefaultValue} value={moment(date)} onChange={this.handleDateChange} />
          </div>
          <Tab onChange={this.handleTabSwitch} tabs={tabs} activeKey={activeTab} />
        </div>

        {activeTab === 'singleDay' && (
          <ViewContainer>
            <DailyCalendar startDate={date} endDate={date} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'multiDay' && (
          <ViewContainer>
            <DailyCalendar startDate={startDateOfMultiDay} endDate={endDateOfMultiDay} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'singleWeek' && '单周'}
        {activeTab === 'multiWeek' && '多周'}
        {activeTab === 'month' && (
          <ViewContainer>
            <MonthlyCalendar date={date} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'year' && '年'}
        {activeTab === 'agenda' && (
          <ViewContainer>
            <Agenda startDate={date} defaultRange="1:M" onRangeChange={this.handleAgendaRangeChange} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'plan' && '计划'}
      </div>
    );
  }
}
