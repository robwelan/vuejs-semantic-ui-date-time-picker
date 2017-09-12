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

  function listenForEnterOnCtls() {
    var elements = window.document.getElementsByClassName('ctl-ym');
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('keypress', addClass, false);
      elements[i].addEventListener('keyup', removeClass, false);
    }
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
    if (nTemp !== Number(nYear)) {
      return true;
    } else {
      return false;
    }
  }

  function isDifferentMonth() {
    var nTemp = Number(eInputMonth.value);
    if (nTemp !== Number(nMonth)) {
      return true;
    } else {
      return false;
    }
  }

  function changeYear(n) {
    //   window.document.getElementById('sui-label-year').textContent = n;
    eInputYear.value = n;
  }

  function changeMonth(n) {
    //   window.document.getElementById('sui-label-month').textContent =
    aMonthStrings[n];
    eInputMonth.value = aMonthNumbers[n];
  }

  function changeDay(nM, nW) {
    //  window.document.getElementById('sui-label-daynumber').textContent = nM;
    //  window.document.getElementById('sui-label-daystring').textContent =
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
        if (nYear < 100) {
          nYear = 100;
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
  }

  function fixMonthInput() {
    var bNeedsFix = false;
    var nTemp = Number(eInputMonth.value);
    if (nTemp > 12) {
      nTemp = 11;
      bNeedsFix = true;
    }
    if (nTemp < 0) {
      nTemp = 0;
      bNeedsFix = true;
    }
    if (bNeedsFix === true) {
      nMonth = nTemp;
      eInputMonth.value = nTemp;
    }
  }

  function directBlurYear(e) {
    if (isDifferentYear() === false) {
      return;
    }
    nYear = Number(eInputYear.value);
    fixMonthInput();
    changeControls(nYear, nMonth, nDayOfMonth);
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
      if (nYear < 100) {
        nYear = 100;
      }
      fixMonthInput();
      changeControls(nYear, nMonth, nDayOfMonth);
    }
  }

  function directBlurMonth(e) {
    if (isDifferentMonth() === false) {
      return;
    }
    nMonth = Number(eInputMonth.value) - 1;
    changeControls(nYear, nMonth, nDayOfMonth);
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
  }

  function changeControls(nY, nM, nD) {
    //    console.log('y:' + nY + '; m:' + nM + '; d:' + nD);
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
      //  alert(keyCode)
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
    };
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
    };
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

  }

  function init() {
    eInputYear = window.document.getElementById('input-year');
    eInputMonth = window.document.getElementById('input-month');
    bindAllowedKeysYear();
    bindAllowedKeysMonth();
    setDateNumbers(dToday);
    changeMonth(nMonth);
    changeYear(nYear);
    changeDay(nDayOfMonth, nDayOfWeek);
    writeLabels();
    writeDays(nYear, nMonth);
    console.log('Initialised: date-time-picker');
  }
  return {
    init: init,
    controlYear: handleYear,
    controlMonth: handleMonth,
    directKeyUpYear: directKeyUpYear,
    directBlurYear: directBlurYear,
    directKeyUpMonth: directKeyUpMonth,
    directBlurMonth: directBlurMonth
  };
})();

var pickDateTime = oDateAndOrTime;
pickDateTime.init();