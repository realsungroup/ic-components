import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Dropdown } from 'antd';
import { getDateSectionOfMultiDay, getDateSectionOfSingleWeek, getMultiWeeks, parseStep } from '../utils/dateUtil';
import { normalizeEvents, isTotalDayEvent } from '../utils/eventUtil';
import Tab from './Tab';
import DatePicker from './DatePicker';
import DateSwitcher from './DateSwitcher';
import ViewContainer from './ViewContainer';
import MonthlyCalendar from './MonthlyCalendar';
import Agenda from './Agenda';
import DailyCalendar from './DailyCalendar';
import YearCalendar from './YearCalendar';
import Plan from './Plan';
import enquire from 'enquire.js';

const { Option } = Select;

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
  plan: '1:d',
};

function getTabLabelByKey(tabs, key) {
  return tabs.find(tab => tab.key === key).label;
}

export default class Calendar extends React.PureComponent<any, any> {
  static propTypes = {
    // --- 通用
    /**
     * 日历事件
     * 默认值：-
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
     * 组件的高度
     * 默认值：-
     */
    height: PropTypes.number,

    /**
     * 事件过滤关键字
     * 默认值：-
     */
    eventKeyword: PropTypes.string,

    /**
     * 时间范围变化事件
     * 函数签名：onDateRangeChange(startDate: Date, endDate: Date): void
     * 默认值：-
     */
    onDateRangeChange: PropTypes.func,
    // --- //

    // --- 单日、多日、单周、计划视图
    /**
     * 时间轴范围
     * 默认值：['08:00', '18:00']
     */
    defaultDayTimeLineRange: PropTypes.arrayOf(PropTypes.string),
    // --- //

    // --- 单日视图
    // --- //

    // --- 多日视图
    /**
     * 默认多日天数
     * 默认值：3
     */
    defaultMultiDays: PropTypes.number,
    // --- //

    // --- 单周视图
    /**
     * 单周视图一周开始日，0 表示周日
     * 默认值：1
     */
    singleWeekStartDay: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    // --- //

    // --- 多周
    /**
     * 默认多周周数
     * 默认值：4
     */
    defaultMultiWeeks: PropTypes.number,

    /**
     * 多周周数上限
     * 默认值：10
     */
    maxMultiWeeks: PropTypes.number,
    // --- //

    // --- 月视图
    // --- //

    // --- 年视图
    // --- //

    // --- 议程视图
    /**
     * 议程默认日期范围
     * 默认值：'1:M'
     */
    defaultAgendaDateRange: PropTypes.oneOf(['1:d', '1:w', '2:w', '1:M', '2:M', '3:M', '6:M', '1:y']),
    // --- //

    // --- 计划视图
    // --- //
  };

  static defaultProps = {
    defaultActiveTab: 'month',
    defaultDayTimeLineRange: ['08:00', '18:00'],
    singleWeekStartDay: 1,
    defaultMultiDays: 3,
    defaultMultiWeeks: 4,
    maxMultiWeeks: 10,
    defaultAgendaDateRange: '1:M',
  };

  constructor(props) {
    super(props);

    const { defaultActiveTab, defaultAgendaDateRange, defaultMultiDays, defaultMultiWeeks, maxMultiWeeks } = props;

    this.multiWeeksOptions = Array.from({ length: maxMultiWeeks }, (_, index) => index + 1);

    const now = moment();

    let dateSwitchStep;
    if (defaultActiveTab === 'agenda') {
      dateSwitchStep = defaultAgendaDateRange;
    } else {
      dateSwitchStep = this.getDateSwitchStep(defaultActiveTab);
    }

    this.state = {
      contentViewHeight: undefined,
      datePickerDefaultValue: now,
      date: now.toDate(), // 原生 Date 对象，表示选中的某一天
      activeTab: defaultActiveTab,
      dateSwitchStep,
      agendaDateRange: defaultAgendaDateRange,
      multiDays: defaultMultiDays,
      multiWeeks: defaultMultiWeeks,
      switchComponent: 'Tab', // 切换 “单日”、“多日” 等，使用的组件；'Tab' 表示使用 Tab 组件；'Dropdown' 表示使用下拉组件
      viewsVisible: {
        // 视图是否显示
        singleDay: true,
        multiDay: true,
        singleWeek: true,
        multiWeek: true,
        month: true,
        year: true,
        agenda: true,
        plan: true,
      },
    };
  }

