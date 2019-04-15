import React from 'react';
import MonthDayView from '../MonthDayView';

export default class Row extends React.PureComponent<any, any> {
  state = {
    rowHeight: undefined,
  }

  componentDidMount() {
    this.setState({ rowHeight: this.rowRef.current.offsetHeight });
  }

  rowRef: any = React.createRef();

  render() {
    const {
      datesOfMonth,
      month,
      eventsMap,
      singleDayWidth,
      isFirstDayOfSection,
      getDaysToLastDayOfSection,
    } = this.props;
    const { rowHeight } = this.state;
    const rowStyle = rowHeight ? { height: rowHeight } : {};
    return (
      <div ref={this.rowRef} key={month} className="ic-year-calendar__row" style={rowStyle}>
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
                isFirstDayOfSection={isFirstDayOfSection}
                getDaysToLastDayOfSection={date => getDaysToLastDayOfSection(date, month)}
                style={{ height: 'auto' }}
                paddingConfig={{
                  top: 4,
                  bottom: 1,
                  left: 0,
                  right: 6,
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
}
