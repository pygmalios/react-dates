import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from '../src/utils/isInclusivelyBeforeDay';

import DateRangePickerWrapper from '../examples/DateRangePickerWrapper';

const shortcuts = [
  { name: 'Today', period: [0, 'days'] },
  { name: 'Yesterday', period: [1, 'days'] },
  { name: 'Last 7 Days', period: [7, 'days'] },
  { name: 'Last 30 Days', period: [30, 'days'] },
  { name: 'Last 3 Months', period: [3, 'months'] },
  { name: 'Last 6 Months', period: [6, 'months'] },
  { name: 'Last Year', period: [1, 'years'] },
  { name: 'Custom Range' },
];

const shortcutsPrevious = [
  { name: 'Previous Period' },
  { name: 'Week ago', period: [1, 'weeks'] },
  { name: 'Month ago', period: [1, 'months'] },
  { name: 'Quartal ago', period: [3, 'months'] },
  { name: 'Year ago', period: [1, 'years'] },
  { name: 'Custom Range' },
];

function isDayHighlightedFn(startDate, endDate) {
  return day => isInclusivelyAfterDay(day, startDate) && isInclusivelyBeforeDay(day, endDate);
}


storiesOf('Pygmalios', module)
  .addWithInfo('default', () => (
    <DateRangePickerWrapper
      isOutsideRange={day => day.isAfter(moment())}
      isDayHighlightedFn={isDayHighlightedFn}
      keepOpenOnDateSelect
      minimumNights={0}
      enableOutsideDates
      autoFocus
      withControls
      withShortcuts
      shortcuts={shortcuts}
      shortcutsPrevious={shortcutsPrevious}
    />
  ));
