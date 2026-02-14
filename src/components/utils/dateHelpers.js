import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const toDateObject = (d) =>
  d instanceof DateObject
    ? d
    : new DateObject({ date: d, calendar: persian, locale: persian_fa });

export const nowPersian = () =>
  new DateObject({ calendar: persian, locale: persian_fa });

export const formatYMD = (d) => {
  if (!d) return null;
  try {
    return toDateObject(d).format("YYYY-MM-DD");
  } catch {
    return null;
  }
};

export const formatReadable = (d) => {
  if (!d) return "";
  try {
    return toDateObject(d).format("dddd DD MMMM");
  } catch {
    return "";
  }
};