  componentDidMount = () => {
    // 小于 768 px 时，使用下拉菜单组件；否则使用 Tab 组件
    enquire.register('screen and (max-width:768px)', {
      match: () => {
        this.setState({
          switchComponent: 'Dropdown',
          viewsVisible: {
            ...this.state.viewsVisible,
            year: false,
          },
        });
      },
      unmatch: () => {
        this.setState({ switchComponent: 'Tab' });
      },
      // Keep a empty destory to avoid triggering unmatch when unregister
      destroy() {},
    });

    let contentViewHeight = this.props.height;
    const {
      headerRef: { current: headerElement },
    } = this;
    if (headerElement) {
      const headerHeight = headerElement.offsetHeight;
      contentViewHeight = contentViewHeight - headerHeight;
    }
    this.setState({ contentViewHeight });
  };

  private multiWeeksOptions: number[];
  private headerRef: any = React.createRef();

  getDateSwitchStep = activeTab => {
    switch (activeTab) {
    case 'agenda':
      return this.state.agendaDateRange;
    default:
      return dateSwitchSteps[activeTab] || '1:M';
    }
  };

  getDateRange = (activeTab: string) => {
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
    case 'singleDay':
    case 'plan': {
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
    case 'multiWeek': {
      const { multiWeeks } = this.state;
      const multiWeekDatesGroup = getMultiWeeks(date, multiWeeks);
      const multiWeekStartDate = multiWeekDatesGroup[0][0];
      const multiWeekEndDate = multiWeekDatesGroup[multiWeekDatesGroup.length - 1][6];
      multiWeekEndDate.setHours(23, 59, 59, 999);
      return [multiWeekStartDate, multiWeekEndDate];
    }
    case 'year': {
      const year = moment(date);
      const yearStartDate = year.startOf('year').toDate();
      const yearEndDate = year.endOf('year').toDate();
      return [yearStartDate, yearEndDate];
    }
    case 'month':
    default: {
      const monthDate = moment([date.getFullYear(), date.getMonth()]);
      const monthStartDate = monthDate.startOf('month').toDate();
      const monthEndDate = monthDate.endOf('month').toDate();
      monthEndDate.setHours(23, 59, 59, 999);
      return [monthStartDate, monthEndDate];
    }
    }
  };

  getEvents() {
    const { activeTab } = this.state;
    const { eventKeyword, events } = this.props;
    const [rangeStart, rangeEnd] = this.getDateRange(activeTab);
    const eventsInDateRange = normalizeEvents(events)
      .filter(event => {
        const { startTime, endTime } = event;
        return isTotalDayEvent(event) || (startTime >= rangeStart && endTime <= rangeEnd);
      })

    if (!eventKeyword) {
      return eventsInDateRange;
    }

    return eventsInDateRange.filter((event) => {
      const { original: originalEvent } = event;
      for(let field in originalEvent) {
        if (originalEvent.hasOwnProperty(field)) {
          const fieldValue = originalEvent[field];
          const result = typeof fieldValue === 'string' && fieldValue.includes(eventKeyword);
          if (result) {
            return result;
          }
        }
      }
      return false
    })
  }

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

  handleMultiWeeksChange = n => {
    this.setState({ multiWeeks: n });
  };

  handleDateRangeChange = () => {
    const { onDateRangeChange } = this.props;
    if (typeof onDateRangeChange === 'function') {
      const { activeTab } = this.state;
      const dateRange = this.getDateRange(activeTab);
      onDateRangeChange(dateRange);
    }
  };

