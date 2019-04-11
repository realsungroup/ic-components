/// <reference path='../../../typings/custom-typings.d.ts'/>

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { parseStep } from '../../utils/dateUtil';

export default class DateSwitcher extends React.PureComponent<any, any> {
  static propTypes = {
    step: PropTypes.string.isRequired, // 向前向后的步长
  };

  static defaultProps = {
    step: '1:d',
  };

  handleChange = value => {
    const { onChange } = this.props;
    typeof onChange === 'function' && onChange(value);
  };

  switchByOffset = (forward?) => {
    const { value: date, step } = this.props;
    const [value, unit] = parseStep(step);
    const nextMoment = moment(date);
    if (forward) {
      nextMoment.add(value, unit);
    } else {
      nextMoment.subtract(value, unit);
    }
    this.handleChange(nextMoment.toDate());

    // const nextDate = new Date(date);
    // const offset = forward ? value : -value;
    // switch (unit) {
    // case 'year':
    //   nextDate.setFullYear(date.getFullYear() + offset);
    //   break;
    // case 'month':
    //   nextDate.setMonth(date.getMonth() + offset);
    //   break;
    // case 'day':
    //   nextDate.setDate(date.getDate() + offset);
    //   break;
    // case 'week':
    //   nextDate.setDate(date.getDate() + offset * 7);
    //   break;
    // default:
    //   break;
    // }
    // this.handleChange(nextDate);
  };

  switchBack = () => {
    this.switchByOffset();
  };

  switchForward = () => {
    this.switchByOffset(true);
  };

  switchToNow = () => {
    this.handleChange(new Date());
  };

  render() {
    const { className } = this.props;
    return (
      <div className={classnames('ic-date-switcher', className)}>
        <div className="ic-date-switcher__left-arrow" onClick={this.switchBack} />
        <div className="ic-date-switcher__text" onClick={this.switchToNow}>
          今天
        </div>
        <div className="ic-date-switcher__right-arrow" onClick={this.switchForward} />
      </div>
    );
  }
}
