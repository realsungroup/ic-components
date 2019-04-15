import React from 'react';
import classnames from 'classnames';
import { getWeekDayIdsByOffset, getDatesOfYearCalendar, getLengthOfMonth } from '../../utils/dateUtil';
import { allocateDailyEvents } from '../../utils/eventUtil';
import MonthDayView from '../MonthDayView';

const weekDayIds = getWeekDayIdsByOffset();
const weekDayIdLabelMap = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
}
const headerWeeks = [...weekDayIds, ...weekDayIds, ...weekDayIds, ...weekDayIds, ...weekDayIds, ...weekDayIds];

export default class YearCalendar extends React.PureComponent<any, any> {
  state = {
    singleDayWidth: undefined,
  }

  componentDidMount() {
    const year = this.props.date.getFullYear();
    const [dates, maxDaysOfMonth] = getDatesOfYearCalendar(year);
    const { headerRef, headerTitleRef } = this;
    const rowTitleWidth = headerTitleRef.current.offsetWidth;
    const rowWidth = headerRef.current.offsetWidth;
    this.setState({
      singleDayWidth: Math.floor((rowWidth - rowTitleWidth) / maxDaysOfMonth),
    })
  }

  headerRef: any = React.createRef();
  headerTitleRef: any = React.createRef();

  isFirstDayOfSection = date => date.getDate() === 1;

  getDaysToLastDayOfSection = (date, month) => {
    const year = this.props.date.getFullYear();
    const lengthOfMonth = getLengthOfMonth(year, month);
    return lengthOfMonth - 1 - date.getDay();
  }

  render() {
    const { singleDayWidth } = this.state;
    const { date, events } = this.props;
    const year = date.getFullYear();
    const [dates, maxDaysOfMonth] = getDatesOfYearCalendar(year);
    const eventsMap = allocateDailyEvents(events);

    return (
      <div className="ic-year-calendar">
        <div ref={this.headerRef} className={classnames('ic-year-calendar__row', 'ic-year-calendar__header')}>
          <div ref={this.headerTitleRef} className="ic-year-calendar__row-title">{date.getFullYear()}</div>
          {headerWeeks.slice(0, maxDaysOfMonth).map((weekDayId: number) => (
            <div className={classnames('ic-year-calendar__row-content', 'ic-year-calendar__header-content')}>
              {weekDayIdLabelMap[`${weekDayId}`]}
            </div>
          ))}
        </div>
        {dates.map((datesOfMonth, month) => (
          <div key={month} className="ic-year-calendar__row">
            <div className="ic-year-calendar__row-title">{`${month + 1}月`}</div>
            {datesOfMonth.map(monthDay => (
              <div className="ic-year-calendar__row-content">
                {monthDay && (
                  <MonthDayView
                    params={eventsMap}
                    date={monthDay}
                    dayElementWidth={singleDayWidth}
                    dateVisible={false}
                    dotVisible={false}
                    hostAvatarVisible={false}
                    eventsLimit={null}
                    isFirstDayOfSection={this.isFirstDayOfSection}
                    getDaysToLastDayOfSection={(date) => this.getDaysToLastDayOfSection(date, month)}
                    style={{ height: 'auto' }}
                    paddingConfig={{
                      top: 1,
                      bottom: 1,
                      left: 0,
                      right: 6,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}
