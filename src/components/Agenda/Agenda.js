import React from 'react';
import { Checkbox } from 'antd';
import RangePicker from '../RangePicker';
import AgendaList from './AgendaList';
import styles from './Agenda.module.css';

export default class Agenda extends React.PureComponent {
  state = {
    detailVisible: false,
    importantOnly: false,
    weatherVisible: false,
    dateRange: this.props.defaultRange,
  };

  handleRangeChange = value => {
    const dateRange = [
      value[0].hour(0).minute(0).second(0).millisecond(0),
      value[1].hour(23).minute(59).second(59).millisecond(999),
    ];
    this.setState({ dateRange });
    const { onRangeChange } = this.props;
    typeof onRangeChange === 'function' && onRangeChange(dateRange);
  };

  handleCheckboxChange = (event, stateField) => {
    const { checked } = event.target;
    this.setState({ [stateField]: checked });
  };

  setDetailVisibility = event => {
    this.handleCheckboxChange(event, 'detailVisible');
  };

  setImportanceFilter = event => {
    this.handleCheckboxChange(event, 'importantOnly');
  };

  setWeatherVisibility = event => {
    this.handleCheckboxChange(event, 'weatherVisible');
  };

  render() {
    const { events } = this.props;
    const { dateRange, detailVisible, importantOnly, weatherVisible } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.dateRange}>
            <div className={styles.dateRangeLabel}>日期范围</div>
            <RangePicker value={dateRange} onChange={this.handleRangeChange} />
          </div>
          <div className={styles.headerRightPart}>
            <Checkbox onChange={this.setDetailVisibility}>详情</Checkbox>
            <Checkbox onChange={this.setImportanceFilter}>重要</Checkbox>
            <Checkbox onChange={this.setWeatherVisibility}>天气</Checkbox>
          </div>
        </div>
        <div className={styles.body}>
          <AgendaList
            events={events}
            dateRange={dateRange}
            detailVisible={detailVisible}
            importantOnly={importantOnly}
            weatherVisible={weatherVisible}
          />
        </div>
      </div>
    );
  }
}
