import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'moment/locale/zh-cn';
import { getDateSectionOfMultiDay, getDateSectionOfSingleWeek, getDatesOfMonthlyCalendar, parseStep } from '../utils/dateUtil';
import Tab from './Tab';
import DatePicker from './DatePicker';
import DateSwitcher from './DateSwitcher';
import ViewContainer from './ViewContainer';
import MonthlyCalendar from './MonthlyCalendar';
import Agenda from './Agenda';
import DailyCalendar from './DailyCalendar';
import Plan from './Plan';

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

const dateSwitchSteps = {
  singleDay: '1:d',
  multiDay: '3:d',
  singleWeek: '1:w',
  multiWeek: '4:w',
  month: '1:M',
  year: '1:y',
};

export default class Calendar extends React.PureComponent<any, any> {
  static propTypes = {
    /**
     * 日历事件
     * 默认：-
     */
    events: PropTypes.array.isRequired,

    /**
     * 默认激活的 tab
     * 默认值：'month'
     */
    defaultActiveTab: PropTypes.oneOf([
      'singleDay',
      'multiDay',
      'singleWeek',
      'multiWeek',
      'month',
      'year',
      'agenda',
      'plan',
    ]),
    /**
     * 默认多日天数
     * 默认值：3
     */
    defaultMultiDays: PropTypes.number,

    /**
     * 议程中默认日期范围值
     * 默认值：'1:M'
     */
    defaultAgendaDateRange: PropTypes.oneOf(['1:d', '1:w', '2:w', '1:M', '2:M', '3:M', '6:M', '1:y']),

    /**
     * 计划中默认的步长
     * 默认：'1:d'
     */
    defaultPlanSwitchStep: PropTypes.oneOf(['1:d']),
  };

  static defaultProps = {
    defaultActiveTab: 'month',
    defaultMultiDays: 3,
    defaultAgendaDateRange: '1:M',
    onDateRangeChange: dateRange => {
      // console.log(dateRange);
    }, // mock
    singleWeekStartDay: 1,
  };

  switchSteps: {
    singleDay: string;
    multiDay: string;
    singleWeek: string;
    multiWeek: string;
    month: string;
    year: string;
    agenda: string;
  };

  constructor(props) {
    super(props);

    const { defaultActiveTab, defaultAgendaDateRange, defaultPlanSwitchStep, defaultMultiDays } = props;

    const now = moment();

    let dateSwitchStep;
    if (defaultActiveTab === 'agenda') {
      dateSwitchStep = defaultAgendaDateRange;
    } else if (defaultActiveTab === 'plan') {
      dateSwitchStep = defaultPlanSwitchStep;
    } else {
      dateSwitchStep = this.getDateSwitchStep(defaultActiveTab);
    }

    this.initVariables(props);

    this.state = {
      datePickerDefaultValue: now,
      date: now.toDate(), // 原生 Date 对象，表示选中的某一天
      activeTab: defaultActiveTab,
      dateSwitchStep,
      agendaDateRange: defaultAgendaDateRange,
      multiDays: defaultMultiDays,
    };
  }

  private agendaSwitchStep: string; // 议程切换步长
  private planSwitchStep: string; // 计划切换步长

  initVariables = props => {
    const { defaultAgendaDateRange, defaultPlanSwitchStep } = props;
    this.agendaSwitchStep = defaultAgendaDateRange;
    this.planSwitchStep = defaultPlanSwitchStep;
  };

  getPlanEvents = events => {
    let retEvents = [];
    events.forEach(event => {
      const index = retEvents.findIndex(item => item.type === event.category_name);
      if (index !== -1) {
        retEvents[index].events.push(event);
      } else {
        retEvents.push({ type: event.category_name, events: [event] });
      }
    });
    return retEvents;
  };

  getDateSwitchStep = activeTab => {
    switch (activeTab) {
    case 'agenda':
      return this.agendaSwitchStep;
    case 'plan':
      return this.planSwitchStep;
    default:
      return dateSwitchSteps[activeTab] || '1:M';
    }
  };

  getDateRange = activeTab => {
    const { date } = this.state;
    switch (activeTab) {
    case 'agenda': {
      const { agendaDateRange } = this.state;
      const [stepValue, stepUnit] = parseStep(agendaDateRange);
      const start = moment(date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const end = moment(start)
        .add(stepValue, stepUnit)
        .subtract(1, 'ms');
      return [start.toDate(), end.toDate()];
    }
    case 'singleDay': {
      const dayStartDate = new Date(date);
      dayStartDate.setHours(0, 0, 0, 0);
      const dayEndDate = new Date(date);
      dayEndDate.setHours(23, 59, 59, 999);
      return [dayStartDate, dayEndDate];
    }
    case 'multiDay': {
      const { multiDays } = this.state;
      return getDateSectionOfMultiDay(date, multiDays);
    }
    case 'singleWeek': {
      const { singleWeekStartDay } = this.props;
      const weekDayOffset = -singleWeekStartDay;
      return getDateSectionOfSingleWeek(date, weekDayOffset);
    }
    case 'month':
    default: {
      const dates = getDatesOfMonthlyCalendar(date.getFullYear(), date.getMonth());
      const monthStartDate = new Date(dates[0]);
      monthStartDate.setHours(0, 0, 0, 0);
      const monthEndDate = new Date(dates[dates.length - 1]);
      monthEndDate.setHours(23, 59, 59, 999);
      return [monthStartDate, monthEndDate];
    }
    }
  };

  handleDateChange = value => {
    if (value) {
      this.setState(
        {
          date: value.toDate(),
        },
        this.handleDateRangeChange
      );
    }
  };

  handleDateSwitch = value => {
    if (value) {
      this.setState(
        {
          date: value,
        },
        this.handleDateRangeChange
      );
    }
  };

  handleTabSwitch = key => {
    this.setState(
      {
        activeTab: key,
        dateSwitchStep: this.getDateSwitchStep(key),
      },
      this.handleDateRangeChange
    );
  };

  handleAgendaDateRangeChange = value => {
    this.setState({ agendaDateRange: value }, () => {
      this.setState({ dateSwitchStep: this.getDateSwitchStep('agenda') });
      this.handleDateRangeChange();
    });
  };

  handleDateRangeChange = () => {
    const { onDateRangeChange } = this.props;
    if (typeof onDateRangeChange === 'function') {
      const { activeTab } = this.state;
      const dateRange = this.getDateRange(activeTab);
      onDateRangeChange(dateRange);
    }
  };

  render() {
    const { events, singleWeekStartDay } = this.props;
    const { date, datePickerDefaultValue, activeTab, dateSwitchStep, agendaDateRange, multiDays } = this.state;
    const [startDateOfMultiDay, endDateOfMultiDay] = getDateSectionOfMultiDay(date, multiDays);
    const weekDayOffset = -singleWeekStartDay;
    const [startDateOfSingleWeek, endDateOfSingleWeek] = getDateSectionOfSingleWeek(date, weekDayOffset);

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
            <DailyCalendar activeDate={date} startDate={startDateOfMultiDay} endDate={endDateOfMultiDay} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'singleWeek' && (
          <ViewContainer>
            <DailyCalendar activeDate={date} startDate={startDateOfSingleWeek} endDate={endDateOfSingleWeek} events={events} />
          </ViewContainer>
        )}
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
        {activeTab === 'plan' && (
          <ViewContainer>
            <Plan selectedDate={date} events={this.getPlanEvents(events)} />
          </ViewContainer>
        )}
      </div>
    );
  }
}
