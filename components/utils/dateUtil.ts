import memoizeOne from 'memoize-one';
import memoize from 'lodash/memoize';
import moment from 'moment';

/* OFFSET
 * 一周中每天的默认顺序: [0, 1, 2, 3, 4, 5, 6], 0 表示周日
 * OFFSET = -1: [1, 2, 3, 4, 5, 6, 0]
 * OFFSET = -2: [2, 3, 4, 5, 6, 0, 1]
 * ...
 * OFFSET = 1: [6, 0, 1, 2, 3, 4, 5]
 * OFFSET = 2: [5, 6, 0, 1, 2, 3, 4]
 * ...
 *
 * 可根据项目需求在代码中修改，或者对现有代码稍做改动，通过传参的方式控制 offset
 * 相关函数:
 *   getWeekDaysInfo(), getDatesOfPreviousMonthLastWeek(),
 *   getDatesOfNextMonthFirstWeek(), isLastDayOfWeek(), isFirstDayOfWeek(),
 */
// const WEEK_DAY_OFFSET = 0; // 每周的第一天为“周日”
const WEEK_DAY_OFFSET = -1; // 每周的第一天为“周一”

const DEFAULT_LANGUAGE = 'zh-cn';

export const WEEK_LENGTH = 7;
export const MILLISECONDS_OF_ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * @param step {string} format: "value:unit"
 */
export const parseStep = step => {
  const [value, unit] = step.split(':');
  return [Number(value), unit];
};

const cyclicMoveWeekDay = memoizeOne((list, offset) => {
  const listCopy = [...list];
  if (offset > 0) {
    for (let i = offset % 7; i > 0; i--) {
      listCopy.unshift(listCopy.pop());
    }
  } else if (offset < 0) {
    for (let i = -offset % 7; i > 0; i--) {
      listCopy.push(listCopy.shift());
    }
  }
  return listCopy;
});

// const cyclicMove

const weekDayIds = [0, 1, 2, 3, 4, 5, 6];

const getWeekDayIdsByOffset = (offset = WEEK_DAY_OFFSET) => cyclicMoveWeekDay(weekDayIds, offset);

const weekDayNames = {
  'zh-cn': {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  },
  en: {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
  },
};

export function getWeekDayName(weekDay, language = DEFAULT_LANGUAGE) {
  const fallbackWeekDayNames = weekDayNames.en;
  const localeWeekDayNames = weekDayNames[language] || {};
  const validWeekDay = typeof weekDay === 'number' ? Math.abs(weekDay) % 7 : weekDay.getDay();
  return localeWeekDayNames[validWeekDay] || fallbackWeekDayNames[validWeekDay];
}

export const getWeekDaysInfo = memoize((language = DEFAULT_LANGUAGE) =>
  getWeekDayIdsByOffset().map(id => ({ id, label: getWeekDayName(id, language) }))
);

/**
 * @param time {string} 'HH:mm'
 */
export function formatHHmmTime(time) {
  if (!time) {
    return '';
  }

  const [hour, minute] = time.split(':');
  const hour24 = Number(hour);
  const hour12 = hour24 !== 12 ? hour24 % 12 : hour24;
  const suffix = hour24 < 12 ? 'am' : 'pm';
  return `${hour12}:${minute}${suffix}`;
}

/**
 * @param offset {number} offset < 12
 */
export const getMonthByOffset = (year, month, offset) => {
  let accumulatedMonth = month + offset;
  if (accumulatedMonth < 0) {
    accumulatedMonth = accumulatedMonth + 12;
  }
  const nextMonth = accumulatedMonth % 12;

  let nextYear;
  if (offset < 0) {
    nextYear = nextMonth > month ? year - 1 : year;
  } else if (offset > 0) {
    nextYear = nextMonth < month ? year + 1 : year;
  }
  return [nextYear, nextMonth];
};

export const isFirstDateOfWeek = date => {
  const weekDay = date.getDay();
  return getWeekDayIdsByOffset().indexOf(weekDay) === 0;
};

export const isLastDateOfWeek = date => {
  const weekDay = date.getDay();
  return getWeekDayIdsByOffset().indexOf(weekDay) === WEEK_LENGTH - 1;
};

export const monthDayHasher = date => {
  if (!date) {
    return undefined;
  }
  const dateCopy = new Date(date);
  dateCopy.setHours(0, 0, 0, 0);
  return dateCopy.valueOf();
};

export const isSameMonthDay = (date1, date2) =>
  date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();

export const getLengthOfMonth = (year, month) => moment(new Date(year, month)).daysInMonth();

export const getFirstDateOfMonth = (year, month) => new Date(year, month);

