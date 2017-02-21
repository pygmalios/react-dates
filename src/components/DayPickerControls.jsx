import React from 'react';
import RangeInputController from './PreviousDateRangePicker';
import DayPickerController from './DayPickerRangeController';

export default class DayPickerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: null,
      previousDate: null,
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
    console.log('onFocusChange', focusedInput);
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput, startDate, endDate, selectedRange } = this.state;
    const { onApply, onCancel } = this.props;

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

          <RangeInputController
            focusedInput={focusedInput}
            onFocusChange={this.onFocusChange}
          />

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
              numberOfMonths={2}
              onDatesChange={this.onDatesChange}
              onRangeChange={this.onRangeChange}
              focusedInput={focusedInput}
              startDate={startDate}
              endDate={endDate}
              minimumNights={0}
              isOutsideRange={() => false}
              keepOpenOnDateSelect
              selectedRange={selectedRange}
            />
          </div>
        }
      </div>
    );
  }
}
