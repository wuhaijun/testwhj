'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MonthDropdown = _react2.default.createClass({
  displayName: 'MonthDropdown',

  propTypes: {
    dropdownMode: _react2.default.PropTypes.oneOf(['scroll', 'select']).isRequired,
    locale: _react2.default.PropTypes.string,
    month: _react2.default.PropTypes.number.isRequired,
    onChange: _react2.default.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      dropdownVisible: false
    };
  },
  renderSelectOptions: function renderSelectOptions() {
    var localeData = _moment2.default.localeData(this.props.locale);
    return (0, _range2.default)(0, 12).map(function (M, i) {
      return _react2.default.createElement(
        'option',
        { key: i, value: i },
        localeData.months((0, _moment2.default)({ M: M }))
      );
    });
  },
  renderSelectMode: function renderSelectMode() {
    var _this = this;

    return _react2.default.createElement(
      'select',
      { value: this.props.month, className: 'react-datepicker__month-select', onChange: function onChange(e) {
          return _this.onChange(e.target.value);
        } },
      this.renderSelectOptions()
    );
  },
  onChange: function onChange(month) {
    if (month !== this.props.month) {
      this.props.onChange(month);
    }
  },
  render: function render() {
    var renderedDropdown = void 0;
    switch (this.props.dropdownMode) {
      // TODO: implement scroll mode
      // case 'scroll':
      //   renderedDropdown = this.renderScrollMode()
      //   break
      case 'select':
        renderedDropdown = this.renderSelectMode();
        break;
    }

    return _react2.default.createElement(
      'div',
      {
        className: 'react-datepicker__month-dropdown-container react-datepicker__month-dropdown-container--' + this.props.dropdownMode },
      renderedDropdown
    );
  }
});

module.exports = MonthDropdown;
