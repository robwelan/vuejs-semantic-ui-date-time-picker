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
  var dToday = new Date();
  var nDayOfWeek;
  var nDayOfMonth;
  var nMonth;
  var nYear;
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
  var nLowestYearLimit = 1900;
  // Shared Variables
  var sTimezoneGuess = moment.tz.guess();
  // Last Thing
  var bIsInitialised = false;

  // Shared Functions
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

  function defaultShortTimeString() {
    var date = new Date();
    // getHours returns the hours in local time zone from 0 to 23
    var hours = date.getHours();
    // getMinutes returns the minutes in local time zone from 0 to 59
    var minutes = date.getMinutes();
    var meridiem = ' AM';
    var s = '';

    // convert to 12-hour time format
    if (hours > 12) {
      hours = hours - 12;
      meridiem = ' PM';
    } else if (hours === 0) {
      hours = 12;
    }

    // minutes should always be two digits long
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }
    s = hours + ':' + minutes + meridiem;

    return s;
  }

  function defaultTimezone() {
    var s = sTimezoneGuess;

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
    // console.log(date.toLocaleDateString(language, options));
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
    eInputYear = window.document.getElementById('input-year');
    eInputMonth = window.document.getElementById('input-month');
    eCalDays = window.document.getElementById('calendar-days');
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
      dToday = new Date(nY, nM, nD);
    } else {
      dToday = new Date();
    }
    setDateNumbers(dToday);
    changeYear(nYear);
    changeMonth(nMonth);
    changeDay(nDayOfMonth, nDayOfWeek);
  }

  function listenForEnterOnCalendarInputs() {
    eInputYear.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        nYear = Number(eInputYear.value);
        fixMonthInput();
        changeCalendarControls(nYear, nMonth, nDayOfMonth);
        writeDays(nYear, nMonth);
      }
    });
    eInputMonth.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        nMonth = Number(eInputMonth.value - 1);
        fixMonthInput();
        changeCalendarControls(nYear, nMonth, nDayOfMonth);
        writeDays(nYear, nMonth);
      }
    });
  }

  function setDateNumbers(d) {
    nDayOfWeek = d.getDay();
    nDayOfMonth = d.getDate();
    nMonth = d.getMonth();
    nYear = d.getFullYear();
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
    var sYearMonth = nYear.toString() + nMonth.toString();
    var bIsBigChange = false;
    if (sButtonYearMonth !== sYearMonth) {
      bIsBigChange = true;
      nYear = nButtonYear;
      nMonth = nButtonMonth;
    }
    nDayOfMonth = nButtonDay;
    if (bIsBigChange === true) {
      // re-write cal
      changeCalendarControls(nYear, nMonth, nDayOfMonth);
      writeDays(nYear, nMonth);
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

      var dSelected = new Date(nYear, nMonth, nDayOfMonth);
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
        if (o.month !== nMonth) {
          aClasses.push('mute');
        }
        if (o.year === nYear && o.month === nMonth && o.day === nDayOfMonth) {
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

    var dSelected = new Date(nYear, nMonth, nDayOfMonth);
    writeControlPanelShortDate(getShortDateString(dSelected));
  }

  function handleYM(event, sField, sCommand) {
    if (sField === 'y') {
      if (sCommand === '<') {
        nYear -= 1;
        if (nYear < nLowestYearLimit) {
          nYear = nLowestYearLimit;
        }
      }
      if (sCommand === '>') {
        nYear += 1;
      }
    }
    if (sField === 'm') {
      if (sCommand === '<') {
        nMonth -= 1;
        if (nMonth < 0) {
          nMonth = 12 - 1;
        }
      }
      if (sCommand === '>') {
        nMonth += 1;
        if (nMonth > 12 - 1) {
          nMonth = 0;
        }
      }
    }
    changeCalendarControls(nYear, nMonth, nDayOfMonth);
    writeDays(nYear, nMonth);
  }

  function handleYear(event, sCommand) {
    handleYM(event, 'y', sCommand);
  }

  function handleMonth(event, sCommand) {
    handleYM(event, 'm', sCommand);
  }

  function isDifferentYear() {
    var nTemp = Number(eInputYear.value);
    if (nTemp !== Number(nYear) || eInputYear.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function isDifferentMonth() {
    var nTemp = Number(eInputMonth.value) - 1;
    if (nTemp !== Number(nMonth) || eInputMonth.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function fixYearInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputYear.value);

    if (nTemp < nLowestYearLimit || eInputYear.value === '') {
      nYear = nLowestYearLimit;
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputYear.value = nYear;
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
    if (nTemp.toString() !== nMonth.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputMonth.value = nTemp;
      nMonth = nTemp;
    }
  }

  function directBlurYear(e) {
    if (isDifferentYear() === false) {
      return;
    }
    if (eInputYear.value === '') {
      nYear = nLowestYearLimit;
    } else {
      nYear = Number(eInputYear.value);
    }
    if (nYear < nLowestYearLimit) {
      nYear = nLowestYearLimit;
    }
    fixYearInput();
    changeCalendarControls(nYear, nMonth, nDayOfMonth);
    writeDays(nYear, nMonth);
  }

  function directBlurMonth(e) {
    if (isDifferentMonth() === false) {
      return;
    }
    fixMonthInput();
    changeCalendarControls(nYear, nMonth, nDayOfMonth);
    writeDays(nYear, nMonth);
  }

  function setToday() {
    // force set to today's date
    dToday = new Date();
    setDateNumbers(dToday);
    changeMonth(nMonth);
    changeYear(nYear);
    changeDay(nDayOfMonth, nDayOfWeek);
    writeDays(nYear, nMonth);
  }

  function init() {
    // Control Panel
    initializeControlPanelElements();
    writeControlPanelShortDate(getShortDateString(dToday));
    writeControlPanelShortTime(defaultShortTimeString());
    writeControlPanelTimezone(defaultTimezone());
    addControlPanelEventListeners();
    // Calendar
    initializeCalendarElements();
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    listenForEnterOnCalendarInputs();
    setDateNumbers(dToday);
    changeMonth(nMonth);
    changeYear(nYear);
    changeDay(nDayOfMonth, nDayOfWeek);
    writeCalendarLabels();
    writeDays(nYear, nMonth);
  }

  return {
    init: init,
    // Calendar
    controlYear: handleYear,
    controlMonth: handleMonth,
    directBlurYear: directBlurYear,
    directBlurMonth: directBlurMonth,
    setToday: setToday
  };
})();

widgetDateTimeZone.init();
