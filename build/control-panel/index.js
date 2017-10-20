widgetDateTime = (function() {
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
  var sTimezoneGuess = moment.tz.guess();

  function getElement(sElementName) {
    var ele = window.document.getElementById(sElementName);
    return ele;
  }

  function addEventListeners() {
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
      eControlPanelContainer.classList.remove('control-panel-slideleft');
      eControlPanelContainer.classList.add('control-panel-slideright');
      setTimeout(function() {
        eControlPanelCalendar.classList.add('hide');
        eControlPanelContainer.classList.remove('control-panel-slideright');
      }, 1000);
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
    eControlPanelShowDateLabel.textContent = s;
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
    eControlPanelShowTimeLabel.textContent = s;
  }

  function defaultTimezone() {
    var s = sTimezoneGuess;

    return s;
  }
  function writeTimezone(s) {
    eControlPanelShowTimezoneLabel.textContent = s;
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

  function init() {
    initializeControlPanelElements();
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
