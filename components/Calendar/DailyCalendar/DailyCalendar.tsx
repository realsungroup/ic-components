import React from 'react';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';

export default class DailyCalendar extends React.PureComponent<any, any> {
  state = {
    headerRightWidth: 0,
  };

  handleGetBgElement = element => {
    this.setState({ headerRightWidth: element.offsetWidth });
  };

  render() {
    const { events, startDate, endDate } = this.props;
    const { headerRightWidth } = this.state;
    const headerRightStyle = { width: headerRightWidth };

    return (
      <div className="ic-daily-calendar">
        <div className="ic-daily-calendar__header ic-daily-calendar__top">
          <div className="ic-daily-calendar__top-left" />
          <div className="ic-daily-calendar__top-right ic-daily-calendar__header-right" style={headerRightStyle}>
            headerRightPart
          </div>
        </div>
        <div className="ic-daily-calendar__top">
          <div className="ic-daily-calendar__top-left" />
          <div className="ic-daily-calendar__top-right ic-daily-calendar__all-day-events" style={headerRightStyle}>
            events
          </div>
        </div>
        <DayTimeLine onGetBgElement={this.handleGetBgElement}>
          <ChildrenWithProps className="ic-daily-calendar__day-views">
            <SingleDayView events={events} />
            {/* <SingleDayView index={2} /> */}
          </ChildrenWithProps>
        </DayTimeLine>
      </div>
    );
  }
}
