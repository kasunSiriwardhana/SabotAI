import isEmpty from 'lodash.isempty';

/**
 *
 * @param {object} messages
 * @param {string} fn
 * @param {string} code
 * @returns string
 */
export const generateErrorMessage = (messages, fn, code) => {
  const location = fn.toUpperCase();

  if (isEmpty(messages)) throw new Error('Error messages object is required');
  if (isEmpty(messages[location]))
    throw new Error('Caller is not defined in error messages object');

  if (messages[location][code]) {
    return messages[location][code];
  }

  if (messages[location].generic) {
    return messages[location].generic;
  }

  console.warn('Generic error not defined');
  return `Error occured on ${fn}`;
};
