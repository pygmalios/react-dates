import React from 'react';
import DateRangeController from './DateRangePickerInputController';
import DayPickerController from './DayPickerRangeController';
import { START_DATE, END_DATE } from '../../constants';

export default class DayPickerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  renderCompareByOptions() {
    const { compareBy, onCompareByChange } = this.props;
    const options = [
      { option: 'byPercentage', label: 'Change by % Value' },
      { option: 'byNumeric', label: 'Change by Numeric Value' },
      { option: 'byExact', label: 'Exact Value of Custom Range' },
    ];

    return (
      <select value={compareBy} onChange={evt => onCompareByChange(evt.target.value)}>
        {options.map(option => (
          <option value={option.option}>{option.label}</option>
        ))}
      </select>
    );
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const {
      focusedInput,
    } = this.state;
    const {
      onApply,
      onCancel,
      selectedShortcut,
      shortcuts,
      onDatesChange,
      onShortcutChange,
      onCompareToChange,
      onByValueChange,
      startDate,
      endDate,
      isDayHighlighted,
      isOutsideRange,
      isComparing,
      initialVisibleMonth,
    } = this.props;

    return (
      <div>
        <div className="DayPickerControls__inputs">
          <label forHtml="compare-to-checkbox">
            Compare to
            <input
              name="compare-to-checkbox"
              type="checkbox"
              checked={isComparing}
              onChange={() => onCompareToChange(!isComparing)}
            />
          </label>

          { isComparing &&
            <div className="DateRangePicker">
              <DateRangeController
                startDate={startDate}
                isStartDateFocused={focusedInput === START_DATE}
                endDate={endDate}
                isEndDateFocused={focusedInput === END_DATE}
                onFocusChange={this.onFocusChange}
                selectedShortcut={selectedShortcut}
              />
            </div>
          }
          { isComparing &&
            <span>
              By
            </span>
          }
          {isComparing && this.renderCompareByOptions()}

          <button className="success" type="button" onClick={onApply}>
            Apply
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
        { focusedInput &&
          <div className="DayPickerControls__previous">
            <DayPickerController
              ref={(ref) => { this.dayPicker = ref; }}
              initialVisibleMonth={initialVisibleMonth}
              isDayHighlighted={isDayHighlighted}
              isOutsideRange={isOutsideRange}
              onFocusChange={this.onFocusChange}
              numberOfMonths={2}
              onDatesChange={onDatesChange}
              onShortcutChange={onShortcutChange}
              focusedInput={focusedInput}
              startDate={startDate}
              endDate={endDate}
              minimumNights={0}
              keepOpenOnDateSelect
              selectedShortcut={selectedShortcut}
              shortcuts={shortcuts}
              withShortcuts
            />
          </div>
        }
      </div>
    );
  }
}
