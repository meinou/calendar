const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthService = {};

monthService.getMonthName = (month) => months[month];

monthService.getMonths = () => months;

export default monthService;
