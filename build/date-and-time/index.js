oDateAndOrTime = (function() {
  var eInputYear;
  var eInputMonth;
  var eCalDays;
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

  // var dToday = new Date();
  // var dTime = new Date();
  // var nDayOfWeek;
  // var nDayOfMonth;
  // var nMonth;
  // var nYear;
  // var nHour;
  // var nMinute;
  // var nSecond;
  // var nMillisecond;
  // var sMeridiem;
  // State
  var state = {
    default: {
      date: new Date(),
      guessTimeZone: moment.tz.guess()
    },
    settings: {
      calendar: {
        lowestYearLimit: 1900
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
      }
    }
  };
  // Last Thing
  var bIsInitialised = false;

  function writeShortDate() {
    var language = [window.navigator.userLanguage || window.navigator.language];
    var date = new Date(),
      options = {
        //  weekday: "long",
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
    console.log(date.toLocaleDateString(language, options));
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
    }
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

  function ignoreForButtonClicksOnDays() {
    var buttons = window.document.getElementsByClassName('ctl-day');
    var i = 0;
    var length = buttons.length;
    for (i; i < length; i++) {
      if (window.document.removeEventListener) {
        buttons[i].removeEventListener('click', uiClickDay);
      } else {
        buttons[i].detachEvent('onclick', uiClickDay);
      }
    }
  }

  function isValidDate(nY, nM, nD) {
    var d = new Date(nY, nM, nD);
    if (isNaN(d)) {
      return false;
    } else {
      return true;
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

  function setDateNumbers(d) {
    state.values.calendar.dayOfWeek = d.getDay();
    state.values.calendar.dayOfMonth = d.getDate();
    state.values.calendar.month = d.getMonth();
    state.values.calendar.year = d.getFullYear();
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

  function changeYear(n) {
    eInputYear.value = n;
  }

  function changeMonth(n) {
    eInputMonth.value = aMonthNumbers[n];
  }

  function changeDay(nM, nW) {
    aDayStrings[nW];
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

  function handleYM(event, sField, sCommand) {
    if (sField === 'y') {
      if (sCommand === '<') {
        state.values.calendar.year -= 1;
        if (state.values.calendar.year < state.settings.calendar.lowestYearLimit) {
          state.values.calendar.year = state.settings.calendar.lowestYearLimit;
        }
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        state.values.calendar.year += 1;
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
    }
    if (sField === 'm') {
      if (sCommand === '<') {
        state.values.calendar.month -= 1;
        if (state.values.calendar.month < 0) {
          state.values.calendar.month = 12 - 1;
        }
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        state.values.calendar.month += 1;
        if (state.values.calendar.month > 12 - 1) {
          state.values.calendar.month = 0;
        }
        //        changeCalendarControls(nYear, nMonth, state.values.calendar.dayOfMonth);
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

  function writeLabels() {
    var eRow = window.document.getElementById('label-days');
    var content;
    var aDays = aDayCharacters.map(function(x, i, a) {
    var aClasses = ['day-label'];

      if (i === 0) {
        aClasses.push('left');
      }
      if (i === (a.length - 1)) {
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

  function writeDays(nY, nM) {
    if (bIsInitialised === true) {
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
        if (x > 0 && x < (aWeek.length - 1)) {
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

  function init() {
    // Calendar
    eInputYear = window.document.getElementById('input-year');
    eInputMonth = window.document.getElementById('input-month');
    eCalDays = window.document.getElementById('calendar-days');
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    listenForEnterOnCalendarInputs();
    setDateNumbers(state.default.date);
    changeMonth(state.values.calendar.month);
    changeYear(state.values.calendar.year);
    changeDay(state.values.calendar.dayOfMonth, state.values.calendar.dayOfWeek);
    writeLabels();
    writeDays(state.values.calendar.year, state.values.calendar.month);
    // Time
    eInputHour = window.document.getElementById('input-hour');
    eInputMinute = window.document.getElementById('input-minute');
    eInputSecond = window.document.getElementById('input-second');
    eInputMillisecond = window.document.getElementById('input-millisecond');
    eButtonAM = window.document.getElementById('btn-am');
    eButtonPM = window.document.getElementById('btn-pm');
    eHandHour = window.document.getElementById('hour-hand');
    eHandMinute = window.document.getElementById('minute-hand');
    eHandSecond = window.document.getElementById('second-hand');
    eHandMillisecond = window.document.getElementById('millisecond-hand');
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
    // Are We Done?
    bIsInitialised = true;
  }

  return {
    init: init,
    controlYear: handleYear,
    controlMonth: handleMonth,
    directBlurYear: directBlurYear,
    directBlurMonth: directBlurMonth,
    setToday: setToday,
    directBlurHours: directBlurHours,
    directBlurMinutes: directBlurMinutes,
    directBlurSeconds: directBlurSeconds,
    directBlurMilliseconds: directBlurMilliseconds,
    controlHours: handleHours,
    controlMinutes: handleMinutes,
    controlSeconds: handleSeconds,
    controlMilliseconds: handleMilliseconds,
    controlAMPM: handleAMPM
  };
})();

var pickDateTime = oDateAndOrTime;
pickDateTime.init();
