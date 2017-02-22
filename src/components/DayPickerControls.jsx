import React from 'react';
import RangeInputController from './PreviousDateRangePicker';
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
    const { compareBy } = this.props;
    const options = [
      { option: "byPercentage", label: 'Change by % Value' },
      { option: 'byNumeric', label: 'Change by Numeric Value' },
      { option: 'byExact', label: 'Exact Value of Custom Range' },
    ];

    return (
      <select>
        {options.map(option => (
          <option>{option.label}</option>
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
      startDate,
      endDate,
    } = this.props;

    return (
      <div>
        <div className="DayPickerControls__inputs">
          <label forHtml="compare-to-checkbox">
            Compare to
            <input
              name="compare-to-checkbox"
              type="checkbox"
              checked
            />
          </label>

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
          <span>
            By
          </span>

          {this.renderCompareByOptions()}

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
              onFocusChange={this.onFocusChange}
              numberOfMonths={2}
              onDatesChange={onDatesChange}
              onShortcutChange={onShortcutChange}
              focusedInput={focusedInput}
              startDate={startDate}
              endDate={endDate}
              minimumNights={0}
              isOutsideRange={() => false}
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
