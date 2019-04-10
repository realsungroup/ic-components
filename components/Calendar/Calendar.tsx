import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getDateSectionOfMultiDay, getDatesOfMonthlyCalendar, parseStep } from '../utils/dateUtil';
import Tab from './Tab';
import DatePicker from './DatePicker';
import DateSwitcher from './DateSwitcher';
import ViewContainer from './ViewContainer';
import MonthlyCalendar from './MonthlyCalendar';
import Agenda from './Agenda';
import DailyCalendar from './DailyCalendar';

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

const dateSwitchSteps = {
  singleDay: '1:d',
  multiDay: '3:d',
  singleWeek: '1:w',
  multiWeek: '4:w',
  month: '1:M',
  year: '1:y',
};

export default class Calendar extends React.PureComponent<any, any> {
  static defaultProps = {
    defaultActiveTab: 'month',
    defaultMultiDays: 3,
    defaultAgendaDateRange: '1:M',
    onDateRangeChange: (dateRange) => { console.log(dateRange) }, // mock
  };
  switchSteps: { singleDay: string; multiDay: string; singleWeek: string; multiWeek: string; month: string; year: string; agenda: string; };

  constructor(props) {
    super(props);

    const { defaultActiveTab, defaultAgendaDateRange, defaultMultiDays } = props;

    const now = moment();
    let dateSwitchStep;
    if (defaultActiveTab === 'agenda') {
      dateSwitchStep = defaultAgendaDateRange;
    } else {
      dateSwitchStep = this.getDateSwitchStep(defaultActiveTab);
    }
    this.state = {
      datePickerDefaultValue: now,
      date: now.toDate(),
      activeTab: defaultActiveTab,
      dateSwitchStep,
      agendaDateRange: defaultAgendaDateRange,
      multiDays: defaultMultiDays,
    };
  }

  getDateSwitchStep = (activeTab) => {
    switch (activeTab) {
    case 'agenda':
      return this.state.agendaDateRange;
    default:
      return dateSwitchSteps[activeTab] || '1:M';
    }
  }

  getDateRange = (activeTab) => {
    const { date } = this.state;
    switch (activeTab) {
    case 'agenda': {
      const { agendaDateRange }  = this.state;
      const [stepValue, stepUnit] = parseStep(agendaDateRange);
      const start = moment(date).hour(0).minute(0).second(0).millisecond(0);
      const end = moment(start).add(stepValue, stepUnit).subtract(1, 'ms');
      return [start.toDate(), end.toDate()];
    }
    case 'singleDay': {
      const dayStartDate = new Date(date);
      dayStartDate.setHours(0, 0, 0, 0)
      const dayEndDate = new Date(date);
      dayEndDate.setHours(23, 59, 59, 999)
      return [dayStartDate, dayEndDate];
    }
    case 'multiDay': {
      const { multiDays }  = this.state;
      const [startDateOfMultiDay, endDateOfMultiDay] = getDateSectionOfMultiDay(date, multiDays);
      const multiDayStartDate = (new Date(startDateOfMultiDay));
      multiDayStartDate.setHours(0, 0, 0, 0)
      const multiDayEndDate = (new Date(endDateOfMultiDay));
      multiDayEndDate.setHours(23, 59, 59, 999)
      return [multiDayStartDate, multiDayEndDate];
    }
    case 'month':
    default: {
      const dates = getDatesOfMonthlyCalendar(date.getFullYear(), date.getMonth());
      const monthStartDate = new Date(dates[0]);
      monthStartDate.setHours(0, 0, 0, 0)
      const monthEndDate = new Date(dates[dates.length - 1]);
      monthEndDate.setHours(23, 59, 59, 999)
      return [monthStartDate, monthEndDate];
    }
    }
  }

  handleDateChange = value => {
    if (value) {
      this.setState({
        date: value.toDate(),
      }, this.handleDateRangeChange);
    }
  };

  handleDateSwitch = value => {
    if (value) {
      this.setState({
        date: value,
      }, this.handleDateRangeChange);
    }
  };

  handleTabSwitch = key => {
    this.setState({
      activeTab: key,
      dateSwitchStep: this.getDateSwitchStep(key),
    }, this.handleDateRangeChange);
  };

  handleAgendaDateRangeChange = value => {
    this.setState({ agendaDateRange: value }, () => {
      this.setState({ dateSwitchStep: this.getDateSwitchStep('agenda')});
      this.handleDateRangeChange();
    });
  };

  handleDateRangeChange = () => {
    const { onDateRangeChange } = this.props;
    if (typeof onDateRangeChange === 'function') {
      const { activeTab } = this.state;
      const dateRange = this.getDateRange(activeTab);
      onDateRangeChange(dateRange)
    }
  }

  render() {
    const { events } = this.props;
    const {
      date,
      datePickerDefaultValue,
      activeTab,
      dateSwitchStep,
      agendaDateRange,
      multiDays,
    } = this.state;
    const [startDateOfMultiDay, endDateOfMultiDay] = getDateSectionOfMultiDay(date, multiDays);

    return (
      <div className="ic-calendar">
        <div className="ic-calendar__header">
          <div className="ic-calendar__date-pickers">
            <DateSwitcher
              className="ic-calendar__date-switcher"
              step={dateSwitchStep}
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
            <Agenda
              startDate={date}
              dateRange={agendaDateRange}
              onDateRangeChange={this.handleAgendaDateRangeChange}
              events={events}
            />
          </ViewContainer>
        )}
        {activeTab === 'plan' && '计划'}
      </div>
    );
  }
}
