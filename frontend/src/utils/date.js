export const getLocalDateInputValue = (date = new Date()) => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  const value = String(date);
  const isoDateMatch = value.match(/^\d{4}-\d{2}-\d{2}/);

  if (isoDateMatch) {
    return isoDateMatch[0];
  }

  return getLocalDateInputValue(new Date(value));
};

export const formatCalendarDate = (date) => {
  const dateInputValue = getDateInputValue(date);

  if (!dateInputValue) {
    return "-";
  }

  const [year, month, day] = dateInputValue.split("-");

  return `${day}/${month}/${year}`;
};
