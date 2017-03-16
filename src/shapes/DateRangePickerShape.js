import { PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';

import FocusedInputShape from '../shapes/FocusedInputShape';
import OrientationShape from '../shapes/OrientationShape';
import anchorDirectionShape from '../shapes/AnchorDirectionShape';

const shortcutShape = PropTypes.shape({
  name: PropTypes.string.required,
  period: PropTypes.array,
});

export default {
  // required props for a functional interactive DateRangePicker
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  onDatesChange: PropTypes.func.isRequired,

  focusedInput: FocusedInputShape,
  onFocusChange: PropTypes.func.isRequired,

  // input related props
  startDateId: PropTypes.string.isRequired,
  startDatePlaceholderText: PropTypes.string,
  endDateId: PropTypes.string.isRequired,
  endDatePlaceholderText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDates: PropTypes.bool,
  showDefaultInputIcon: PropTypes.bool,
  customInputIcon: PropTypes.node,
  customArrowIcon: PropTypes.node,

  // calendar presentation and interaction related props
  orientation: OrientationShape,
  anchorDirection: anchorDirectionShape,
  horizontalMargin: PropTypes.number,
  withPortal: PropTypes.bool,
  withFullScreenPortal: PropTypes.bool,
  initialVisibleMonth: PropTypes.func,
  numberOfMonths: PropTypes.number,
  keepOpenOnDateSelect: PropTypes.bool,
  reopenPickerOnClearDates: PropTypes.bool,

  // navigation related props
  navPrev: PropTypes.node,
  navNext: PropTypes.node,
  onPrevMonthClick: PropTypes.func,
  onNextMonthClick: PropTypes.func,

  // day presentation and interaction related props
  renderDay: PropTypes.func,
  minimumNights: PropTypes.number,
  enableOutsideDays: PropTypes.bool,
  isDayBlocked: PropTypes.func,
  isOutsideRange: PropTypes.func,
  isDayHighlighted: PropTypes.func,

  // internationalization props
  locale: PropTypes.string,
  startOfWeek: PropTypes.number,
  displayFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  monthFormat: PropTypes.string,
  phrases: PropTypes.shape({
    closeDatePicker: PropTypes.node,
    clearDates: PropTypes.node,
  }),

  selectedShortcut: shortcutShape,
  selectedShortcutPrevious: shortcutShape,
  shortcuts: PropTypes.arrayOf(shortcutShape),
  shortcutsPrevious: PropTypes.arrayOf(shortcutShape),

  withControls: PropTypes.bool,
  withShortcuts: PropTypes.bool,

  isDayHighlightedFn: PropTypes.func,
  isDayHighlightedPrevious: PropTypes.func,
  onShortcutChange: PropTypes.func,
  onPreviousShortcutChange: PropTypes.func,
  onPreviousDatesChange: PropTypes.func,
  previousEndDate: momentPropTypes.momentObj,
  previousStartDate: momentPropTypes.momentObj,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  isComparing: PropTypes.bool,
  compareBy: PropTypes.string,
  onCompareByChange: PropTypes.func,
  onIsComparingToggle: PropTypes.func,
  withSingleInput: PropTypes.bool,
  showDropdownCaret: PropTypes.bool,
};
