
var PdfReader = require("pdfreader").PdfReader;
var hours = [];
var itensPriors = [];
var dayInfo;
var idx = 0;
var canStartProcess = false;

var isHour = function(text) {
    var isH = text === "0013" || text === "0001";
    return isH;
};

var extractDay = function(itemText) {
    itemText = itemText.replace('/', '//');
    var hoursExtracted = /(.*)(Horas.*)/gmi.exec(itemText);
    if (hoursExtracted && hoursExtracted.length > 0) {
        //console.log(idx + ": extract day from '%s'", hoursExtracted  )
        if (hoursExtracted[1].trim()) {
            return {
                day: dayInfo.day,
                dayMonth: dayInfo.dayMonth,
                hours: hoursExtracted[1].trim()
            };
        }
    } else {
        console.log("Hours not extracted from '%s'", itemText);
    }

    return undefined;
};

new PdfReader().parseFileItems("sample.pdf", function(err, item) {
    if (!item || !item.text) return;
    canStartProcess = canStartProcess ? canStartProcess : item.text === "Marcações";
    if (!canStartProcess) return;

    itensPriors.push(item);

    //console.log("-- process '%s'", item.text)

    if (isHour(item.text)) {
        dayInfo = {
            day: itensPriors[idx - 2].text,
            dayMonth: itensPriors[idx - 1].text
        }
    } else if (dayInfo) {
        var extractedDay = extractDay(item.text);
        if (extractedDay) {
            hours.push(extractedDay)
            console.log(idx + ": %s", idx, extractedDay);
        }
        dayInfo = undefined;
    }

    idx++;
});