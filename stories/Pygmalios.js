import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';

import DateRangePickerWrapper from '../examples/DateRangePickerWrapper';

storiesOf('Pygmalios', module)
  .addWithInfo('default', () => (
    <DateRangePickerWrapper
      isOutsideRange={() => false}
      keepOpenOnDateSelect
      minimumNights={0}
      enableOutsideDates
      autoFocus
      withControls
    />
  ));