  renderMenu = () => {
    return (
      <div className="ic-calendar__dropdown-menu">
        {tabs
          .map(tab => {
            const visible = this.state.viewsVisible[tab.key];
            console.log({ visible });
            return (
              visible && (
                <div
                  className="ic-calendar__dropdown-menu-item"
                  key={tab.key}
                  onClick={() => this.handleTabSwitch(tab.key)}
                >
                  {tab.label}
                </div>
              )
            );
          })
          .filter(Boolean)}
      </div>
    );
  };

  render() {
    const {
      singleWeekStartDay,
      height,
      defaultDayTimeLineRange,
    } = this.props;
    const {
      date,
      datePickerDefaultValue,
      activeTab,
      dateSwitchStep,
      agendaDateRange,
      multiDays,
      multiWeeks,
      switchComponent,
      contentViewHeight,
    } = this.state;
    const [startDateOfMultiDay, endDateOfMultiDay] = getDateSectionOfMultiDay(date, multiDays);
    const weekDayOffset = -singleWeekStartDay;
    const [startDateOfSingleWeek, endDateOfSingleWeek] = getDateSectionOfSingleWeek(date, weekDayOffset);
    const multiWeekDatesGroup = getMultiWeeks(date, multiWeeks);
    const events = this.getEvents();

    return (
      <div style={{ height }} className="ic-calendar">
        <div ref={this.headerRef} className="ic-calendar__header">
          <div className="ic-calendar__date-pickers">
            <DateSwitcher
              className="ic-calendar__date-switcher"
              step={dateSwitchStep}
              value={date}
              onChange={this.handleDateSwitch}
            />
            <DatePicker defaultValue={datePickerDefaultValue} value={moment(date)} onChange={this.handleDateChange} />
            {activeTab === 'multiWeek' && (
              <div className="ic-calendar__multi-weeks-select">
                <Select value={multiWeeks} onChange={this.handleMultiWeeksChange}>
                  {this.multiWeeksOptions.map(n => (
                    <Option key={n} value={n}>
                      {n}
                    </Option>
                  ))}
                </Select>
                <span>周</span>
              </div>
            )}
          </div>
          {switchComponent === 'Tab' ? (
            <Tab onChange={this.handleTabSwitch} tabs={tabs} activeKey={activeTab} />
          ) : (
            <Dropdown overlay={this.renderMenu()}>
              <div className="ic-calendar__dropdown">{getTabLabelByKey(tabs, activeTab)}</div>
            </Dropdown>
          )}
        </div>

        {activeTab === 'singleDay' && (
          <ViewContainer height={contentViewHeight}>
            <DailyCalendar timeLineRange={defaultDayTimeLineRange} startDate={date} endDate={date} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'multiDay' && (
          <ViewContainer height={contentViewHeight}>
            <DailyCalendar
              timeLineRange={defaultDayTimeLineRange}
              activeDate={date}
              startDate={startDateOfMultiDay}
              endDate={endDateOfMultiDay}
              events={events}
            />
          </ViewContainer>
        )}
        {activeTab === 'singleWeek' && (
          <ViewContainer height={contentViewHeight}>
            <DailyCalendar
              timeLineRange={defaultDayTimeLineRange}
              activeDate={date}
              startDate={startDateOfSingleWeek}
              endDate={endDateOfSingleWeek}
              events={events}
            />
          </ViewContainer>
        )}
        {activeTab === 'multiWeek' && (
          <ViewContainer>
            <MonthlyCalendar grayDayOfOtherMonths={false} weeks={multiWeekDatesGroup} date={date} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'month' && (
          <ViewContainer>
            <MonthlyCalendar date={date} events={events} />
          </ViewContainer>
        )}
        {activeTab === 'year' && (
          <ViewContainer>
            <YearCalendar date={date} events={events} />
          </ViewContainer>
        )}
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
          <ViewContainer height={contentViewHeight}>
            <Plan height={contentViewHeight} timeLineRange={defaultDayTimeLineRange} selectedDate={date} events={events} />
          </ViewContainer>
        )}
      </div>
    );
  }
}
