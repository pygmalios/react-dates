import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from '../src/utils/isInclusivelyBeforeDay';

import DateRangePickerWrapper from '../examples/DateRangePickerWrapper';

import { ANCHOR_RIGHT } from '../constants';

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

const today = moment().endOf('day');
storiesOf('Pygmalios', module)
  .addWithInfo('default', () => (
    <DateRangePickerWrapper
      displayFormat="DD. MMM YYYY"
      showDefaultInputIcon
      compareBy={null}
      locale="en"
      startOfWeek={1}
      customArrowIcon={'-'}
      isOutsideRange={day => day.isAfter(today)}
      isDayHighlightedFn={isDayHighlightedFn}
      keepOpenOnDateSelect
      minimumNights={0}
      autoFocus
      withControls
      withShortcuts
      withSingleInput
      showDropdownCaret
      shortcuts={shortcuts}
      shortcutsPrevious={shortcutsPrevious}
    />
  ));
