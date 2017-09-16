oDateAndOrTime = (function () {
  var eInputYear;
  var eInputMonth;
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

  var aDayCharacters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var nLowestYearLimit = 1900;
  var isInitialised = false;

  function writeShortDate() {
    var language = [window.navigator.userLanguage || window.navigator.language];
    var date = new Date(),
      options = {
        //  weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
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
      changeControls(nYear, nMonth, nDayOfMonth);
      writeDays(nYear, nMonth);
    } else {
      // change selected day
      var buttons = document.getElementsByClassName('ctl-day');
      var i = 0
      var length = buttons.length;
      for (i; i < length; i++) {
        buttons[i].classList.remove("hasactive");
        buttons[i].classList.remove("active");
      };
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

  function listenForEnterOnInputs() {
    eInputYear.addEventListener('keydown', function (e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        nYear = Number(eInputYear.value);
        fixMonthInput();
        changeControls(nYear, nMonth, nDayOfMonth);
        writeDays(nYear, nMonth);
      }
    })
    eInputMonth.addEventListener('keydown', function (e) {
      var keyPress = returnKeyStroke(e);
      if (keyPress == 13) {
        nMonth = Number(eInputMonth.value - 1);
        fixMonthInput();
        changeControls(nYear, nMonth, nDayOfMonth);
        writeDays(nYear, nMonth);
      }
    })
  }

  function listenForButtonClicksOnDays() {
    var buttons = window.document.getElementsByClassName('ctl-day');
    var i = 0
    var length = buttons.length;
    for (i; i < length; i++) {
      if (window.document.addEventListener) {
        buttons[i].addEventListener("click", uiClickDay);
      } else {
        buttons[i].attachEvent("onclick", uiClickDay);
      };
    };
  }

  function ignoreForButtonClicksOnDays() {
    var buttons = window.document.getElementsByClassName('ctl-day');
    var i = 0
    var length = buttons.length;
    for (i; i < length; i++) {
      if (window.document.removeEventListener) {
        buttons[i].removeEventListener("click", uiClickDay);
      } else {
        buttons[i].detachEvent("onclick", uiClickDay);
      };
    };
  }

  function isValidDate(nY, nM, nD) {
    var d = new Date(nY, nM, nD);
    if (isNaN(d)) {
      return true;
    } else {
      return false;
    }
  }

  function setDateNumbers(d) {
    nDayOfWeek = d.getDay();
    nDayOfMonth = d.getDate();
    nMonth = d.getMonth();
    nYear = d.getFullYear();
  }

  function isDifferentYear() {
    var nTemp = Number(eInputYear.value);
    if ((nTemp !== Number(nYear)) || eInputYear.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function isDifferentMonth() {
    var nTemp = Number(eInputMonth.value);
    if ((nTemp !== Number(nMonth)) || eInputMonth.value === '') {
      return true;
    } else {
      return false;
    }
  }

  function changeYear(n) {
    eInputYear.value = n;
  }

  function changeMonth(n) {
    aMonthStrings[n];
    eInputMonth.value = aMonthNumbers[n];
  }

  function changeDay(nM, nW) {
    aDayStrings[nW];
  }

  function handleYear(event, sCommand) {
    handleYM(event, 'y', sCommand);
  }

  function handleMonth(event, sCommand) {
    handleYM(event, 'm', sCommand);
  }

  function handleYM(event, sField, sCommand) {
    if (sField === 'y') {
      if (sCommand === '<') {
        nYear -= 1;
        if (nYear < nLowestYearLimit) {
          nYear = nLowestYearLimit;
        }
        changeControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        nYear += 1;
        changeControls(nYear, nMonth, nDayOfMonth);
      }
    }
    if (sField === 'm') {
      if (sCommand === '<') {
        nMonth -= 1;
        if (nMonth < 0) {
          nMonth = 12 - 1;
        }
        changeControls(nYear, nMonth, nDayOfMonth);
      }
      if (sCommand === '>') {
        nMonth += 1;
        if (nMonth > 12 - 1) {
          nMonth = 0;
        }
        changeControls(nYear, nMonth, nDayOfMonth);
      }
    }
    writeDays(nYear, nMonth);
  }

  function fixYearInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputYear.value);
    if (nTemp < nLowestYearLimit) {
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
      //      eInputMonth.value = 11;
      nTemp = 11;
      bNeedsFix = true;
    }
    if (nTemp < 0) {
      //      eInputMonth.value = 0;
      nTemp = 0;
      bNeedsFix = true;
    }
    if (nTemp.toString() !== eInputMonth.value.toString()) {
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
    nYear = Number(eInputYear.value);
    if (nYear < nLowestYearLimit) {
      nYear = nLowestYearLimit;
    }
    fixYearInput();
    changeControls(nYear, nMonth, nDayOfMonth);
    writeDays(nYear, nMonth);
  }

  function directKeyUpYear(e) {
    var bNeedsChanging = false;
    if (isDifferentYear() === false) {
      return;
    }
    var keyCode = returnKeyStroke(e);
    if (keyCode >= 48 && keyCode <= 57) {
      bNeedsChanging = true;
    }
    if (keyCode === 8) {
      var nTemp = Number(eInputYear.value);
      if (!isNaN(nTemp)) {
        bNeedsChanging = true;
      }
    }
    if (bNeedsChanging === true) {
      nYear = Number(eInputYear.value);
      if (nYear < nLowestYearLimit) {
        nYear = nLowestYearLimit;
      }
      fixYearInput();
      changeControls(nYear, nMonth, nDayOfMonth);
    }
    writeDays(nYear, nMonth);
  }

  function directBlurMonth(e) {
    if (isDifferentMonth() === false) {
      return;
    }
    fixMonthInput();
    changeControls(nYear, nMonth, nDayOfMonth);
    writeDays(nYear, nMonth);
  }

  function directKeyUpMonth(e) {
    var bNeedsChanging = false;
    if (isDifferentMonth() === false) {
      return;
    }
    var keyCode = returnKeyStroke(e);
    if (keyCode >= 48 && keyCode <= 57) {
      bNeedsChanging = true;
    }
    if (keyCode === 8) {
      var nTemp = Number(eInputMonth.value) - 1;
      if (!isNaN(nTemp)) {
        bNeedsChanging = true;
      }
    }
    if (bNeedsChanging === true) {
      nMonth = Number(eInputMonth.value) - 1;
      fixMonthInput();
      changeControls(nYear, nMonth, nDayOfMonth);
    }
    writeDays(nYear, nMonth);
  }

  function changeControls(nY, nM, nD) {
    if (isValidDate(nY, nM, nD)) {
      dToday = new Date();
      nY = dToday.getFullYear();
      nM = dToday.getMonth();
      nD = dToday.getDate();
    } else {
      dToday = new Date(nY, nM, nD);
    }
    setDateNumbers(dToday);
    changeYear(nYear);
    changeMonth(nMonth);
    changeDay(nDayOfMonth, nDayOfWeek);
  }

  function bindAllowedKeysYear() {
    eInputYear.onkeydown = function (e) {
      var keyCode = returnKeyStroke(e);
      if (!(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )) {
        return false;
      }
    }
  }

  function bindAllowedKeysMonth() {
    eInputMonth.onkeydown = function (e) {
      var keyCode = returnKeyStroke(e);
      if (!(
          (keyCode > 95 && keyCode < 106) ||
          (keyCode > 47 && keyCode < 58) ||
          keyCode == 37 ||
          keyCode == 39 ||
          keyCode == 8 ||
          keyCode == 9
        )) {
        return false;
      }
    }
  }

  function writeLabels() {
    var eRow = window.document.getElementById('label-days');
    var content;
    var aDays = aDayCharacters.map(function (x) {
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
    if (isInitialised === true) {
      // remove the button click listeners
      ignoreForButtonClicksOnDays();
    }
    var dFirstDayThisMonth = new Date(nY, nM, 1);
    var dFirstDayNextMonth = new Date(nY, nM + 1, 1);
    var dLastDayThisMonth = new Date(dFirstDayNextMonth - 1);
    var nMonthWeekDayStart = dFirstDayThisMonth.getDay();
    var nMonthWeekDayEnd = dLastDayThisMonth.getDay();
    var dCalDateStart = new Date(nY, nM, (nMonthWeekDayStart * -1) + 1);
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
      }
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
      x < 10 ? sWN = '0' + x : sWN = x.toString();
      s += '<div class="calendar-row day" id="week-' + sWN + '">'
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
        if ((o.year === nYear) && (o.month === nMonth) && (o.day === nDayOfMonth)) {
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
        sClasses = sClassSide + sClassCal + sClassActive + sClassTL + sClassTR + sClassBL + sClassBR;
        b += '<button class="ctl-day' + sClasses + '" type="button" aria-label="' + o.year + '-' + (Number(o.month) + 1) + '-' + o.day + '" data-year="' + o.year + '" data-month="' + o.month + '"' + ' data-day="' + o.day + '">'
        b += o.day.toString();
        b += '</button>';
        s += b;
        i++;
      }
      s += '</div>';
    }

    var eCalDays = window.document.getElementById('calendar-days');
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
    eInputYear = window.document.getElementById('input-year');
    eInputMonth = window.document.getElementById('input-month');
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    listenForEnterOnInputs();
    setDateNumbers(dToday);
    changeMonth(nMonth);
    changeYear(nYear);
    changeDay(nDayOfMonth, nDayOfWeek);
    writeLabels();
    writeDays(nYear, nMonth);
    writeShortDate();
    isInitialised = true;
  }
  return {
    init: init,
    controlYear: handleYear,
    controlMonth: handleMonth,
    directKeyUpYear: directKeyUpYear,
    directBlurYear: directBlurYear,
    directKeyUpMonth: directKeyUpMonth,
    directBlurMonth: directBlurMonth,
    setToday: setToday
  };
})();

var pickDateTime = oDateAndOrTime;
pickDateTime.init();