/**
 * Creates a new date from a number
 * @param {Number} timeStamp dateTime in timeStamp format.
 * @returns {Date|null} a Date object if the timeStamp could be parsed. Null otherwise.
 */
export const dateFromTimeStamp = timeStamp => {
  if (timeStamp !== null && timeStamp !== undefined) {
    return new Date(timeStamp);
  }
  return null;
};

/**
 * Gets the number of days elapsed between 2 dates.
 * @param {Date} date1 the first date
 * @param {Date} [date2] (Optional) the second date (default is the current date)
 * @returns {Number} the number of days elapsed (rounded down)
 */
export const calcDaysElapsedFloor = (date1, date2) => {
  if (date1 !== null && date1 !== undefined) {
    date2 = date2 || new Date();
    var timeDiff = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }
};

function pad(num, size, leadingChar = "0") {
  var s = num + "";
  while (s.length < size) s = leadingChar + s;
  return s;
}

export const getDateAsString = (timeStamp, separator = "-") => {
  let date = dateFromTimeStamp(timeStamp);
  if (date !== null) {
    let dateStr = date.getFullYear() + separator;
    dateStr += pad(date.getMonth() + 1, 2) + separator;
    dateStr += pad(date.getDate(), 2);
    return dateStr;
  }
  return "";
};

export const getTimeAsString = timeStamp => {
  let date = dateFromTimeStamp(timeStamp);
  const separator = ":";
  if (date !== null) {
    return pad(date.getHours(), 2) + separator + pad(date.getMinutes(), 2);
  }
  return "";
};

export const months = [
  { value: 0, name: "Janeiro" },
  { value: 1, name: "Fevereiro" },
  { value: 2, name: "Março" },
  { value: 3, name: "Abril" },
  { value: 4, name: "Maio" },
  { value: 5, name: "Junho" },
  { value: 6, name: "Julho" },
  { value: 7, name: "Agosto" },
  { value: 8, name: "Setembro" },
  { value: 9, name: "Outubro" },
  { value: 10, name: "Novembro" },
  { value: 11, name: "Dezembro" }
];

export const getMonthName = month => {
  if (!isNaN(Number(month))) {
    const monthNumber = Number(month);
    let monthObj = months.filter(item => item.value === monthNumber);
    return monthObj.length > 0 ? monthObj[0].name : "";
  } else {
    return "";
  }
};
