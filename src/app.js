var program = require('commander');
var PdfReader = require('pdfreader').PdfReader;

program.version('0.0.1')
  .option('-f, --file [type]', 'File to process [file.pdf]', 'file.pdf')
  .parse(process.argv);

console.log('  - %s processing...', program.file);

var itemsPriors = [];
var dayInfo;
var idx = 0;
var canStartProcess = false;

var DateMeasure = function(ms) {
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

var sumHours = function (start1, end1, start2, end2) {
    var diff1 = end1.diff(start1);
    var diff2 = end2.diff(start2);
    var minutes = (diff1.hours + diff2.hours) * 60;
    return minutes + diff1.minutes + diff2.minutes;
};

var isHour = function (text) {
    return text === '0013' || text === '0001';
};

var convertToDate = function (year, month, day, hours) {
    return hours.map(function (obj) {
        return new Date(month + '/' + day + '/' + year + ' ' + obj);
    });
};

var extractDays = function (hoursText) {
    hoursText = hoursText.replace('/', '//').trim();
    var hoursExtracted = /(.*)(Horas.*)/gmi.exec(hoursText);
    if (hoursExtracted && hoursExtracted.length > 0) {
        hoursText = hoursExtracted[1].trim();
        var hoursList = convertToDate(2015, 1, dayInfo.day, hoursText.split(' '));
        if (hoursText) {
            return {
                day: dayInfo.day,
                dayMonth: dayInfo.dayMonth,
                hours: hoursList,
                totalWork: sumHours(hoursList[0], hoursList[1], hoursList[2], hoursList[3])
            };
        }
    } else {
        console.log('Hours not extracted from "%s"', hoursText);
    }

    return undefined;
};

var callback = function (hours) {
    var totalMinutes = 0;
    hours.forEach(function (it) {
        totalMinutes += it.totalWork;
        console.log('On day %s, you work %s:%s', it.day, Math.floor(it.totalWork / 60), Math.round(it.totalWork % 60));
    });

    var hoursWorked = Math.floor(totalMinutes / 60);
    var minutesWorked = Math.round(totalMinutes % 60);

    console.log('Total : %d:%d', hoursWorked, minutesWorked);
};

var hours = [];

function processFile() {
    // TODO: Use a static function
    new PdfReader().parseFileItems(program.file, function (err, item) {

        if (!item) { callback(hours); }
        if (!item.text) { return; }

        canStartProcess = canStartProcess ? canStartProcess : item.text === 'MarcaÃÂÃÂÃÂÃÂ§ÃÂÃÂÃÂÃÂµes';
        if (!canStartProcess)  { return; }

        itemsPriors.push(item);

        if (isHour(item.text)) {
            dayInfo = {
                day: itemsPriors[idx - 2].text,
                dayMonth: itemsPriors[idx - 1].text
            };
        } else if (dayInfo) {
            var extractedDay = extractDays(item.text);
            if (extractedDay) {
                hours.push(extractedDay);
            }
            dayInfo = undefined;
        }

        idx++;
    });
}

function DateDiff(date1, date2) {
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
    this.date1 = date1;
    this.date2 = date2;

    this.init();
}

DateDiff.prototype.init = function () {
    var data = new DateMeasure(this.date1 - this.date2);
    this.days = data.days;
    this.hours = data.hours;
    this.minutes = data.minutes;
    this.seconds = data.seconds;
};

Date.diff = function (date1, date2) {
    return new DateDiff(date1, date2);
};

Date.prototype.diff = function (date2) {
    return new DateDiff(this, date2);
};

module.exports = processFile;
