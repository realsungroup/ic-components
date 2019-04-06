import memoize from 'memoize-one';
import { monthDayHasher } from './dateUtil';

export const normalizeDailyEvent = (event, index) => {
  const safeEvent = event || {};
  const startTime = new Date(safeEvent.occur_begin);
  const endTime = new Date(safeEvent.occur_end);

  return {
    original: safeEvent,
    occurId: safeEvent.occur_id || index,
    startTime,
    endTime,
  };
};

export const compareEvents = (e1, e2) => e1.endTime - e2.startTime;

export const isValidEvent = ({ startTime, endTime }) => startTime.valueOf() < endTime.valueOf();

export const allocateDailyEvents = memoize(events => {
  const validEvents = events
    .map(normalizeDailyEvent)
    .filter(isValidEvent)
    .sort(compareEvents);
  const eventsMap = new Map();

  const allocateEvent = event => {
    const { startTime, endTime } = event;
    let calcStartTime = startTime;
    const eventKey = monthDayHasher(startTime);
    const eventsOfDate = eventsMap.get(eventKey);
    if (!eventsOfDate) {
      eventsMap.set(eventKey, [event]);
    } else if (eventsOfDate.every(({ occurId }) => event.occurId !== occurId)) {
      eventsOfDate.push(event);
    }

    while (calcStartTime.getDate() !== endTime.getDate()) {
      calcStartTime = new Date(calcStartTime);
      calcStartTime.setDate(calcStartTime.getDate() + 1);
      calcStartTime.setHours(0, 0, 0, 0);
      allocateEvent({ ...event, startTime: calcStartTime, alreadyBegun: true });
    }
  };

  validEvents.forEach(allocateEvent);

  return eventsMap;
});

export const getEventDuration = (event, type) => {
  if (!isValidEvent(event)) {
    return 0;
  }

  const { startTime, endTime } = event;

  switch(type) {
  case 'day':
    return endTime.getDate() - startTime.getDate() + 1;
  default:
    return endTime - startTime;
  }
};
