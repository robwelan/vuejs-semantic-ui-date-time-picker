widgetDateTimeZone = (function() {
  // Control Panel Variables
  var eControlPanelClose;
  var eControlPanelCloseCalendar;
  var eControlPanelCloseTime;
  var eControlPanelCloseTimezone;
  var eControlPanelSave;
  var eControlPanelContainer;
  var eControlPanelCalendar;
  var eControlPanelTime;
  var eControlPanelShowDate;
  var eControlPanelShowDateLabel;
  var eControlPanelShowTime;
  var eControlPanelShowTimeLabel;
  var eControlPanelShowTimezone;
  var eControlPanelShowTimezoneLabel;
  var eControlPanelDestroy;
  var eControlPanelKeepEditing;
  var eControlPanelDiscard;
  // Calendar Variables
  var eInputYear;
  var eInputMonth;
  var eCalDays;
  var aMonthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var aMonthStrings = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  var aDayStrings = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  var oAriaLabelsDays = {
    1: 'first',
    2: 'second',
    3: 'third',
    4: 'fourth',
    5: 'fifth',
    6: 'sixth',
    7: 'seventh',
    8: 'eighth',
    9: 'ninth',
    10: 'tenth',
    11: 'eleventh',
    12: 'twelfth',
    13: 'thirteenth',
    14: 'fourteenth',
    15: 'fifteenth',
    16: 'sixteenth',
    17: 'seventeenth',
    18: 'eighteenth',
    19: 'nineteenth',
    20: 'twentieth',
    21: 'twenty first',
    22: 'twenty second',
    23: 'twenty third',
    24: 'twenty fourth',
    25: 'twenty fifth',
    26: 'twenty sixth',
    27: 'twenty seventh',
    28: 'twenty eighth',
    29: 'twenty ninth',
    30: 'thirtieth',
    31: 'thirty first'
  };
  var aDayCharacters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  // Clock Variables
  var eRowSeconds;
  var eRowMilliseconds;
  var eInputHour;
  var eInputMinute;
  var eInputSecond;
  var eInputMillisecond;
  var eButtonAM;
  var eButtonPM;
  var eHandHour;
  var eHandMinute;
  var eHandSecond;
  var eHandMillisecond;
  /* Time Zones */
  var SELECTED_AREA = 'Choose Area...';
  var SELECTED_LOCATION = 'Choose Location...';
  var eWrapButtons;
  var eAreas;
  var eLocations;
  var eListAreas;
  var eListLocations;
  var eTimezoneArea;
  var eTimezoneLocation;
  var eTimezoneAreaLabel;
  var eTimezoneLocationLabel;
  var eSearchArea;
  var eSearchLocation;
  var eSearchAreaIcon;
  var eSearchLocationIcon;
  var eButtonsAreas;
  var eButtonsLocations;
  var offsetTmz = [];

  // Shared Variables
  var state = {
    initialized: false,
    default: {
      date: new Date(),
      timezone: {
        guess: moment.tz.guess(),
        area: '',
        location: ''
      }
    },
    settings: {
      calendar: {
        lowestYearLimit: 1900
      },
      clock: {
        show: {
          seconds: false,
          milliseconds: false
        }
      },
      timezone: {
        listOfAreas: unpackTimeZones()
      }
    },
    values: {
      calendar: {
        date: null,
        dayOfWeek: 0,
        dayOfMonth: 0,
        month: 0,
        year: 0
      },
      clock: {
        time: null,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        meridiem: ''
      },
      timezone: {
       area: SELECTED_AREA,
       location: SELECTED_LOCATION,
       moment: ''
      }
    }
  };

  // Shared Functions
  function waterfallEmpty() {}

  function getElement(sElementName) {
    var ele = window.document.getElementById(sElementName);
    return ele;
  }

  // Control Panel Functions
  function closeUICalendar() {
    eControlPanelContainer.classList.remove('control-panel-slideleft');
    eControlPanelContainer.classList.add('control-panel-slideright');
    setTimeout(function() {
      eControlPanelCalendar.classList.add('hide');
      eControlPanelContainer.classList.remove('control-panel-slideright');
    }, 1000);
  }

  function addControlPanelEventListeners() {
    eControlPanelShowDate.addEventListener('click', function() {
      eControlPanelCalendar.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });

    eControlPanelShowTime.addEventListener('click', function() {
      eControlPanelTime.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });

    eControlPanelShowTimezone.addEventListener('click', function() {
      eControlPanelTimezone.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });

    eControlPanelCloseCalendar.addEventListener('click', function() {
      closeUICalendar();
    });

    eControlPanelCloseTime.addEventListener('click', function() {
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelTime.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
    });

    eControlPanelCloseTimezone.addEventListener('click', function() {
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelTimezone.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
    });

    eControlPanelClose.addEventListener('click', function() {
      eControlPanelDiscard.classList.remove('hide');
      eControlPanelDiscard.classList.add('active');
      eControlPanelDiscard.classList.remove('control-panel-slidedown');
      eControlPanelDiscard.classList.add('control-panel-slideup');
    });

    eControlPanelKeepEditing.addEventListener('click', function() {
      eControlPanelDiscard.classList.add('control-panel-slidedown');
      eControlPanelDiscard.classList.remove('control-panel-slideup');
      setTimeout(function() {
        eControlPanelDiscard.classList.add('hide');
        eControlPanelDiscard.classList.remove('active');
        eControlPanelDiscard.classList.remove('control-panel-slidedown');
      }, 1000);
    });

    eControlPanelSave.addEventListener('click', function() {});

    eControlPanelDestroy.addEventListener('click', function() {});
  }

  function getShortDateString(dDate) {
    var language = [window.navigator.userLanguage || window.navigator.language];
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
    return dDate.toLocaleDateString(language, options);
  }

  function defaultShortTimeString(dT) {
    // getHours returns the hours in local time zone from 0 to 23
    var hours = dT.getHours();
    // getMinutes returns the minutes in local time zone from 0 to 59
    var minutes = dT.getMinutes();
    // getSeconds returns the seconds in local time zone from 0 to 59
    var seconds = dT.getSeconds();
    // getMilliseconds returns the milliseconds in local time zone from 0 to 999
    var milliseconds = dT.getMilliseconds();
    var sH = '';
    var sM = '';
    var sS = '';
    var sMi = '';
    var meridiem = '';
    var s = '';

    // convert to 12-hour time format
    meridiem = (hours >= 12)? ' PM' : ' AM';
    hours = ((hours + 11) % 12 + 1);

    sH = hours.toString();

    // minutes and seconds should always be two digits long
    minutes < 10 ? sM = '0' + minutes.toString() : sM = minutes.toString();
    seconds < 10 ? sS = '0' + seconds.toString() : sS = seconds.toString();
    if (milliseconds < 10) {
      sMi = '00' + milliseconds.toString();
    } else if (milliseconds < 100) {
      sMi = '0' + milliseconds.toString();
    } else {
      sMi = milliseconds.toString();
    }
    
    // Start building time:
    s = sH + ':' + sM;

    if (state.settings.clock.show.seconds === true) {
      s = s + ':' + sS;
      if (state.settings.clock.show.milliseconds === true) {
        s = s + '.' + sMi;
      }
    }

    // Force value of seconds and milliseconds to zero if they are not to be displayed
    if (state.settings.clock.show.seconds === false) {
      state.values.clock.second = 0;
      state.values.clock.millisecond = 0;
    }
    if (state.settings.clock.show.milliseconds === false) {
      state.values.clock.millisecond = 0;
    }

    s = s + meridiem;

    return s;
  }

  function defaultTimezone() {
    var s = state.default.timezone.guess;

    return s;
  }

  function initializeControlPanelElements() {
    eControlPanelClose = getElement('ctl-control-panel-close');

    eControlPanelCloseCalendar = getElement('ctl-control-panel-close-calendar');
    eControlPanelCloseTime = getElement('ctl-control-panel-close-time');
    eControlPanelCloseTimezone = getElement('ctl-control-panel-close-timezone');

    eControlPanelContainer = getElement('control-panel-container');
    eControlPanelCalendar = getElement('control-panel-calendar');
    eControlPanelTime = getElement('control-panel-time');
    eControlPanelTimezone = getElement('control-panel-timezone');

    eControlPanelShowDate = getElement('ctl-control-panel-show-date');
    eControlPanelShowDateLabel = getElement(
      'ctl-control-panel-show-date-label'
    );

    eControlPanelShowTime = getElement('ctl-control-panel-show-time');
    eControlPanelShowTimeLabel = getElement(
      'ctl-control-panel-show-time-label'
    );

    eControlPanelShowTimezone = getElement('ctl-control-panel-show-timezone');
    eControlPanelShowTimezoneLabel = getElement(
      'ctl-control-panel-show-timezone-label'
    );

    eControlPanelDiscard = getElement('control-panel-card-check-discard');

    eControlPanelKeepEditing = getElement('ctl-control-panel-keep-editing');
    eControlPanelSave = getElement('ctl-control-panel-save');
    eControlPanelDestroy = getElement('ctl-control-panel-destroy');
  }

  function writeControlPanelShortDate(s) {
    eControlPanelShowDateLabel.textContent = s;
  }

  function writeControlPanelShortTime(s) {
    eControlPanelShowTimeLabel.textContent = s;
  }

  function writeControlPanelTimezone(s) {
    eControlPanelShowTimezoneLabel.textContent = s;
  }

  // Calendar
  function initializeCalendarElements() {
    eInputYear = getElement('input-year');
    eInputMonth = getElement('input-month');
    eCalDays = getElement('calendar-days');
  }

  function returnKeyStroke(e) {
    var code;
    if (!e) var e = window.event; // some browsers don't pass e, so get it from the window
    if (e.keyCode) {
      code = e.keyCode; // some browsers use e.keyCode
    } else if (e.which) {
      code = e.which; // others use e.which
    }
    return code;
  }

  function bindAllowedKeysYear() {
    eInputYear.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function bindAllowedKeysMonth() {
    eInputMonth.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function isValidDate(nY, nM, nD) {
    var d = new Date(nY, nM, nD);
    if (isNaN(d)) {
      return false;
    } else {
      return true;
    }
  }

  function changeCalendarControls(nY, nM, nD) {
    if (isValidDate(nY, nM, nD)) {
      state.values.calendar.date = new Date(nY, nM, nD);
    } else {
      state.values.calendar.date = new Date();
    }
    setDateNumbers(state.values.calendar.date);
    changeYear(state.values.calendar.year);
    changeMonth(state.values.calendar.month);
    changeDay(state.values.calendar.dayOfMonth, state.values.calendar.dayOfWeek);
  }

  function listenForEnterOnCalendarInputs() {
    eInputYear.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        state.values.calendar.year = Number(eInputYear.value);
        fixMonthInput();
        changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
        writeDays(state.values.calendar.year, state.values.calendar.month);
      }
    });
    eInputMonth.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        state.values.calendar.month = Number(eInputMonth.value - 1);
        fixMonthInput();
        changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
        writeDays(state.values.calendar.year, state.values.calendar.month);
      }
    });
  }

  function setDateNumbers(d) {
    state.values.calendar.dayOfWeek = d.getDay();
    state.values.calendar.dayOfMonth = d.getDate();
    state.values.calendar.month = d.getMonth();
    state.values.calendar.year = d.getFullYear();
  }

  function changeYear(n) {
    eInputYear.value = n;
  }

  function changeMonth(n) {
    eInputMonth.value = aMonthNumbers[n];
  }

  function changeDay(nM, nW) {
    aDayStrings[nW];
  }

  function writeCalendarLabels() {
    var eRow = window.document.getElementById('label-days');
    var content;
    var aDays = aDayCharacters.map(function(x, i, a) {
      var aClasses = ['day-label'];

      if (i === 0) {
        aClasses.push('left');
      }
      if (i === a.length - 1) {
        aClasses.push('right');
      }

      eRow.insertAdjacentHTML(
        'beforeend',
        '<div class="' + aClasses.join(' ').trim() + '">' + x + '</div>'
      );
    });
  }

  function addDays(date, days) {
    var dTemp = new Date(date);
    dTemp.setDate(dTemp.getDate() + days);
    return dTemp;
  }

  function uiClickDay(e) {
    var eTarget = e.target;
    var nButtonYear = Number(eTarget.getAttribute('data-year'));
    var nButtonMonth = Number(eTarget.getAttribute('data-month'));
    var nButtonDay = Number(eTarget.getAttribute('data-day'));
    var sButtonYearMonth = nButtonYear.toString() + nButtonMonth.toString();
    var sYearMonth = state.values.calendar.year.toString() + state.values.calendar.month.toString();
    var bIsBigChange = false;
    if (sButtonYearMonth !== sYearMonth) {
      bIsBigChange = true;
      state.values.calendar.year = nButtonYear;
      state.values.calendar.month = nButtonMonth;
    }
    state.values.calendar.dayOfMonth = nButtonDay;
    if (bIsBigChange === true) {
      // re-write cal
      changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
      writeDays(state.values.calendar.year, state.values.calendar.month);
//      closeUICalendar();
    } else {
      // change selected day
      var buttons = document.getElementsByClassName('ctl-day');
      var i = 0;
      var length = buttons.length;
      for (i; i < length; i++) {
        buttons[i].classList.remove('hasactive');
        buttons[i].classList.remove('active');
      }
      eTarget.classList.add('active');

      var dSelected = new Date(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
      state.values.calendar.date = dSelected;
      writeControlPanelShortDate(getShortDateString(dSelected));
//      closeUICalendar();
    }
  }

  function listenForButtonClicksOnDays() {
    var buttons = window.document.getElementsByClassName('ctl-day');
    var i = 0;
    var length = buttons.length;
    for (i; i < length; i++) {
      if (window.document.addEventListener) {
        buttons[i].addEventListener('click', uiClickDay);
      } else {
        buttons[i].attachEvent('onclick', uiClickDay);
      }
    }
  }

  function writeDays(nY, nM) {
    if (state.initialized === true) {
      // remove the button click listeners
      ignoreForButtonClicksOnDays();
    }
    var dFirstDayThisMonth = new Date(nY, nM, 1);
    var dFirstDayNextMonth = new Date(nY, nM + 1, 1);
    var dLastDayThisMonth = new Date(dFirstDayNextMonth - 1);
    var nMonthWeekDayStart = dFirstDayThisMonth.getDay();
    var nMonthWeekDayEnd = dLastDayThisMonth.getDay();
    var dCalDateStart = new Date(nY, nM, nMonthWeekDayStart * -1 + 1);
    var dCalDateEnd = addDays(dLastDayThisMonth, 6 - nMonthWeekDayEnd);
    var aWeek = [];
    var aWeekDay = [];
    var oWeekDay = {};

    aWeekDay = [];
    nD = 0;

    for (var d = dCalDateStart; d <= dCalDateEnd; d = addDays(d, 1)) {
      oWeekDay = {
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate()
      };
      if (nD < 6) {
        aWeekDay.push(oWeekDay);
        nD++;
      } else {
        aWeekDay.push(oWeekDay);
        aWeek.push(aWeekDay);
        aWeekDay = [];
        nD = 0;
      }
    }

    var sButton = '';
    var sWN = '';
    var aClasses;
    var aHtml = [];
    var o = {};
    var i = 0;

    for (var x = 0; x < aWeek.length; x++) {
      x < 10 ? (sWN = '0' + x) : (sWN = x.toString());

      aHtml.push('<div class="calendar-row" id="week-' + sWN + '">');

      for (var y = 0; y < aWeek[x].length; y++) {
        o = aWeek[x][y];
        sButton = '';
        aClasses = ['ctl-day'];

        if (y === 0) {
          aClasses.push('left');
        }
        if (y === 6) {
          aClasses.push('right');
        }
        if (o.month !== state.values.calendar.month) {
          aClasses.push('mute');
        }
        if (o.year === state.values.calendar.year && o.month === state.values.calendar.month && o.day === state.values.calendar.dayOfMonth) {
          aClasses.push('active');
        }
        if (x === 0) {
          aClasses.push('right');
          aClasses.push('top');
          aClasses.push('bottom');
          if (y === 0) {
            aClasses.push('btlr');
          }
          if (y === 6) {
            aClasses.push('btrr');
          }
        }
        if (x > 0 && x < aWeek.length - 1) {
          aClasses.push('right');
          aClasses.push('bottom');
        }
        if (x === aWeek.length - 1) {
          aClasses.push('right');
          aClasses.push('bottom');
          if (y === 0) {
            aClasses.push('bblr');
          }
          if (y === 6) {
            aClasses.push('bbrr');
          }
        }

        sButton +=
          '<button class="' +
          aClasses.join(' ').trim() +
          '" type="button" aria-label="' +
          o.year +
          '-' +
          (Number(o.month) + 1) +
          '-' +
          o.day +
          '" data-year="' +
          o.year +
          '" data-month="' +
          o.month +
          '"' +
          ' data-day="' +
          o.day +
          '">';
        sButton += o.day.toString();
        sButton += '</button>';

        aHtml.push(sButton);
        i++;
      }
      aHtml.push('</div>');
    }

    eCalDays.innerHTML = aHtml.join('');

    // this listen event must run after Days are written to UI.
    listenForButtonClicksOnDays();

    var dSelected = new Date(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
    writeControlPanelShortDate(getShortDateString(dSelected));
  }

  function handleYM(event, sField, sCommand) {
    if (sField === 'y') {
      if (sCommand === '<') {
        state.values.calendar.year -= 1;
        if (state.values.calendar.year < state.settings.calendar.lowestYearLimit) {
          state.values.calendar.year = state.settings.calendar.lowestYearLimit;
        }
      }
      if (sCommand === '>') {
        state.values.calendar.year += 1;
      }
    }
    if (sField === 'm') {
      if (sCommand === '<') {
        state.values.calendar.month -= 1;
        if (state.values.calendar.month < 0) {
          state.values.calendar.month = 12 - 1;
        }
      }
      if (sCommand === '>') {
        state.values.calendar.month += 1;
        if (state.values.calendar.month > 12 - 1) {
          state.values.calendar.month = 0;
        }
      }
    }
    changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
    writeDays(state.values.calendar.year, state.values.calendar.month);
  }

  function handleYear(event, sCommand) {
    handleYM(event, 'y', sCommand);
  }

  function handleMonth(event, sCommand) {
    handleYM(event, 'm', sCommand);
  }

  function isDifferentYear() {
    var nTemp = Number(eInputYear.value);
    if (nTemp !== Number(state.values.calendar.year) || eInputYear.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function isDifferentMonth() {
    var nTemp = Number(eInputMonth.value) - 1;
    if (nTemp !== Number(state.values.calendar.month) || eInputMonth.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function fixYearInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputYear.value);

    if (nTemp < state.settings.calendar.lowestYearLimit || eInputYear.value === '') {
      state.values.calendar.year = state.settings.calendar.lowestYearLimit;
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputYear.value = state.values.calendar.year;
    }
  }

  function fixMonthInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputMonth.value) - 1;

    if (nTemp > 12) {
      nTemp = 11;
      bNeedsFix = true;
    }
    if (nTemp < 0) {
      nTemp = 0;
      bNeedsFix = true;
    }
    if (nTemp.toString() !== state.values.calendar.month.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputMonth.value = nTemp;
      state.values.calendar.month = nTemp;
    }
  }

  function directBlurYear(e) {
    if (isDifferentYear() === false) {
      return;
    }
    if (eInputYear.value === '') {
      state.values.calendar.year = state.settings.calendar.lowestYearLimit;
    } else {
      state.values.calendar.year = Number(eInputYear.value);
    }
    if (state.values.calendar.year < state.settings.calendar.lowestYearLimit) {
      state.values.calendar.year = state.settings.calendar.lowestYearLimit;
    }
    fixYearInput();
    changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
    writeDays(state.values.calendar.year, state.values.calendar.month);
  }

  function directBlurMonth(e) {
    if (isDifferentMonth() === false) {
      return;
    }
    fixMonthInput();
    changeCalendarControls(state.values.calendar.year, state.values.calendar.month, state.values.calendar.dayOfMonth);
    writeDays(state.values.calendar.year, state.values.calendar.month);
  }

  function setToday() {
    // force set to today's date
    state.values.calendar.date = new Date();
    setDateNumbers(state.values.calendar.date);
    changeMonth(state.values.calendar.month);
    changeYear(state.values.calendar.year);
    changeDay(state.values.calendar.dayOfMonth, state.values.calendar.dayOfWeek);
    writeDays(state.values.calendar.year, state.values.calendar.month);
  }

  // Clock
  function initializeClockElements() {
    eRowSeconds = getElement('row-seconds');
    eRowMilliseconds = getElement('row-milliseconds');
    eInputHour = getElement('input-hour');
    eInputMinute = getElement('input-minute');
    eInputSecond = getElement('input-second');
    eInputMillisecond = getElement('input-millisecond');
    eButtonAM = getElement('btn-am');
    eButtonPM = getElement('btn-pm');
    eHandHour = getElement('hour-hand');
    eHandMinute = getElement('minute-hand');
    eHandSecond = getElement('second-hand');
    eHandMillisecond = getElement('millisecond-hand');
  }

  function changeHour(n) {
    var nRotateHour = n;

    nRotateHour = nRotateHour % 12;
    nRotateHour = nRotateHour ? nRotateHour : 12; // the hour '0' should be '12'

    eInputHour.value = nRotateHour;
  }

  function changeMinute(n) {
    eInputMinute.value = n;
  }

  function changeSecond(n) {
    eInputSecond.value = n;
  }

  function changeMillisecond(n) {
    eInputMillisecond.value = n;
  }

  function rotateHands() {
    var nRotateHour = state.values.clock.hour;

    nRotateHour = nRotateHour % 12;
    nRotateHour = nRotateHour ? nRotateHour : 12; // the hour '0' should be '12'

    eHandHour.style.transform =
      'rotate(' + (nRotateHour * 30 + state.values.clock.minute / 2) + 'deg)';
    eHandMinute.style.transform = 'rotate(' + state.values.clock.minute * 6 + 'deg)';
    eHandSecond.style.transform = 'rotate(' + state.values.clock.second * 6 + 'deg)';
    eHandMillisecond.style.transform =
      'rotate(' + Math.floor(state.values.clock.millisecond / 1000 * 360) + 'deg)';
  }

  function setTimeNumbers(t) {
    state.values.clock.hour = t.getHours();
    state.values.clock.minute = t.getMinutes();
    state.values.clock.second = t.getSeconds();
    state.values.clock.millisecond = t.getMilliseconds();
    state.values.clock.meridiem = state.values.clock.hour >= 12 ? 'pm' : 'am';

    if (state.values.clock.meridiem === 'am') {
      eButtonPM.classList.remove('active');
      eButtonAM.classList.add('active');
    } else {
      eButtonAM.classList.remove('active');
      eButtonPM.classList.add('active');
    }
    rotateHands();
  }

  function fixHoursInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputHour.value);

    if (nTemp > 12) {
      nTemp = 12;
      bNeedsFix = true;
    }
    if (nTemp < 1) {
      nTemp = 1;
      bNeedsFix = true;
    }
    if (nTemp.toString() !== state.values.clock.hour.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputHour.value = nTemp;
      if (state.values.clock.meridiem === 'pm') {
        state.values.clock.hour = nTemp + 12;
      } else {
        state.values.clock.hour = nTemp;
      }
    }
  }

  function isValidTime(nHr, nMn, nSs, nMs) {
    var d = new Date(1970, 1, 1, nHr, nMn, nSs, nMs);
    if (isNaN(d)) {
      return false;
    } else {
      return true;
    }
  }

  function changeTimeControls(nHr, nMn, nSs, nMs, sM) {
    if (isValidTime(nHr, nMn, nSs, nMs)) {
      state.values.clock.time = new Date(1970, 1, 1, nHr, nMn, nSs, nMs);
    } else {
      state.values.clock.time = new Date();
    }
    setTimeNumbers(state.values.clock.time);
    changeHour(state.values.clock.hour);
    changeMinute(state.values.clock.minute);
    changeSecond(state.values.clock.second);
    changeMillisecond(state.values.clock.millisecond);

    writeControlPanelShortTime(defaultShortTimeString(state.values.clock.time))
  }

  function fixMinutesOrSecondsInput(sType) {
    var bNeedsFix = false;
    var nTemp;
    var nValue;
    if (sType === 'minutes') {
      nTemp = Number(eInputMinute.value);
      nValue = state.values.clock.minute;
    }
    if (sType === 'seconds') {
      nTemp = Number(eInputSecond.value);
      nValue = state.values.clock.second;
    }
    
    if (nTemp > 59) {
      nTemp = 59;
      bNeedsFix = true;
    }
    if (nTemp < 0) {
      nTemp = 0;
      bNeedsFix = true;
    }
    if (nTemp.toString() !== nValue.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      if (sType === 'minutes') {
        eInputMinute.value = nTemp;
        state.values.clock.minute = nTemp;
      }
      if (sType === 'seconds') {
        eInputSecond.value = nTemp;
        state.values.clock.second = nTemp;
      }
    }
  }

  function fixMillisecondsInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputMillisecond.value);

    if (nTemp > 999) {
      nTemp = 999;
      bNeedsFix = true;
    }
    if (nTemp < 0) {
      nTemp = 0;
      bNeedsFix = true;
    }
    if (nTemp.toString() !== state.values.clock.millisecond.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputMillisecond.value = nTemp;
      state.values.clock.millisecond = nTemp;
    }    
  }

  function listenForEnterOnTimeInputs() {
    eInputHour.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputHour, state.values.clock.hour, 'hour') === false) {
          return;
        }
        fixHoursInput();
        changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
      }
    });
    eInputMinute.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputMinute, state.values.clock.minute, '') === false) {
          return;
        }
        fixMinutesOrSecondsInput('minutes');
        changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
      }
    });
    eInputSecond.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputSecond, state.values.clock.second, '') === false) {
          return;
        }
        fixMinutesOrSecondsInput('seconds');
        changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
      }
    });
    eInputMillisecond.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputMillisecond, state.values.clock.millisecond, '') === false) {
          return;
        }
        fixMillisecondsInput();
        changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
      }
    });
  }

  function bindAllowedKeysHour() {
    eInputHour.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function bindAllowedKeysMinute() {
    eInputMinute.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function bindAllowedKeysSecond() {
    eInputSecond.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function bindAllowedKeysMillisecond() {
    eInputMillisecond.onkeydown = function(e) {
      var keyCode = returnKeyStroke(e);
      if (
        !(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )
      ) {
        return false;
      }
    };
  }

  function isDifferentTime(eT, nT, sSpecial) {
    var nTemp = Number(eT.value);
    if (sSpecial === 'hour') {
      if (state.values.clock.meridiem === 'pm') {
        nTemp += 12;
      }
    }
    if (nTemp !== Number(nT) || eT.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function directBlurHours(e) {
    if (isDifferentTime(eInputHour, state.values.clock.hour, 'hour') === false) {
      return;
    }
    fixHoursInput();
    changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
  }

  function directBlurMinutes(e) {
    if (isDifferentTime(eInputMinute, state.values.clock.minute, '') === false) {
      return;
    }
    fixMinutesOrSecondsInput('minutes');
    changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
  }

  function directBlurSeconds(e) {
    if (isDifferentTime(eInputSecond, state.values.clock.second, '') === false) {
      return;
    }
    fixMinutesOrSecondsInput('seconds');
    changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
  }

  function directBlurMilliseconds(e) {
    if (isDifferentTime(eInputMillisecond, state.values.clock.millisecond, '') === false) {
      return;
    }
    fixMillisecondsInput();
    changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
  }

  function handleHMSM(event, sField, sCommand) {
    if (sField === 'hr') {
      if (sCommand === '<') {
        state.values.clock.hour -= 1;
        if (state.values.clock.hour < 0) {
          state.values.clock.hour = 23;
        }
      }
      if (sCommand === '>') {
        state.values.clock.hour += 1;
        if (state.values.clock.hour > 23) {
          state.values.clock.hour = 0;
        }
      }
    }
    if (sField === 'mn') {
      if (sCommand === '<') {
        state.values.clock.minute -= 1;
        if (state.values.clock.minute < 0) {
          state.values.clock.minute = 59;
        }
      }
      if (sCommand === '>') {
        state.values.clock.minute += 1;
        if (state.values.clock.minute > 59) {
          state.values.clock.minute = 0;
        }
      }
    }
    if (sField === 'ss') {
      if (sCommand === '<') {
        state.values.clock.second -= 1;
        if (state.values.clock.second < 0) {
          state.values.clock.second = 59;
        }
      }
      if (sCommand === '>') {
        state.values.clock.second += 1;
        if (state.values.clock.second > 59) {
          state.values.clock.second = 0;
        }
      }
    }
    if (sField === 'ms') {
      if (sCommand === '<') {
        state.values.clock.millisecond -= 1;
        if (state.values.clock.millisecond < 0) {
          state.values.clock.millisecond = 999;
        }
      }
      if (sCommand === '>') {
        state.values.clock.millisecond += 1;
        if (state.values.clock.millisecond > 999) {
          state.values.clock.millisecond = 0;
        }
      }
    }
    if (sField === 'ampm') {
      if (state.values.clock.meridiem === sCommand) {
        return; // already set
      }
      if (sCommand === 'am') {
        state.values.clock.meridiem = 'am';
        state.values.clock.hour -= 12;
      }
      if (sCommand === 'pm') {
        state.values.clock.meridiem = 'pm';
        state.values.clock.hour += 12;
      }
    }

    changeTimeControls(state.values.clock.hour, state.values.clock.minute, state.values.clock.second, state.values.clock.millisecond, state.values.clock.meridiem);
  }

  function handleHours(event, sCommand) {
    handleHMSM(event, 'hr', sCommand);
  }

  function handleMinutes(event, sCommand) {
    handleHMSM(event, 'mn', sCommand);
  }

  function handleSeconds(event, sCommand) {
    handleHMSM(event, 'ss', sCommand);
  }

  function handleMilliseconds(event, sCommand) {
    handleHMSM(event, 'ms', sCommand);
  }

  function handleAMPM(event, sCommand) {
    handleHMSM(event, 'ampm', sCommand);
  }

  function controlVisibilityOfHands(o) {
    if (typeof o === 'undefined') {
      return
    }
    if (o.show.seconds === true) {
      state.settings.clock.show.seconds = true;
      eRowSeconds.classList.add('active');
      eHandSecond.classList.add('active');
      if (o.show.milliseconds === true) {
        state.settings.clock.show.milliseconds = true;
        eRowMilliseconds.classList.add('active');
        eHandMillisecond.classList.add('active');
      }
    }
  }

  // Timezone
  function initializeTimezoneElements () {
    eWrapButtons = getElement('wrap-timezone-buttons');
    eAreas = getElement('areas');
    eLocations = getElement('locations');
    eListAreas = getElement('list-areas');
    eListLocations = getElement('list-locations');
    eTimezoneArea = getElement('timezone-area');
    eTimezoneLocation = getElement('timezone-location');
    eTimezoneAreaLabel = getElement('timezone-area-label');
    eTimezoneLocationLabel = getElement('timezone-location-label');
    eSearchArea = getElement('search-area');
    eSearchLocation = getElement('search-location');
    eSearchAreaIcon = getElement('search-area-icon');
    eSearchLocationIcon = getElement('search-location-icon');
  }

  function animateWrapButtonsIn() {
    eWrapButtons.classList.remove('wrap-buttons-slideup');
    eWrapButtons.classList.add('wrap-buttons-slidedown');
  }

  function animateWrapButtonsOut() {
    eWrapButtons.classList.remove('wrap-buttons-slidedown');
    eWrapButtons.classList.add('wrap-buttons-slideup');
  }

  function animateAreaIn() {
    eAreas.classList.remove('timezone-controls-slideup');
    eAreas.classList.add('timezone-controls-slidedown');
  }

  function animateAreaOut() {
    eAreas.classList.remove('timezone-controls-slidedown');
    eAreas.classList.add('timezone-controls-slideup');
  }

  function animateLocationIn() {
    eLocations.classList.remove('timezone-controls-slideup');
    eLocations.classList.add('timezone-controls-slidedown');
  }

  function animateLocationOut() {
    eLocations.classList.remove('timezone-controls-slidedown');
    eLocations.classList.add('timezone-controls-slideup');
  }

  function outputPointyEnd(sFromWhere) {
    console.log('From Where:', sFromWhere);
    console.log('selected', state);
  }

  function filterListOff(eList, eSearch, eIcon) {
    var li = eList.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
      li[i].style.display = '';
    }

    eSearch.value = '';

    eIcon.classList.remove('close');
    eIcon.classList.add('search');
    eIcon.setAttribute('data-type', 'search');
  }

  function filterListAreas(e) {
    filter = e.target.value.toLowerCase();
    if (filter !== '') {
      eSearchAreaIcon.classList.remove('search');
      eSearchAreaIcon.classList.add('close');
      eSearchAreaIcon.setAttribute('data-type', 'clear');
    } else {
      eSearchAreaIcon.classList.remove('close');
      eSearchAreaIcon.classList.add('search');
      eSearchAreaIcon.setAttribute('data-type', 'search');
    }
    var li = eListAreas.getElementsByTagName('li');
    var button, sData;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      button = li[i].getElementsByTagName('button')[0];
      sData = button.getAttribute('data-area').toLowerCase();

      if (sData.indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  function filterListLocations(e) {
    filter = e.target.value.toLowerCase();
    if (filter !== '') {
      eSearchLocationIcon.classList.remove('search');
      eSearchLocationIcon.classList.add('close');
      eSearchLocationIcon.setAttribute('data-type', 'clear');
    } else {
      eSearchLocationIcon.classList.remove('close');
      eSearchLocationIcon.classList.add('search');
      eSearchLocationIcon.setAttribute('data-type', 'search');
    }
    li = eListLocations.getElementsByTagName('li');
    var button, sData;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      button = li[i].getElementsByTagName('button')[0];

      sData = button.getAttribute('data-search').toLowerCase();

      if (sData.indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  function returnGeneratedButtonAll(sType) {
    var button = window.document.createElement('button');
    var img = window.document.createElement('img');
    var sMainClass = '';

    if (sType === 'location-area') {
      sMainClass = 'ctl-listitem-location';
      button.setAttribute('data-location-ui', 'All Areas...');
      button.setAttribute('data-area', 'All Areas');
      button.setAttribute('data-search', 'All Areas');
    } else if (sType === 'location-location') {
      sMainClass = 'ctl-listitem-location';
      button.setAttribute('data-location-ui', 'All Locations...');
      button.setAttribute('data-area', 'All Locations');
      button.setAttribute('data-search', 'All Locations');
    } else {
      sMainClass = 'ctl-listitem-area';
      button.setAttribute('data-area', 'All Locations');
    }

    var aButtonClasses = [sMainClass];

    if (sType !== 'location-location') {
      aButtonClasses.push('btlr');
      aButtonClasses.push('btrr');
    }

    button.className = aButtonClasses.join(' ').trim();

    img.src = 'images/50x50/etc.png';
    img.alt = '';

    button.appendChild(img);

    if (sType === 'location-area') {
      button.appendChild(window.document.createTextNode('All Areas...'));
    } else if (sType === 'location-location') {
      button.appendChild(window.document.createTextNode('All Locations...'));
    } else {
      button.appendChild(window.document.createTextNode('All Locations...'));
    }

    return button;
  }

  function createListAreas(aP) {
    var frag = window.document.createDocumentFragment();
    var li = window.document.createElement('li');

    button = returnGeneratedButtonAll('area');
    li.appendChild(button);
    frag.appendChild(li);

    var aT = aP.map(function(oListItem, index) {
      var sLIlc = oListItem.toLowerCase();
      var s = '<img src="images/50x50/' + sLIlc + '.png" alt="">' + oListItem;

      var button = window.document.createElement('button');
      var img = window.document.createElement('img');
      li = window.document.createElement('li');

      button = window.document.createElement('button');
      button.setAttribute('data-area', oListItem);
      aButtonClasses = ['ctl-listitem-area'];

      if (index === aP.length - 1) {
        aButtonClasses.push('bblr');
        aButtonClasses.push('bbrr');
      }

      if (state.default.timezone.area.toLowerCase() === sLIlc) {
        aButtonClasses.push('active');
      }

      button.className = aButtonClasses.join(' ').trim();

      img = window.document.createElement('img');
      img.src = 'images/50x50/' + sLIlc + '.png';
      img.alt = '';

      button.appendChild(img);
      button.appendChild(window.document.createTextNode(oListItem));

      li.appendChild(button);
      frag.appendChild(li);
      return s;
    });
    eListAreas.appendChild(frag);
  }

  function deleteListItems(ele) {
    // make sure you pass a UI element...
    if (ele) {
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
    }
  }

  function createListLocations(aP, bForceAll) {
    deleteListItems(eListLocations);

    var frag = window.document.createDocumentFragment();
    var li = window.document.createElement('li');
    var button = window.document.createElement('button');
    var liArea = window.document.createElement('li');
    var liLocation = window.document.createElement('li');
    var buttonArea = window.document.createElement('button');
    var buttonLocation = window.document.createElement('button');
    var sLIlc;
    var s;
    var oNow = moment();
    var res = [];

    if (state.default.timezone.isGuessed === true && bForceAll === false) {
      res = aP.filter(function(x) {
        if (x.sZoneParent === state.values.timezone.area) {
          return x;
        }
      });
    } else {
      res = aP.filter(function(x) {
        return x;
      });
    }

    res.sort(function(a, b) {
      var sA = a.timeZoneId.toLowerCase();
      var sB = b.timeZoneId.toLowerCase();

      if (sA < sB) {
        return -1;
      }
      if (sA > sB) {
        return 1;
      }

      return 0;
    });

    buttonArea = returnGeneratedButtonAll('location-area');
    buttonLocation = returnGeneratedButtonAll('location-location');

    liArea.appendChild(buttonArea);
    frag.appendChild(liArea);
    liLocation.appendChild(buttonLocation);
    frag.appendChild(liLocation);

    for (var i = 0; i < res.length; i++) {
      if (res[i].sZoneParent.toLowerCase() === 'etc') {
        continue;
      }

      li = window.document.createElement('li');
      button = window.document.createElement('button');
      var img = window.document.createElement('img');
      var spanTitle = window.document.createElement('span');
      var spanAbout = window.document.createElement('span');
      var aButtonClasses = ['ctl-listitem-location'];
      var sLIlc = res[i].sZoneParent.toLowerCase();
      var s = '<img src="images/50x50/' + sLIlc + '.png" alt="">' + sLIlc;

      if (i === res.length - 1) {
        aButtonClasses.push('bblr');
        aButtonClasses.push('bbrr');
      }

      if (
        state.values.timezone.location.toLowerCase() === res[i].sZoneChild.toLowerCase()
      ) {
        aButtonClasses.push('active');
      }

      button.setAttribute('data-area', res[i].sZoneParent);
      button.setAttribute('data-location', res[i].sZoneChild);
      button.setAttribute('data-location-ui', res[i].sZoneChildUI);
      button.setAttribute('data-tzid', res[i].timeZoneId);
      button.setAttribute('data-search', res[i].locationSearchString);
      button.className = aButtonClasses.join(' ').trim();

      img.src = 'images/50x50/' + sLIlc + '.png';
      img.alt = '';

      spanTitle.setAttribute('class', 'tz-title');
      spanAbout.setAttribute('class', 'tz-detail');

      spanTitle.appendChild(
        window.document.createTextNode(res[i].sZoneChildUI)
      );
      spanAbout.appendChild(
        window.document.createTextNode(
          oNow.tz(res[i].timeZoneId).format('hh:mm a') +
            ' (' +
            res[i].timeZoneLabel +
            ')'
        )
      );

      button.appendChild(img);
      button.appendChild(spanTitle);
      button.appendChild(spanAbout);

      li.appendChild(button);
      frag.appendChild(li);
    }

    eListLocations.appendChild(frag);
  }

  function unpackTimeZones() {
    return moment.tz.names()
      .map(function(s) {
        if (s.indexOf('/') > -1) {
          var sZoneParent = s.substr(0, s.indexOf('/'));

          if (typeof sZoneParent != 'undefined') {
            if (sZoneParent.toLowerCase() !== 'etc') {
              return sZoneParent;
            }
          }
        }
      })
      .filter(function(value, index, self) {
        return self.indexOf(value) === index;
      })
      .filter(function(element) {
        return element !== undefined;
      })
      .sort();
  }

  function returnZoneParent(s) {
    var nI = s.indexOf('/');
    var sT = s;
    if (nI !== -1) {
      sT = s.substr(0, nI);
    }
    return sT;
  }

  function returnZoneChild(s) {
    var nI = s.indexOf('/');
    var sT = s;
    var hasID = false;

    if (nI !== -1) {
      sT = s.substr(nI + 1, s.length);
      hasID = true;
    }
    var res = sT.replace(/_/g, ' ');
    return {
      raw: sT,
      formatted: res,
      hasID: hasID
    };
  }

  function getAsyncTZs() {

    var other = '';

    state.values.timezone.area = SELECTED_AREA;
    state.values.timezone.location = SELECTED_LOCATION;

    if (typeof state.default.timezone.guess != 'undefined') {
        state.default.timezone.moment = state.default.timezone.guess;
        state.default.timezone.area = returnZoneParent(state.default.timezone.guess);
        state.default.timezone.location = returnZoneChild(state.default.timezone.guess).raw;
        state.default.timezone.isGuessed = true;

      setLabelArea(state.default.timezone.area);
      setLabelLocation(state.default.timezone.location);
      state.values.timezone.moment = state.default.timezone.guess;
    } else {
        state.default.timezone.moment = state.default.timezone.guess;
        state.default.timezone.area = state.values.timezone.area;
        state.default.timezone.location = state.values.timezone.location;
        state.default.timezone.isGuessed = false;

      setLabelArea(state.values.timezone.area);
      setLabelLocation(state.values.timezone.location);
    }

    var oZoneChildTemp;
    var sTimeZoneTemp;
    for (var i in moment.tz.names()) {
      oZoneChildTemp = null;
      oZoneChildTemp = returnZoneChild(moment.tz.names()[i]);

      if (oZoneChildTemp.hasID === true) {
        sTimeZoneTemp = moment.tz(moment.tz.names()[i]).format('Z');
        offsetTmz.push({
          sZoneParent: returnZoneParent(moment.tz.names()[i]),
          sZoneChild: oZoneChildTemp.raw,
          sZoneChildUI: oZoneChildTemp.formatted,
          bHasID: oZoneChildTemp.hasID,
          timeZoneId: moment.tz.names()[i],
          timeZone: sTimeZoneTemp,
          timeZoneAbbreviation: moment.tz(moment.tz.names()[i]).format('z'),
          timeZoneLabel: 'GMT' + sTimeZoneTemp.toString(),
          locationSearchString:
            oZoneChildTemp.formatted + 'GMT' + sTimeZoneTemp.toString()
        });
      } // oZoneChildTemp.hasID === true
    }

    async.waterfall([
      waterfallEmpty,
      createListAreas(state.settings.timezone.listOfAreas),
      createListLocations(offsetTmz, false),
      addListeners(),
      listenerClickLocations(eButtonsLocations)
    ]);
  }

  function removeActiveFromButtons(ele) {
    for (var i = 0; i < ele.length; i++) {
      ele[i].classList.remove('active');
    }
  }

  function addClassToClickedButton(ele, sClass) {
    var eButton = ele;
    var sNodeName = ele.nodeName.toLowerCase();
    if (sNodeName !== 'button') {
      eButton = ele.parentElement;
    }
    eButton.classList.add(sClass);
  }

  function onClickButtonArea(event) {
    var btnAttribute = this.getAttribute('data-area');

    setDefaultsForButtons();
    removeListenerClickLocations(eButtonsLocations);

    state.values.timezone.area = btnAttribute;
    state.values.timezone.location = SELECTED_LOCATION;
    state.values.timezone.moment = '';

    if (btnAttribute !== 'All Locations') {
      createListLocations(offsetTmz, false);
    } else {
      createListLocations(offsetTmz, true);
    }

    listenerClickLocations(eButtonsLocations);
    setLabelArea(btnAttribute);
    setLabelLocation(SELECTED_LOCATION);

    async.waterfall([
      waterfallEmpty,
      removeActiveFromButtons(eButtonsAreas),
      addClassToClickedButton(event.target, 'active')
    ]);

    async.waterfall([
      waterfallEmpty,
      animateAreaOut(),
      setTimeout(function() {
        eAreas.classList.add('hide');
        eAreas.classList.remove('timezone-controls-slideup');
        eLocations.classList.remove('hide');
        animateLocationIn();
      }, 1000)
    ]);
    outputPointyEnd(onClickButtonArea.name);
  }

  function setDefaultsForButtons() {
    eSearchArea.value = '';
    eSearchLocation.value = '';
    eSearchAreaIcon.setAttribute('data-type', 'search');
    eSearchLocationIcon.setAttribute('data-type', 'search');
  }

  function setMomentInTime(sId) {
    state.values.timezone.moment = sId;
  }

  function onClickButtonLocation(event) {
    var attributeArea = this.getAttribute('data-area');
    var attributeLocation = this.getAttribute('data-location');
    var attributeLocationUI = this.getAttribute('data-location-ui');
    var attributeIdentifier = this.getAttribute('data-tzid');
    var sLastArea = state.values.timezone.area.toLowerCase();
    var sLastLocation = state.values.timezone.location.toLowerCase();

    setDefaultsForButtons();

    async.waterfall([
      waterfallEmpty,
      removeActiveFromButtons(eButtonsLocations),
      addClassToClickedButton(event.target, 'active')
    ]);

    // what happens when all areas is selected
    // what happens when all locations is selected
    // what happens when a location is selected
    if (attributeArea === 'All Areas') {
      async.waterfall([
        waterfallEmpty,
        animateLocationOut(),
        setTimeout(function() {
          eAreas.classList.remove('hide');
          eLocations.classList.add('hide');
          animateAreaIn();
        }, 1000)
      ]);

      removeActiveFromButtons(eButtonsAreas);
      removeActiveFromButtons(eButtonsLocations);

      setLabelArea(SELECTED_AREA);
      setLabelLocation(SELECTED_LOCATION);
      state.values.timezone.moment = '';
    } else if (attributeArea === 'All Locations') {
      state.values.timezone.moment = '';

      if (sLastLocation !== 'choose location...') {
        async.waterfall([
          waterfallEmpty,
          removeActiveFromButtons(eButtonsLocations),
          removeActiveFromButtons(eButtonsAreas),
          setLabelLocation(SELECTED_LOCATION),
          setLabelArea(SELECTED_AREA),
          removeListenerClickLocations(eButtonsLocations),
          animateLocationOut(),
          setTimeout(function() {
            createListLocations(offsetTmz, true);
            listenerClickLocations(eButtonsLocations);
            animateLocationIn();
          }, 1000)
        ]);
      } else {
        if (sLastArea !== 'all locations') {
          if (sLastArea === 'choose area...' && sLastLocation === 'choose location...') {
            // do nothing
          } else {
            async.waterfall([
              waterfallEmpty,
              removeActiveFromButtons(eButtonsLocations),
              removeActiveFromButtons(eButtonsAreas),
              setLabelLocation(SELECTED_LOCATION),
              setLabelArea(SELECTED_AREA),
              removeListenerClickLocations(eButtonsLocations),
              animateLocationOut(),
              setTimeout(function() {
                createListLocations(offsetTmz, true);
                listenerClickLocations(eButtonsLocations);
                animateLocationIn();
              }, 1000)
            ]);
          }
        }
      }
    } else {
      eWrapButtons.classList.remove('hide');
      animateWrapButtonsIn();
      
      setLabelArea(attributeArea);
      setLabelLocation(attributeLocationUI);

      async.waterfall([
        waterfallEmpty,
        animateLocationOut(),
        setTimeout(function() {
          if (sLastLocation === 'choose location...') {
            removeListenerClickLocations(eButtonsLocations);
            createListLocations(offsetTmz, false);
            listenerClickLocations(eButtonsLocations);
          }
          eAreas.classList.add('hide');
          eLocations.classList.add('hide');
          eLocations.classList.remove('timezone-controls-slideup');
        }, 1000)
      ]);
      setMomentInTime(attributeIdentifier);
    }

    writeControlPanelTimezone(state.values.timezone.moment);
    outputPointyEnd(onClickButtonLocation.name);
  }

  function onClickButtonSelectedArea(event) {
    animateWrapButtonsOut();
    setTimeout(function() {
      eWrapButtons.classList.add('hide');
    }, 1000);

    if (eLocations.classList.contains('hide')) {
      animateAreaIn();
      eAreas.classList.remove('hide');
    } else {
      async.waterfall([
        waterfallEmpty,
        animateLocationOut(),
        setTimeout(function() {
          eLocations.classList.add('hide');
          eAreas.classList.remove('hide');
          animateAreaIn();
        }, 1000)
      ]);
    }

    // Clean Up:
    filterListOff(eListAreas, eSearchArea, eSearchAreaIcon);
    filterListOff(eListLocations, eSearchLocation, eSearchLocationIcon);

    // Debug:
    outputPointyEnd(onClickButtonSelectedArea.name);
  }

  function onClickButtonSelectedLocation(event) {
    animateWrapButtonsOut();
    setTimeout(function() {
      eWrapButtons.classList.add('hide');
    }, 1000);

    if (eAreas.classList.contains('hide')) {
      animateLocationIn();
      eLocations.classList.remove('hide');
    } else {
      async.waterfall([
        waterfallEmpty,
        animateAreaOut(),
        setTimeout(function() {
          eAreas.classList.add('hide');
          eAreas.classList.remove('timezone-controls-slideup');
          eLocations.classList.remove('hide');
          animateLocationIn();
        }, 1000)
      ]);
    }

    // Clean Up:
    filterListOff(eListAreas, eSearchArea, eSearchAreaIcon);
    filterListOff(eListLocations, eSearchLocation, eSearchLocationIcon);

    // Debug:
    outputPointyEnd(onClickButtonSelectedLocation.name);
  }

  function onClickButtonSearchAreaIcon(event) {
    var sAttribute = event.target.getAttribute('data-type');

    if (sAttribute === 'search') {
      // call search
    } else {
      filterListOff(eListAreas, eSearchArea, eSearchAreaIcon);
    }
  }

  function onClickButtonSearchLocationIcon(event) {
    var sAttribute = event.target.getAttribute('data-type');
    if (sAttribute === 'search') {
      // call search
    } else {
      filterListOff(eListLocations, eSearchLocation, eSearchLocationIcon);
    }
  }

  function addStandardListeners() {
    eTimezoneArea.addEventListener('click', onClickButtonSelectedArea, false);
    eTimezoneLocation.addEventListener(
      'click',
      onClickButtonSelectedLocation,
      false
    );
    eSearchAreaIcon.addEventListener(
      'click',
      onClickButtonSearchAreaIcon,
      false
    );
    eSearchLocationIcon.addEventListener(
      'click',
      onClickButtonSearchLocationIcon,
      false
    );
  }

  function addListenerClickAreas(ele) {
    for (var i = 0; i < ele.length; i++) {
      ele[i].addEventListener('click', onClickButtonArea, false);
    }
  }

  function listenerClickLocations(ele) {
    for (var i = 0; i < ele.length; i++) {
      ele[i].addEventListener('click', onClickButtonLocation, false);
    }
  }

  function removeListenerClickLocations(ele) {
    for (var i = 0; i < ele.length; i++) {
      ele[i].removeEventListener('click', onClickButtonLocation, false);
    }
  }

  function setLabelArea(sArea) {
    eTimezoneAreaLabel.textContent = sArea;
    state.values.timezone.area = sArea;
  }

  function setLabelLocation(sLocation) {
    eTimezoneLocationLabel.textContent = sLocation;
    state.values.timezone.location = sLocation;
  }

  function addListeners() {
    eButtonsAreas = window.document.getElementsByClassName('ctl-listitem-area');
    eButtonsLocations = window.document.getElementsByClassName(
      'ctl-listitem-location'
    );

    addStandardListeners();
    addListenerClickAreas(eButtonsAreas);
  }

  function init(oConfig) {
    // Initialize
    initializeControlPanelElements();
    initializeCalendarElements();
    initializeClockElements();
    initializeTimezoneElements();
    // Configuration -> Clock
    controlVisibilityOfHands(oConfig);
    // Control Panel
    writeControlPanelShortDate(getShortDateString(state.default.date));
    writeControlPanelShortTime(defaultShortTimeString(state.default.date));
    writeControlPanelTimezone(defaultTimezone());
    addControlPanelEventListeners();
    // Calendar
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    listenForEnterOnCalendarInputs();
    setDateNumbers(state.default.date);
    changeMonth(state.values.calendar.month);
    changeYear(state.values.calendar.year);
    changeDay(state.values.calendar.dayOfMonth, state.values.calendar.dayOfWeek);
    writeCalendarLabels();
    writeDays(state.values.calendar.year, state.values.calendar.month);
    // Clock
    bindAllowedKeysHour();
    bindAllowedKeysMinute();
    bindAllowedKeysSecond();
    bindAllowedKeysMillisecond();
    listenForEnterOnTimeInputs();
    setTimeNumbers(state.default.date);
    changeHour(state.values.clock.hour);
    changeMinute(state.values.clock.minute);
    changeSecond(state.values.clock.second);
    changeMillisecond(state.values.clock.millisecond);
    // Timezone
    setLabelArea(state.values.timezone.area);
    setLabelLocation(state.values.timezone.location);
    getAsyncTZs();
  }

  return {
    init: init,
    // Calendar
    controlYear: handleYear,
    controlMonth: handleMonth,
    directBlurYear: directBlurYear,
    directBlurMonth: directBlurMonth,
    setToday: setToday,
    // Clock
    directBlurHours: directBlurHours,
    directBlurMinutes: directBlurMinutes,
    directBlurSeconds: directBlurSeconds,
    directBlurMilliseconds: directBlurMilliseconds,
    controlHours: handleHours,
    controlMinutes: handleMinutes,
    controlSeconds: handleSeconds,
    controlMilliseconds: handleMilliseconds,
    controlAMPM: handleAMPM,
    // Timezone
    filterListAreas: filterListAreas,
    filterListLocations: filterListLocations
  };
})();

var oConfigWidget = {
  show: {
    seconds: false,
    milliseconds: false
  }
}
widgetDateTimeZone.init(oConfigWidget);
