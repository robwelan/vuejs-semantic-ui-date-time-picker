widgetDateTime = (function() {
  var eClose;
  var eCloseCalendar;
  var eCloseTime;
  var eCloseTimezone;
  var eSave;
  var eControlPanelContainer;
  var eControlPanelCalendar;
  var eControlPanelTime;
  var eShowDate;
  var eShowDateLabel;
  var eShowTime;
  var eShowTimeLabel;
  var eShowTimezone;
  var eShowTimezoneLabel;
  var eDestroy;
  var eKeepEditing;
  var eDiscard;
  var sTimezoneGuess = moment.tz.guess();

  function getElement(sElementName) {
    var ele = window.document.getElementById(sElementName);
    return ele;
  }

  function addEventListeners() {
    eShowDate.addEventListener('click', function() {
      eControlPanelCalendar.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });
    eShowTime.addEventListener('click', function() {
      eControlPanelTime.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });
    eShowTimezone.addEventListener('click', function() {
      eControlPanelTimezone.classList.remove('hide');
      eControlPanelContainer.classList.add('control-panel-slideleft');
    });
    eCloseCalendar.addEventListener('click', function() {
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelCalendar.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
    });
    eCloseTime.addEventListener('click', function() {
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelTime.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
    });
    eCloseTimezone.addEventListener('click', function() {
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelTimezone.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
    });
    eShowTime.addEventListener('click', function() {});
    eShowTimezone.addEventListener('click', function() {});
    eClose.addEventListener('click', function() {
      eDiscard.classList.remove('hide');
      eDiscard.classList.add('active');
      eDiscard.classList.remove('slidedown');
      eDiscard.classList.add('slideup');
    });
    eSave.addEventListener('click', function() {});
    eDestroy.addEventListener('click', function() {});
    eKeepEditing.addEventListener('click', function() {
      eDiscard.classList.add('slidedown');
      eDiscard.classList.remove('slideup');
      setTimeout(function() {
        eDiscard.classList.add('hide');
        eDiscard.classList.remove('active');
      }, 1000);
    });
  }

  function defaultShortDateString() {
    var language = [window.navigator.userLanguage || window.navigator.language];
    var date = new Date(),
      options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
    return date.toLocaleDateString(language, options);
  }

  function writeShortDate(s) {
    // console.log(date.toLocaleDateString(language, options));
    eShowDateLabel.textContent = s;
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

  function writeShortTime(s) {
    eShowTimeLabel.textContent = s;
  }

  function defaultTimezone() {
    var s = sTimezoneGuess;

    return s;
  }
  function writeTimezone(s) {
    eShowTimezoneLabel.textContent = s;
  }

  function initializeElements() {
    eClose = getElement('ctl-close');
    eCloseCalendar = getElement('ctl-close-calendar');
    eCloseTime = getElement('ctl-close-time');
    eCloseTimezone = getElement('ctl-close-timezone');
    eSave = getElement('ctl-save');
    eControlPanelContainer = getElement('control-panel-container');
    eControlPanelCalendar = getElement('control-panel-calendar');
    eControlPanelTime = getElement('control-panel-time');
    eControlPanelTimezone = getElement('control-panel-timezone');
    eShowDate = getElement('ctl-show-date');
    eShowDateLabel = getElement('ctl-show-date-label');
    eShowTime = getElement('ctl-show-time');
    eShowTimeLabel = getElement('ctl-show-time-label');
    eShowTimezone = getElement('ctl-show-timezone');
    eShowTimezoneLabel = getElement('ctl-show-timezone-label');
    eDiscard = getElement('card-check-discard');
    eDestroy = getElement('ctl-destroy');
    eKeepEditing = getElement('ctl-keep-editing');
  }

  function init() {
    initializeElements();
    writeShortDate(defaultShortDateString());
    writeShortTime(defaultShortTimeString());
    writeTimezone(defaultTimezone());
    addEventListeners();
  }

  return {
    init: init
  };
})();

widgetDateTime.init();
