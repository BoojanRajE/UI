export function getData(): any[] {
  var years = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'october',
    'November',
    'December',
  ];

  return years.map(function (year) {
    return {
      country: year,
      users: Math.floor(Math.floor(Math.random() * 50)),
      students: Math.floor(Math.floor(Math.random() * 100)),
      faculty: Math.floor(Math.floor(Math.random() * 200)),
    };
  });
}
