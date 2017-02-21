import React from 'react'

const ranges = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'Custom Range',
];

export default class DayPickerRanges extends React.Component {

  isRangeActive(index) {
    return index === this.props.selectedRange;
  }

  render() {
    const { onRangeClick, onApply, onCancel } = this.props;
    return (
      <div className="DayPicker__ranges">
        <ul>
          {ranges.map((range, i) => (
            <li
              key={`${range}`}
              className={this.isRangeActive(i) ? 'active' : ''}
              onClick={() => onRangeClick(i)}
            >{range}</li>
          ))}
        </ul>
        <div className="DayPickerRanges__inputs">
          <button className="success" type="button" onClick={onApply}>
            Apply
          </button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}
