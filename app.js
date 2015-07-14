
var PdfReader = require("pdfreader").PdfReader;
var hours = [];
var itensPriors = [];
var dayInfo;
var idx = 0;
var canStartProcess = false;

var sumHours = function(start1, end1, start2, end2) {
    var diff1 = end1.diff(start1);
    var diff2 = end2.diff(start2);
    return {
        days: diff1.days + diff2.days,
        hours: diff1.hours + diff2.hours,
        minutes: diff1.minutes + diff2.minutes
    };
}

var isHour = function(text) {
    return text === "0013" || text === "0001";
};

var mapDate = function(month, day, year, hours) {
    return hours.map(function(obj){
        return new Date(month + '/' + day + '/' + year + ' ' + obj);
    });
}

var extractDay = function(hoursText) {
    hoursText = hoursText.replace('/', '//').trim();
    var hoursExtracted = /(.*)(Horas.*)/gmi.exec(hoursText);
    if (hoursExtracted && hoursExtracted.length > 0) {
        hoursText = hoursExtracted[1].trim();
        hoursList = mapDate(1, dayInfo.day, 2015, hoursText.split(' '));
        if (hoursText) {
            return {
                day: dayInfo.day,
                dayMonth: dayInfo.dayMonth,
                hours: hoursList,
                totalWork: sumHours(hoursList[0], hoursList[1], hoursList[2], hoursList[3])
            };
        }
    } else {
        console.log("Hours not extracted from '%s'", hoursText);
    }

    return undefined;
};

new PdfReader().parseFileItems("sample.pdf", function(err, item) {
    if (!item || !item.text) return;
    canStartProcess = canStartProcess ? canStartProcess : item.text === "Marcações";
    if (!canStartProcess) return;

    itensPriors.push(item);

    if (isHour(item.text)) {
        dayInfo = {
            day: itensPriors[idx - 2].text,
            dayMonth: itensPriors[idx - 1].text
        }
    } else if (dayInfo) {
        var extractedDay = extractDay(item.text);
        if (extractedDay) {
            hours.push(extractedDay)
            console.log("On day %s, you work %s:%s", extractedDay.day, extractedDay.totalWork.hours, extractedDay.totalWork.minutes);
        }
        dayInfo = undefined;
    }

    idx++;
});

 function DateDiff(date1, date2) {
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
    this.date1 = date1;
    this.date2 = date2;

    this.init();
  }

  DateDiff.prototype.init = function() {
    var data = new DateMeasure(this.date1 - this.date2);
    this.days = data.days;
    this.hours = data.hours;
    this.minutes = data.minutes;
    this.seconds = data.seconds;
  };

  function DateMeasure(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    this.days = d;
    this.hours = h;
    this.minutes = m;
    this.seconds = s;
  };

  Date.diff = function(date1, date2) {
    return new DateDiff(date1, date2);
  };

  Date.prototype.diff = function(date2) {
    return new DateDiff(this, date2);
  };