var suiMoment = (function() {
  /* Time Zones */
  var eListGroups = window.document.getElementById('list-groups');
  var aTimeZones = moment.tz.names();
  var aTimeZoneParents = [];
  var oTimeZones = {};
  var oGuessedTimeZone = {};
  var sSelectedParent = '';
  var offsetTmz = [];

  function onInputParentChange(e) {
    var sCheck = e.target.value;
    if (sCheck !== sSelectedParent) {
      sSelectedParent = e.target.value;
      replaceOptionsChildren(offsetTmz, sSelectedParent, '');
    }
  }

  function filterListGroups(e) {
    filter = e.target.value.toLowerCase();
    li = eListGroups.getElementsByTagName('li');
    var button, sData;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      button = li[i].getElementsByTagName('button')[0];
      sData = button.getAttribute('data-button');

      if (sData.indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  function createListGroups(aP) {
    var frag = window.document.createDocumentFragment();
    var aT = aP.map(function(oListItem) {
      var sLIlc = oListItem.toLowerCase();
      var li = window.document.createElement('li');
      var button = window.document.createElement('button');
      var img = window.document.createElement('img');
      var s = '<img src="images/50x50/' + sLIlc + '.png" alt="">' + oListItem;

      button.className = 'btn-listitem-group';
      button.setAttribute('data-button', sLIlc);

      img.src = 'images/50x50/' + sLIlc + '.png';
      img.alt = '';

      button.appendChild(img);
      button.appendChild(window.document.createTextNode(oListItem));

      li.appendChild(button);
      frag.appendChild(li);
      return s;
    });
    eListGroups.appendChild(frag);
  }

  function createOptionsParent(aP) {
    var div = document.querySelector('#parents'),
      frag = document.createDocumentFragment(),
      select = document.createElement('select');

    select.options.add(new Option('-- Choose --', '--choose--', true, true)); // selected

    sSelectedParent = '--choose--';

    for (var i = 0; i < aP.length; i++) {
      if (aP[i] !== oGuessedTimeZone.parent) {
        select.options.add(new Option(aP[i], aP[i]));
      } else {
        sSelectedParent = aP[i];
        select.options.add(new Option(aP[i], aP[i], true, true));
      }
    }

    select.onchange = onInputParentChange;

    frag.appendChild(select);
    div.appendChild(frag);
  }

  function doChildOptionsWork(select, aC, sSelectedParent, sSelectedChild) {
    if (sSelectedParent !== '*') {
      // filter list, then do stuff
      var res = aC.filter(function(x) {
        if (x.sZoneParent === sSelectedParent) {
          return x;
        }
      });

      for (var i = 0; i < res.length; i++) {
        if (res[i].sZoneChild !== sSelectedChild) {
          select.options.add(
            new Option(res[i].sZoneChildUI, res[i].sZoneChild)
          );
        } else {
          select.options.add(
            new Option(res[i].sZoneChild, res[i].sZoneChildUI, true, true)
          );
        }
      }
    } else {
      for (var i = 0; i < aC.length; i++) {
        if (aC[i] !== sSelectedParent) {
          select.options.add(new Option(aC[i].sZoneChildUI, aC[i].sZoneChild));
        } else {
          select.options.add(
            new Option(aC[i].sZoneChildUI, aC[i].sZoneChild, true, true)
          );
        }
      }
    }
  }

  function replaceOptionsChildren(aC, sSelectedParent, sSelectedChild) {
    var div = document.querySelector('#children');

    var select = div.getElementsByTagName('select');
    select[0].options.length = 0;
    //console.log(select[0])
    doChildOptionsWork(select[0], aC, sSelectedParent, sSelectedChild);

    //    frag.appendChild(select);
    //    div.appendChild(frag);
  }

  function createOptionsChildren(aC, sSelectedParent, sSelectedChild) {
    var div = document.querySelector('#children'),
      frag = document.createDocumentFragment(),
      select = document.createElement('select');

    doChildOptionsWork(select, aC, sSelectedParent, sSelectedChild);

    frag.appendChild(select);
    div.appendChild(frag);
  }

  function unpackTimeZones() {
    aTimeZoneParents = aTimeZones
      .map(function(s) {
        if (s.indexOf('/') > -1) {
          var sZoneParent = s.substr(0, s.indexOf('/'));

          if (typeof sZoneParent !== 'undefined') {
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

    //    console.log(aTimeZoneParents);
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
    return { raw: sT, formatted: res, hasID: hasID };
  }
  function getAsyncTZs(callback) {
    //   console.log(aTimeZones.sort());
    //  console.log(o);
    unpackTimeZones();
    var other = '';
    var sGuess = moment.tz.guess();

    oGuessedTimeZone = {
      moment: sGuess,
      parent: returnZoneParent(sGuess),
      child: returnZoneChild(sGuess).raw
    };

    //console.log('a', aTimeZones)
    var oZoneChildTemp;
    var sTimeZoneTemp;
    for (var i in aTimeZones) {
      //      console.log(other)
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

    console.log(offsetTmz);
    createOptionsParent(aTimeZoneParents);
    createListGroups(aTimeZoneParents);
    createOptionsChildren(offsetTmz, sSelectedParent, oGuessedTimeZone.child);

    if (callback && typeof callback === 'function') {
      callback();
    }
  }

  function init() {
    getAsyncTZs();
  }

  return {
    init: init,
    filterListGroups: filterListGroups
  };
})();

var myMoment = suiMoment;
myMoment.init();

/*
  function mySandwich(param1, param2, callback) {
      alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
      if (callback && typeof(callback) === "function") {
          callback();
      }
  }
  
  mySandwich('ham', 'cheese', 'vegetables');
  */
