'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _year_dropdown = require('./year_dropdown');

var _year_dropdown2 = _interopRequireDefault(_year_dropdown);

var _month_dropdown = require('./month_dropdown');

var _month_dropdown2 = _interopRequireDefault(_month_dropdown);

var _month = require('./month');

var _month2 = _interopRequireDefault(_month);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _date_utils = require('./date_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DROPDOWN_FOCUS_CLASSNAMES = ['react-datepicker__year-select', 'react-datepicker__month-select'];

var isDropdownSelect = function isDropdownSelect() {
  var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var classNames = (element.className || '').split(/\s+/);
  return !!(0, _find2.default)(DROPDOWN_FOCUS_CLASSNAMES, function (testClassname) {
    return classNames.indexOf(testClassname) >= 0;
  });
};

var Calendar = _react2.default.createClass({
  displayName: 'Calendar',

  propTypes: {
    dateFormat: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.array]).isRequired,
    dropdownMode: _react2.default.PropTypes.oneOf(['scroll', 'select']).isRequired,
    endDate: _react2.default.PropTypes.object,
    excludeDates: _react2.default.PropTypes.array,
    filterDate: _react2.default.PropTypes.func,
    fixedHeight: _react2.default.PropTypes.bool,
    highlightDates: _react2.default.PropTypes.array,
    includeDates: _react2.default.PropTypes.array,
    locale: _react2.default.PropTypes.string,
    maxDate: _react2.default.PropTypes.object,
    minDate: _react2.default.PropTypes.object,
    monthsShown: _react2.default.PropTypes.number,
    onClickOutside: _react2.default.PropTypes.func.isRequired,
    onDropdownFocus: _react2.default.PropTypes.func,
    onSelect: _react2.default.PropTypes.func.isRequired,
    openToDate: _react2.default.PropTypes.object,
    peekNextMonth: _react2.default.PropTypes.bool,
    scrollableYearDropdown: _react2.default.PropTypes.bool,
    selected: _react2.default.PropTypes.object,
    selectsEnd: _react2.default.PropTypes.bool,
    selectsStart: _react2.default.PropTypes.bool,
    showMonthDropdown: _react2.default.PropTypes.bool,
    showWeekNumbers: _react2.default.PropTypes.bool,
    showYearDropdown: _react2.default.PropTypes.bool,
    startDate: _react2.default.PropTypes.object,
    todayButton: _react2.default.PropTypes.string,
    utcOffset: _react2.default.PropTypes.number
  },

  defaultProps: {
    onDropdownFocus: function onDropdownFocus() {}
  },

  getDefaultProps: function getDefaultProps() {
    return {
      utcOffset: _moment2.default.utc().utcOffset(),
      monthsShown: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      date: this.localizeMoment(this.getDateInView()),
      selectingDate: null
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.selected && !(0, _date_utils.isSameDay)(nextProps.selected, this.props.selected)) {
      this.setState({
        date: this.localizeMoment(nextProps.selected)
      });
    } else if (nextProps.openToDate && !(0, _date_utils.isSameDay)(nextProps.openToDate, this.props.openToDate)) {
      this.setState({
        date: this.localizeMoment(nextProps.openToDate)
      });
    }
  },
  handleClickOutside: function handleClickOutside(event) {
    this.props.onClickOutside(event);
  },
  handleDropdownFocus: function handleDropdownFocus(event) {
    if (isDropdownSelect(event.target)) {
      this.props.onDropdownFocus();
    }
  },
  getDateInView: function getDateInView() {
    var _props = this.props,
        selected = _props.selected,
        openToDate = _props.openToDate,
        utcOffset = _props.utcOffset;

    var minDate = (0, _date_utils.getEffectiveMinDate)(this.props);
    var maxDate = (0, _date_utils.getEffectiveMaxDate)(this.props);
    var current = _moment2.default.utc().utcOffset(utcOffset);
    if (selected) {
      return selected;
    } else if (minDate && maxDate && openToDate && openToDate.isBetween(minDate, maxDate)) {
      return openToDate;
    } else if (minDate && openToDate && openToDate.isAfter(minDate)) {
      return openToDate;
    } else if (minDate && minDate.isAfter(current)) {
      return minDate;
    } else if (maxDate && openToDate && openToDate.isBefore(maxDate)) {
      return openToDate;
    } else if (maxDate && maxDate.isBefore(current)) {
      return maxDate;
    } else if (openToDate) {
      return openToDate;
    } else {
      return current;
    }
  },
  localizeMoment: function localizeMoment(date) {
    return date.clone().locale(this.props.locale || _moment2.default.locale());
  },
  increaseMonth: function increaseMonth() {
    this.setState({
      date: this.state.date.clone().add(1, 'month')
    });
  },
  decreaseMonth: function decreaseMonth() {
    this.setState({
      date: this.state.date.clone().subtract(1, 'month')
    });
  },
  handleDayClick: function handleDayClick(day, event) {
    this.props.onSelect(day, event);
  },
  handleDayMouseEnter: function handleDayMouseEnter(day) {
    this.setState({ selectingDate: day });
  },
  handleMonthMouseLeave: function handleMonthMouseLeave() {
    this.setState({ selectingDate: null });
  },
  changeYear: function changeYear(year) {
    this.setState({
      date: this.state.date.clone().set('year', year)
    });
  },
  changeMonth: function changeMonth(month) {
    this.setState({
      date: this.state.date.clone().set('month', month)
    });
  },
  header: function header() {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.date;

    var startOfWeek = date.clone().startOf('week');
    var dayNames = [];
    if (this.props.showWeekNumbers) {
      dayNames.push(_react2.default.createElement(
        'div',
        { key: 'W', className: 'react-datepicker__day-name' },
        '#'
      ));
    }
    return dayNames.concat([0, 1, 2, 3, 4, 5, 6].map(function (offset) {
      var day = startOfWeek.clone().add(offset, 'days');
      return _react2.default.createElement(
        'div',
        { key: offset, className: 'react-datepicker__day-name' },
        day.localeData().weekdaysMin(day)
      );
    }));
  },
  renderPreviousMonthButton: function renderPreviousMonthButton() {
    if ((0, _date_utils.allDaysDisabledBefore)(this.state.date, 'month', this.props)) {
      return;
    }
    return _react2.default.createElement('a', {
      className: 'react-datepicker__navigation react-datepicker__navigation--previous',
      onClick: this.decreaseMonth });
  },
  renderNextMonthButton: function renderNextMonthButton() {
    if ((0, _date_utils.allDaysDisabledAfter)(this.state.date, 'month', this.props)) {
      return;
    }
    return _react2.default.createElement('a', {
      className: 'react-datepicker__navigation react-datepicker__navigation--next',
      onClick: this.increaseMonth });
  },
  renderCurrentMonth: function renderCurrentMonth() {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.date;

    var classes = ['react-datepicker__current-month'];
    if (this.props.showYearDropdown) {
      classes.push('react-datepicker__current-month--hasYearDropdown');
    }
    return _react2.default.createElement(
      'div',
      { className: classes.join(' ') },
      date.format(this.props.dateFormat)
    );
  },
  renderYearDropdown: function renderYearDropdown() {
    var overrideHide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!this.props.showYearDropdown || overrideHide) {
      return;
    }
    return _react2.default.createElement(_year_dropdown2.default, {
      dropdownMode: this.props.dropdownMode,
      onChange: this.changeYear,
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      year: this.state.date.year(),
      scrollableYearDropdown: this.props.scrollableYearDropdown });
  },
  renderMonthDropdown: function renderMonthDropdown() {
    var overrideHide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!this.props.showMonthDropdown) {
      return;
    }
    return _react2.default.createElement(_month_dropdown2.default, {
      dropdownMode: this.props.dropdownMode,
      locale: this.props.locale,
      onChange: this.changeMonth,
      month: this.state.date.month() });
  },
  renderTodayButton: function renderTodayButton() {
    var _this = this;

    if (!this.props.todayButton) {
      return;
    }
    return _react2.default.createElement(
      'div',
      { className: 'react-datepicker__today-button', onClick: function onClick(event) {
          return _this.props.onSelect(_moment2.default.utc().utcOffset(_this.props.utcOffset).startOf('date'), event);
        } },
      this.props.todayButton
    );
  },
  renderMonths: function renderMonths() {
    var monthList = [];
    for (var i = 0; i < this.props.monthsShown; ++i) {
      var monthDate = this.state.date.clone().add(i, 'M');
      var monthKey = 'month-' + i;
      monthList.push(_react2.default.createElement(
        'div',
        { key: monthKey, className: 'react-datepicker__month-container' },
        _react2.default.createElement(
          'div',
          { className: 'react-datepicker__header' },
          this.renderCurrentMonth(monthDate),
          _react2.default.createElement(
            'div',
            {
              className: 'react-datepicker__header__dropdown react-datepicker__header__dropdown--' + this.props.dropdownMode,
              onFocus: this.handleDropdownFocus },
            this.renderMonthDropdown(i !== 0),
            this.renderYearDropdown(i !== 0)
          ),
          _react2.default.createElement(
            'div',
            { className: 'react-datepicker__day-names' },
            this.header(monthDate)
          )
        ),
        _react2.default.createElement(_month2.default, {
          day: monthDate,
          onDayClick: this.handleDayClick,
          onDayMouseEnter: this.handleDayMouseEnter,
          onMouseLeave: this.handleMonthMouseLeave,
          minDate: this.props.minDate,
          maxDate: this.props.maxDate,
          excludeDates: this.props.excludeDates,
          highlightDates: this.props.highlightDates,
          selectingDate: this.state.selectingDate,
          includeDates: this.props.includeDates,
          fixedHeight: this.props.fixedHeight,
          filterDate: this.props.filterDate,
          selected: this.props.selected,
          selectsStart: this.props.selectsStart,
          selectsEnd: this.props.selectsEnd,
          showWeekNumbers: this.props.showWeekNumbers,
          startDate: this.props.startDate,
          endDate: this.props.endDate,
          peekNextMonth: this.props.peekNextMonth,
          utcOffset: this.props.utcOffset })
      ));
    }
    return monthList;
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'react-datepicker' },
      _react2.default.createElement('div', { className: 'react-datepicker__triangle' }),
      this.renderPreviousMonthButton(),
      this.renderNextMonthButton(),
      this.renderMonths(),
      this.renderTodayButton()
    );
  }
});

module.exports = Calendar;
