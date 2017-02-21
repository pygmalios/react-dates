import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';

import DateRangePickerWrapper from '../examples/DateRangePickerWrapper';

const rangesTop = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'Custom Range',
];

const rangesPrevious = [
  'Previous Period',
  'Week ago',
  'Month ago',
  'Quartal ago',
  'Year ago',
  'Fixed custom range',
];

storiesOf('Pygmalios', module)
  .addWithInfo('default', () => (
    <DateRangePickerWrapper
      isOutsideRange={() => false}
      keepOpenOnDateSelect
      minimumNights={0}
      enableOutsideDates
      autoFocus
      withControls
      withShortcuts
      shortcuts={rangesTop}
      shortcutsPrevious={rangesPrevious}
    />
  ));
