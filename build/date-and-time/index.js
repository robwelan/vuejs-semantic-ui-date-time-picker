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
  var dToday = new Date();
  var dTime = new Date();
  var nDayOfWeek;
  var nDayOfMonth;
  var nMonth;
  var nYear;
  var nHour;
  var nMinute;
  var nSecond;
  var nMillisecond;
  var sMeridiem;
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
  // Configuration Settings
  var bIsAllowedDate = false;
  var bIsAllowedTime = false;
  var bIsAllowedZone = false;
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
        if (isDifferentTime(eInputHour, nHour, 'hour') === false) {
          return;
        }
        fixHoursInput();
        changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
      }
    });
    eInputMinute.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputMinute, nMinute, '') === false) {
          return;
        }
        fixMinutesOrSecondsInput('minutes');
        changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
      }
    });
    eInputSecond.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputSecond, nSecond, '') === false) {
          return;
        }
        fixMinutesOrSecondsInput('seconds');
        changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
      }
    });
    eInputMillisecond.addEventListener('keydown', function(e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        if (isDifferentTime(eInputMillisecond, nMillisecond, '') === false) {
          return;
        }
        fixMillisecondsInput();
        changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
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
    nDayOfWeek = d.getDay();
    nDayOfMonth = d.getDate();
    nMonth = d.getMonth();
    nYear = d.getFullYear();
  }

  function rotateHands() {
    var nRotateHour = nHour;

    nRotateHour = nRotateHour % 12;
    nRotateHour = nRotateHour ? nRotateHour : 12; // the hour '0' should be '12'

    eHandHour.style.transform =
      'rotate(' + (nRotateHour * 30 + nMinute / 2) + 'deg)';
    eHandMinute.style.transform = 'rotate(' + nMinute * 6 + 'deg)';
    eHandSecond.style.transform = 'rotate(' + nSecond * 6 + 'deg)';
    eHandMillisecond.style.transform =
      'rotate(' + Math.floor(nMillisecond / 1000 * 360) + 'deg)';
  }

  function setTimeNumbers(t) {
    nHour = t.getHours();
    nMinute = t.getMinutes();
    nSecond = t.getSeconds();
    nMillisecond = t.getMilliseconds();
    sMeridiem = nHour >= 12 ? 'pm' : 'am';

    if (sMeridiem === 'am') {
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

  function isDifferentTime(eT, nT, sSpecial) {
    var nTemp = Number(eT.value);
    if (sSpecial === 'hour') {
      if (sMeridiem === 'pm') {
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
        nYear -= 1;
        if (nYear < nLowestYearLimit) {
          nYear = nLowestYearLimit;
        }
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        nYear += 1;
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
    }
    if (sField === 'm') {
      if (sCommand === '<') {
        nMonth -= 1;
        if (nMonth < 0) {
          nMonth = 12 - 1;
        }
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        nMonth += 1;
        if (nMonth > 12 - 1) {
          nMonth = 0;
        }
        //        changeCalendarControls(nYear, nMonth, nDayOfMonth);
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

  function handleHMSM(event, sField, sCommand) {
    if (sField === 'hr') {
      if (sCommand === '<') {
        nHour -= 1;
        if (nHour < 0) {
          nHour = 23;
        }
      }
      if (sCommand === '>') {
        nHour += 1;
        if (nHour > 23) {
          nHour = 0;
        }
      }
    }
    if (sField === 'mn') {
      if (sCommand === '<') {
        nMinute -= 1;
        if (nMinute < 0) {
          nMinute = 59;
        }
      }
      if (sCommand === '>') {
        nMinute += 1;
        if (nMinute > 59) {
          nMinute = 0;
        }
      }
    }
    if (sField === 'ss') {
      if (sCommand === '<') {
        nSecond -= 1;
        if (nSecond < 0) {
          nSecond = 59;
        }
      }
      if (sCommand === '>') {
        nSecond += 1;
        if (nSecond > 59) {
          nSecond = 0;
        }
      }
    }
    if (sField === 'ms') {
      if (sCommand === '<') {
        nMillisecond -= 1;
        if (nMillisecond < 0) {
          nMillisecond = 999;
        }
      }
      if (sCommand === '>') {
        nMillisecond += 1;
        if (nMillisecond > 999) {
          nMillisecond = 0;
        }
      }
    }
    if (sField === 'ampm') {
      var nRotateHour = Number(eInputHour.value);

      if (sCommand === 'am') {
        sMeridiem = 'am';
      }
      if (sCommand === 'pm') {
        sMeridiem = 'pm';
        nRotateHour += 12;
      }
      nHour = nRotateHour;
    }

    changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
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
    if (nTemp.toString() !== nHour.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputHour.value = nTemp;
      if (sMeridiem === 'pm') {
        nHour = nTemp + 12;
      } else {
        nHour = nTemp;
      }
    }
  }

  function fixMinutesOrSecondsInput(sType) {
    var bNeedsFix = false;
    var nTemp;
    var nValue;
    if (sType === 'minutes') {
      nTemp = Number(eInputMinute.value);
      nValue = nMinute;
    }
    if (sType === 'seconds') {
      nTemp = Number(eInputSecond.value);
      nValue = nSecond;
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
        nMinute = nTemp;
      }
      if (sType === 'seconds') {
        eInputSecond.value = nTemp;
        nSecond = nTemp;
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
    if (nTemp.toString() !== nMillisecond.toString()) {
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      eInputMillisecond.value = nTemp;
      nMillisecond = nTemp;
    }    
  }

  function directBlurHours(e) {
    if (isDifferentTime(eInputHour, nHour, 'hour') === false) {
      return;
    }
    fixHoursInput();
    changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
  }

  function directBlurMinutes(e) {
    if (isDifferentTime(eInputMinute, nMinute, '') === false) {
      return;
    }
    fixMinutesOrSecondsInput('minutes');
    changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
  }

  function directBlurSeconds(e) {
    if (isDifferentTime(eInputSecond, nSecond, '') === false) {
      return;
    }
    fixMinutesOrSecondsInput('seconds');
    changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
  }

  function directBlurMilliseconds(e) {
    if (isDifferentTime(eInputMillisecond, nMillisecond, '') === false) {
      return;
    }
    fixMillisecondsInput();
    changeTimeControls(nHour, nMinute, nSecond, nMillisecond, sMeridiem);
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

  function changeTimeControls(nHr, nMn, nSs, nMs, sM) {
    if (isValidTime(nHr, nMn, nSs, nMs)) {
      dTime = new Date(1970, 1, 1, nHr, nMn, nSs, nMs);
    } else {
      dTime = new Date();
    }
    setTimeNumbers(dTime);
    changeHour(nHour);
    changeMinute(nMinute);
    changeSecond(nSecond);
    changeMillisecond(nMillisecond);
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
    var aDays = aDayCharacters.map(function(x) {
      eRow.insertAdjacentHTML(
        'beforeend',
        '<div class="day-label">' + x + '</div>'
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

    var s = '';
    var b = '';
    var sWN = '';
    var sClassSide = '';
    var sClassCal = '';
    var sClassActive = '';
    var sClassTL = '';
    var sClassTR = '';
    var sClassBL = '';
    var sClassBR = '';
    var sClasses = '';
    var o = {};
    var i = 0;

    for (var x = 0; x < aWeek.length; x++) {
      x < 10 ? (sWN = '0' + x) : (sWN = x.toString());
      s += '<div class="calendar-row day" id="week-' + sWN + '">';
      for (var y = 0; y < aWeek[x].length; y++) {
        o = aWeek[x][y];
        b = '';
        sClassSide = '';
        sClassCal = '';
        sClassActive = '';
        sClassTL = '';
        sClassTR = '';
        sClassBL = '';
        sClassBR = '';
        sClasses = '';
        if (y === 0) {
          sClassSide = ' left';
        }
        if (y === 6) {
          sClassSide = ' right';
        }
        if (o.month !== nMonth) {
          sClassCal = ' mute';
        }
        if (o.year === nYear && o.month === nMonth && o.day === nDayOfMonth) {
          sClassActive = ' active';
        }
        if (x === 0) {
          if (y === 0) {
            sClassTL = ' tl';
          }
          if (y === 6) {
            sClassTR = ' tr';
          }
        }
        if (x === aWeek.length - 1) {
          if (y === 0) {
            sClassBL = ' bl';
          }
          if (y === 6) {
            sClassBR = ' br';
          }
        }
        sClasses =
          sClassSide +
          sClassCal +
          sClassActive +
          sClassTL +
          sClassTR +
          sClassBL +
          sClassBR;
        b +=
          '<button class="ctl-day' +
          sClasses +
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
        b += o.day.toString();
        b += '</button>';
        s += b;
        i++;
      }
      s += '</div>';
    }

    eCalDays.innerHTML = s;
    // this listen event must run after Days are written to UI.
    listenForButtonClicksOnDays();
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
    // Calendar
    eInputYear = window.document.getElementById('input-year');
    eInputMonth = window.document.getElementById('input-month');
    eCalDays = window.document.getElementById('calendar-days');
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    listenForEnterOnCalendarInputs();
    setDateNumbers(dToday);
    changeMonth(nMonth);
    changeYear(nYear);
    changeDay(nDayOfMonth, nDayOfWeek);
    writeLabels();
    writeDays(nYear, nMonth);
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
    setTimeNumbers(dTime);
    changeHour(nHour);
    changeMinute(nMinute);
    changeSecond(nSecond);
    changeMillisecond(nMillisecond);
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
