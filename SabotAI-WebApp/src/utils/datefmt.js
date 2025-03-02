import { format, isValid, formatDistance } from 'date-fns';
import { enGB } from 'date-fns/locale';

const ERROR_RETURN = 'N/A';

function validateInputDate(date) {
  if (!date) {
    throw new Error('Date is a required parameter');
  }

  if (date instanceof Date && isValid(date)) {
    return date;
  }

  const dateObj = new Date(date);
  if (isValid(dateObj)) {
    return dateObj;
  }

  throw new Error('Supplied date is an invalid date');
}

export function toDate(date, formatStr = 'PP') {
  try {
    const validatedDate = validateInputDate(date);
    return format(validatedDate, formatStr, {
      locale: enGB,
    });
  } catch (error) {
    console.warn(error.message);
    return ERROR_RETURN;
  }
}

export function toRelativeDate(date, baseDate = new Date()) {
  try {
    const validatedDate = validateInputDate(date);
    const validatedBaseDate = validateInputDate(baseDate);

    return formatDistance(validatedDate, validatedBaseDate, { addSuffix: true });
  } catch (error) {
    console.warn(error.message);
    return ERROR_RETURN;
  }
}

export default {
  install: (app) => {
    app.config.globalProperties.$toDate = toDate;
    app.config.globalProperties.$toRelativeDate = toRelativeDate;
    app.provide('toDate', toDate);
    app.provide('toRelativeDate', toRelativeDate);
  },
};
