const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

/**
 * Formats a publish date in the timezone it was written in, not the reader's.
 *
 * A post belongs to the day its author put on it. Formatting through the
 * reader's locale — which the previous site did — moved that day around by up
 * to one, depending on where the page was opened.
 */
export const AUTHOR_TIME_ZONE = 'Asia/Tokyo';

export const formatPostDate = (iso: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: AUTHOR_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date(iso));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '';

  return `${get('year')} ${MONTHS[Number(get('month')) - 1]} ${get('day')}`;
};
