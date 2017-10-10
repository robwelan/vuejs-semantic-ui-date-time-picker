var suiMoment = (function() {
  /* Time Zones */
  var SELECTED_AREA = 'Choose Area...';
  var SELECTED_LOCATION = 'Choose Location...';
  var eAreas = window.document.getElementById('areas');
  var eLocations = window.document.getElementById('locations');
  var eListAreas = window.document.getElementById('list-areas');
  var eListLocations = window.document.getElementById('list-locations');
  var eTimezoneArea = window.document.getElementById('timezone-area');
  var eTimezoneLocation = window.document.getElementById('timezone-location');
  var eSearchArea = window.document.getElementById('search-area');
  var eSearchLocation = window.document.getElementById('search-location');
  var eSearchAreaIcon = window.document.getElementById('search-area-icon');
  var eSearchLocationIcon = window.document.getElementById(
    'search-location-icon'
  );
  var eButtonsAreas;
  var eButtonsLocations;
  var aTimeZones = moment.tz.names();
  var aTimeZoneAreas = [];
  var oGuessedLocation = {};
  var sSelectedArea = SELECTED_AREA;
  var sSelectedLocation = SELECTED_LOCATION;
  var offsetTmz = [];

  function waterfallEmpty() {}

  function filterListAreas(e) {
    filter = e.target.value.toLowerCase();
    if (filter !== '') {
      eSearchAreaIcon.classList.remove('search');
      eSearchAreaIcon.classList.add('close');
      eSearchAreaIcon.setAttribute('data-search', 'clear');
    }
    li = eListAreas.getElementsByTagName('li');
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
      eSearchLocationIcon.setAttribute('data-search', 'clear');
    }
    li = eListLocations.getElementsByTagName('li');
    var button, sData;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      button = li[i].getElementsByTagName('button')[0];
      sData = button.getAttribute('data-location-ui').toLowerCase();

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
    var aButtonClasses = [sType];

    aButtonClasses.push('tl');
    aButtonClasses.push('tr');

    button.className = aButtonClasses.join(' ').trim();
    button.setAttribute('data-area', 'All');

    img.src = 'images/50x50/etc.png';
    img.alt = '';

    button.appendChild(img);
    button.appendChild(window.document.createTextNode('All'));

    return button;
  }

  function createListAreas(aP) {
    var frag = window.document.createDocumentFragment();
    var li = window.document.createElement('li');

    button = returnGeneratedButtonAll('ctl-listitem-area');
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
        aButtonClasses.push('bl');
        aButtonClasses.push('br');
      }

      if (oGuessedLocation.area.toLowerCase() === sLIlc) {
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

  function createListLocations(aP) {
    deleteListItems(eListLocations);

    var frag = window.document.createDocumentFragment();
    var li = window.document.createElement('li');
    var button = window.document.createElement('button');
    var sLIlc;
    var s;
    var oNow = moment();
    var res = [];

    if (oGuessedLocation.isGuessed === true) {
      res = aP.filter(function(x) {
        if (x.sZoneParent === sSelectedArea) {
          return x;
        }
      });
    } else {
      res = aP.filter(function(x) {
        return x;
      });
    }

    button = returnGeneratedButtonAll('ctl-listitem-location');
    li.appendChild(button);
    frag.appendChild(li);

    for (var i = 0; i < res.length; i++) {
      li = window.document.createElement('li');
      button = window.document.createElement('button');
      var img = window.document.createElement('img');
      var spanTitle = window.document.createElement('span');
      var spanAbout = window.document.createElement('span');
      var aButtonClasses = ['ctl-listitem-location'];
      var sLIlc = res[i].sZoneParent.toLowerCase();
      var s = '<img src="images/50x50/' + sLIlc + '.png" alt="">' + sLIlc;

      if (i === res.length - 1) {
        aButtonClasses.push('bl');
        aButtonClasses.push('br');
      }

      if (sSelectedLocation.toLowerCase() === res[i].sZoneChild.toLowerCase()) {
        aButtonClasses.push('active');
      }

      button.setAttribute('data-area', res[i].sZoneParent);
      button.setAttribute('data-location', res[i].sZoneChild);
      button.setAttribute('data-location-ui', res[i].sZoneChildUI);
      button.setAttribute('data-tzid', res[i].timeZoneId);
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
    aTimeZoneAreas = aTimeZones
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
    unpackTimeZones();

    var other = '';
    var sGuess = moment.tz.guess();

    sSelectedArea = SELECTED_AREA;
    sSelectedLocation = SELECTED_LOCATION;

    if (typeof sGuess != 'undefined') {
      oGuessedLocation = {
        moment: sGuess,
        area: returnZoneParent(sGuess),
        location: returnZoneChild(sGuess).raw,
        isGuessed: true
      };

      setLabelArea(oGuessedLocation.area);
      setLabelLocation(oGuessedLocation.location);
    } else {
      oGuessedLocation = {
        moment: sGuess,
        area: sSelectedArea,
        location: sSelectedLocation,
        isGuessed: false
      };

      setLabelArea(sSelectedArea);
      setLabelLocation(sSelectedLocation);
    }

    var oZoneChildTemp;
    var sTimeZoneTemp;
    for (var i in aTimeZones) {
      oZoneChildTemp = null;
      oZoneChildTemp = returnZoneChild(aTimeZones[i]);

      if (oZoneChildTemp.hasID === true) {
        sTimeZoneTemp = moment.tz(aTimeZones[i]).format('Z');
        offsetTmz.push({
          sZoneParent: returnZoneParent(aTimeZones[i]),
          sZoneChild: oZoneChildTemp.raw,
          sZoneChildUI: oZoneChildTemp.formatted,
          bHasID: oZoneChildTemp.hasID,
          timeZoneId: aTimeZones[i],
          timeZone: sTimeZoneTemp,
          timeZoneAbbreviation: moment.tz(aTimeZones[i]).format('z'),
          timeZoneLabel: 'GMT' + sTimeZoneTemp
        });
      } // oZoneChildTemp.hasID === true
    }

    offsetTmz.sort(function(a, b) {
      return a.timeZone - b.timeZone;
    });

    //    console.log(offsetTmz);
    async.waterfall([
      waterfallEmpty,
      createListAreas(aTimeZoneAreas),
      createListLocations(offsetTmz),
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

    sSelectedArea = btnAttribute;
    sSelectedLocation = SELECTED_LOCATION;

    if (btnAttribute !== 'All') {
      createListLocations(offsetTmz);
    } else {
      createListLocations(offsetTmz);
    }

    listenerClickLocations(eButtonsLocations);
    setLabelArea(btnAttribute);
    setLabelLocation(SELECTED_LOCATION);

    async.waterfall([
      waterfallEmpty,
      removeActiveFromButtons(eButtonsAreas),
      addClassToClickedButton(event.target, 'active')
    ]);

    eAreas.classList.add('hide');
    eLocations.classList.remove('hide');
  }

  function setDefaultsForButtons() {
    eSearchArea.value = '';
    eSearchLocation.value = '';
    eSearchAreaIcon.setAttribute('data-type', 'search');
    eSearchLocationIcon.setAttribute('data-type', 'search');
  }

  function onClickButtonLocation(event) {
    var attributeArea = this.getAttribute('data-area');
    var attributeLocation = this.getAttribute('data-location');
    var attributeLocationUI = this.getAttribute('data-location-ui');
    var attributeIdentifier = this.getAttribute('data-tzid');
    // todo
    alert(attributeArea);
    setDefaultsForButtons();
    setLabelLocation(attributeLocationUI);

    async.waterfall([
      waterfallEmpty,
      removeActiveFromButtons(eButtonsLocations),
      addClassToClickedButton(event.target, 'active')
    ]);
  }

  function onClickButtonSelectedArea(event) {
    //  alert('here');
    eAreas.classList.remove('hide');
    eLocations.classList.add('hide');
  }

  function onClickButtonSelectedLocation(event) {
    //  alert('there');
    eAreas.classList.add('hide');
    eLocations.classList.remove('hide');
  }

  function onClickButtonSearchAreaIcon(event) {
    var sAttribute = event.target.getAttribute('data-type');
    alert(sAttribute);
    if (sAttribute === 'search') {
      // call search
    } else {
      // call clear
    }
  }

  function onClickButtonSearchLocationIcon(event) {
    var sAttribute = event.target.getAttribute('data-type');
    alert(sAttribute);
    if (sAttribute === 'search') {
      // call search
    } else {
      // call clear
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
    eTimezoneArea.textContent = sArea;
    sSelectedArea = sArea;
  }

  function setLabelLocation(sLocation) {
    eTimezoneLocation.textContent = sLocation;
    sSelectedLocation = sLocation;
  }

  function addListeners() {
    eButtonsAreas = window.document.getElementsByClassName('ctl-listitem-area');
    eButtonsLocations = window.document.getElementsByClassName(
      'ctl-listitem-location'
    );

    addStandardListeners();
    addListenerClickAreas(eButtonsAreas);
  }

  function init() {
    setLabelArea(sSelectedArea);
    setLabelLocation(sSelectedLocation);
    getAsyncTZs();
  }

  return {
    init: init,
    filterListAreas: filterListAreas,
    filterListLocations: filterListLocations
  };
})();

var myMoment = suiMoment;
myMoment.init();
