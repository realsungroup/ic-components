import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { getDatesBetween, getWeekDayName, monthDayHasher } from '../../utils/dateUtil';
import { allocateDailyEvents, isTotalDayEvent } from '../../utils/eventUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import MonthDayView from '../MonthDayView';

function allDayEventsFilter(event) {
  return isTotalDayEvent(event);
}

// 不是全天事件
function notAllDayEventsFilter(event) {
  return !isTotalDayEvent(event);
}

export default class DailyCalendar extends React.PureComponent<any, any> {
  state = {
    sideWidth: 0,
    sideHeight: 0,
    today: new Date(),
    rootWidth: 0,
  };

  rootRef: any = React.createRef();

  componentDidMount() {
    this.setState({ rootWidth: this.rootRef.current.offsetWidth });
  }

  handleGetSideElement = element => {
    this.setState({
      sideWidth: element.offsetWidth,
      sideHeight: element.offsetHeight,
    });
  };

  isFirstDayOfSection = (date: Date) => {
    const { startDate } = this.props;
    return date.getDate() === startDate.getDate();
  };

  getDaysToLastDayOfSection = (date: Date) => {
    const { endDate } = this.props;
    const end = moment(endDate);
    const start = moment(date);
    end
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    start
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    return end.diff(start, 'days');
  };

  render() {
    const { events, startDate, endDate } = this.props;
    const { sideWidth, sideHeight, today, rootWidth } = this.state;
    const eventsMap = allocateDailyEvents(events);
    const dates = getDatesBetween(startDate, endDate);
    const datesLength = dates.length;
    const topSideStyle = { width: sideWidth };
    const singleDayWidth = Math.floor((rootWidth - sideWidth) / datesLength);

    return (
      <div className="ic-daily-calendar" ref={this.rootRef}>
        <div className="ic-daily-calendar__top ic-daily-calendar__header">
          <div style={topSideStyle} className="ic-daily-calendar__top-left" />
          <div className="ic-daily-calendar__top-right ic-daily-calendar__header-right">
            {dates.map(date => (
              <div
                key={date.valueOf()}
                className={classnames('ic-daily-calendar__day-title', {
                  ['ic-daily-calendar__day-title-today']: datesLength > 1 && date.getDate() === today.getDate(),
                })}
                style={{ width: singleDayWidth }}
              >
                <div className="ic-daily-calendar__day-title-week">{getWeekDayName(date)}</div>
                <div className="ic-daily-calendar__day-title-date">{`${date.getMonth() + 1}月${date.getDate()}日`}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="ic-daily-calendar__top">
          <div style={topSideStyle} className="ic-daily-calendar__top-left" />
          <div className="ic-daily-calendar__top-right ic-daily-calendar__all-day-events">
            {dates.map(date => (
              <div
                key={date.valueOf()}
                className="ic-daily-calendar__all-day-event-container"
                style={{ width: singleDayWidth }}
              >
                <MonthDayView
                  params={eventsMap}
                  eventsFilter={allDayEventsFilter}
                  date={date}
                  dayElementWidth={singleDayWidth}
                  dateVisible={false}
                  dotVisible={false}
                  eventsLimit={null}
                  isFirstDayOfSection={this.isFirstDayOfSection}
                  getDaysToLastDayOfSection={this.getDaysToLastDayOfSection}
                  style={{ height: 'auto', width: singleDayWidth }}
                />
              </div>
            ))}
          </div>
        </div>
        <DayTimeLine onGetSideElement={this.handleGetSideElement}>
          <ChildrenWithProps className="ic-daily-calendar__day-views">
            {dates.map(date => (
              <SingleDayView
                key={date.valueOf()}
                events={eventsMap.get(monthDayHasher(date))}
                eventsFilter={notAllDayEventsFilter}
                date={date}
                style={{ width: singleDayWidth, height: sideHeight }}
              />
            ))}
          </ChildrenWithProps>
        </DayTimeLine>
      </div>
    );
  }
}
