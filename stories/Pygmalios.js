import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from '../src/utils/isInclusivelyBeforeDay';

import DateRangePickerWrapper from '../examples/DateRangePickerWrapper';

import { ANCHOR_RIGHT } from '../constants';

const today = moment().endOf('day');
const yesterday = moment().subtract(1, 'days').endOf('day');

const shortcuts = [
  { name: 'Today', range: [today.clone().startOf('day'), today.clone()] },
  { name: 'Yesterday', range: [yesterday.clone().startOf('day'), yesterday.clone()] },
  { name: 'Last 7 Days', range: [yesterday.clone().subtract(6, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Last 30 Days', range: [yesterday.clone().subtract(29, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Last 3 Months', range: [yesterday.clone().subtract(3, 'months').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Last 6 Months', range: [yesterday.clone().subtract(6, 'months').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Last Year', range: [yesterday.clone().subtract(1, 'year').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Custom Range' },
];

const shortcutsPrevious = [
  { name: 'Previous Period' },
  { name: 'Week ago', range: [yesterday.clone().subtract(1, 'weeks').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Month ago', range: [yesterday.clone().subtract(1, 'month').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Quartal ago', range: [yesterday.clone().subtract(3, 'month').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Year ago', range: [yesterday.clone().subtract(1, 'years').add(1, 'days').startOf('day'), yesterday.clone()] },
  { name: 'Custom Range' },
];

function isDayHighlightedFn(startDate, endDate) {
  return day => isInclusivelyAfterDay(day, startDate) && isInclusivelyBeforeDay(day, endDate);
}

storiesOf('Pygmalios', module)
  .addWithInfo('default', () => {
    moment.locale('en-GB');
    return (
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
      />);
  });
