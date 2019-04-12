import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { getDatesBetween, getWeekDayName, monthDayHasher } from '../../utils/dateUtil';
import { allocateDailyEvents, isTotalDayEvent } from '../../utils/eventUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import MonthDayView from '../MonthDayView';
import PropTypes from 'prop-types';

function allDayEventsFilter(event) {
  return isTotalDayEvent(event);
}

function notAllDayEventsFilter(event) {
  return !isTotalDayEvent(event);
}

export default class Plan extends React.PureComponent<any, any> {
  static propTypes = {
    /**
     * 选择的日期
     */
    selectedDate: PropTypes.object,

    /**
     * 分类的日历事件
     */
    events: PropTypes.array,
  };

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
    const { selectedDate } = this.props;
    return date.getDate() === selectedDate.getDate();
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

  getEventsMap = events => {
    return events.map(event => ({
      ...event,
      eventsMap: allocateDailyEvents(event.events),
    }));
  };

  render() {
    const { events, selectedDate } = this.props;
    const { sideWidth, sideHeight, today, rootWidth } = this.state;
    const eventsWithEventsMap = this.getEventsMap(events);
    const dates = getDatesBetween(selectedDate, selectedDate);
    const datesLength = dates.length;
    const topSideStyle = { width: sideWidth };
    const singleDayWidth = Math.floor((rootWidth - sideWidth) / datesLength);

    const classifyLength = events.length;
    const singleClassifyWidth = Math.floor((rootWidth - sideWidth) / classifyLength);

    return (
      <div className="ic-daily-calendar" ref={this.rootRef}>
        {/* 头部日期 */}
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

        {/* 分类 */}
        <div className="ic-plan__classify">
          <div style={topSideStyle} className="ic-plan__classify-left" />

          {events.map(eventItem => (
            <div className="ic-plan__classify-item" style={{ width: singleClassifyWidth }}>
              {eventItem.type}
            </div>
          ))}
        </div>

        <div className="ic-daily-calendar__top">
          <div style={topSideStyle} className="ic-daily-calendar__top-left" />
          {/* 全天事件 */}
          <div className="ic-daily-calendar__top-right ic-daily-calendar__all-day-events">
            {eventsWithEventsMap.map(event => (
              <div
                key={event.type}
                className="ic-daily-calendar__all-day-event-container"
                style={{ width: singleClassifyWidth, float: 'left' }}
              >
                <MonthDayView
                  params={event.eventsMap}
                  eventsFilter={allDayEventsFilter}
                  date={selectedDate}
                  dayElementWidth={singleDayWidth}
                  dateVisible={false}
                  dotVisible={false}
                  eventsLimit={null}
                  isFirstDayOfSection={this.isFirstDayOfSection}
                  getDaysToLastDayOfSection={this.getDaysToLastDayOfSection}
                  style={{ height: 'auto', width: singleClassifyWidth }}
                />
              </div>
            ))}
          </div>
        </div>

        <DayTimeLine onGetSideElement={this.handleGetSideElement}>
          <ChildrenWithProps className="ic-plan__single-classify-wrap">
            {eventsWithEventsMap.map(event => (
              <SingleDayView
                events={event.eventsMap.get(monthDayHasher(selectedDate))}
                eventsFilter={notAllDayEventsFilter}
                date={selectedDate}
                style={{ width: singleClassifyWidth, height: sideHeight, float: 'left' }}
              />
            ))}
          </ChildrenWithProps>
        </DayTimeLine>
      </div>
    );
  }
}