export const getLastDateOfMonth = (year, month) => {
  const [nextYear, nextMonth] = getMonthByOffset(year, month, 1);
  const firstDateOfNextMonth: any = new Date(nextYear, nextMonth);
  const lastDateOfCurrentMonth = new Date(firstDateOfNextMonth - 1);
  lastDateOfCurrentMonth.setHours(0, 0, 0, 0);
  return lastDateOfCurrentMonth;
};

/**
 * @returns [startDate, ..., endDate]
 */
export const getDatesBetween = memoizeOne(function(startDate, endDate, step = '1:d') {
  const [stepValue, stepUnit] = parseStep(step);
  const dates = [];
  for (
    let start = moment(startDate), endValue = moment(endDate).toDate().valueOf();
    start.toDate().valueOf() <= endValue;
    start.add(stepValue, stepUnit)
  ) {
    dates.push(start.toDate());
  }
  return dates;
});

export const getDatesOfMonth = memoizeOne(function(year, month, start, end) {
  const validStart = typeof start === 'number' ? start : 1;
  const validEnd = typeof end === 'number' ? end : getLengthOfMonth(year, month);
  const startDate = new Date(year, month, validStart);
  const endDate = new Date(year, month, validEnd);
  return getDatesBetween(startDate, endDate);
});

/**
 * @param weekDayOffset {number} range: [-6, 6]
 */
const getDatesOfPreviousMonthLastWeek = function(year, month, weekDayOffset = WEEK_DAY_OFFSET) {
  const daysOfPreviousMonth = (getFirstDateOfMonth(year, month).getDay() + weekDayOffset + WEEK_LENGTH) % WEEK_LENGTH;
  const [targetYear, targetMonth] = getMonthByOffset(year, month, -1);
  const lengthOfPreviousMonth = getLengthOfMonth(targetYear, targetMonth);
  const endMonthDay = lengthOfPreviousMonth;
  const startMonthDay = endMonthDay + 1 - daysOfPreviousMonth;
  return getDatesOfMonth(targetYear, targetMonth, startMonthDay, endMonthDay);
};

const getDatesOfNextMonthFirstWeek = function(year, month, weekDayOffset = WEEK_DAY_OFFSET) {
  const daysOfNextMonth =
    WEEK_LENGTH - ((getLastDateOfMonth(year, month).getDay() + 1 + weekDayOffset + WEEK_LENGTH) % WEEK_LENGTH);
  const monthStartDay = 1;
  const monthEndDay = daysOfNextMonth % WEEK_LENGTH;
  const [targetYear, targetMonth] = getMonthByOffset(year, month, 1);
  return getDatesOfMonth(targetYear, targetMonth, monthStartDay, monthEndDay);
};

export const getDatesOfMonthlyCalendar = memoizeOne((year, month) => [
  ...getDatesOfPreviousMonthLastWeek(year, month),
  ...getDatesOfMonth(year, month),
  ...getDatesOfNextMonthFirstWeek(year, month),
]);

export const getWeeksOfMonth = memoizeOne((year, month) => {
  const dates = getDatesOfMonthlyCalendar(year, month);
  const weeks = [[]];
  let weekIndex = 0;
  dates.forEach((date, index) => {
    const weekIndexOfCurrentDate = Math.floor(index / WEEK_LENGTH);
    if (weekIndexOfCurrentDate > weekIndex) {
      weekIndex += 1;
      const newWeek = [];
      weeks.push(newWeek);
    }
    weeks[weekIndex].push(date);
  });
  return weeks;
});

export function getHHmmDurationByMinute(HHmm) {
  const [start, end] = HHmm.split(':');
  return Number(start) * 60 + Number(end);
}

export function getStepDurationByMinute(step) {
  const [stepValue, stepUnit] = parseStep(step);
  const duration = moment.duration(stepValue, stepUnit);
  return duration.asMinutes();
}

export const getDayTimeLine = memoizeOne(function(start, end, step, formatString) {
  const [stepValue, stepUnit] = parseStep(step);
  const [startHour, startMinute] = start.split(':');
  const [endHour, endMinute] = end.split(':');
  const startMoment = moment([2019, 0, 1, Number(startHour), Number(startMinute)]);
  const endMoment = moment([2019, 0, 1, Number(endHour), Number(endMinute)]);
  const timeLine = [];
  for (let endMomentValue = endMoment.toDate().valueOf(); startMoment.toDate().valueOf() <= endMomentValue; ) {
    timeLine.push(startMoment.format(formatString));
    startMoment.add(stepValue, stepUnit);
  }
  return timeLine;
});
