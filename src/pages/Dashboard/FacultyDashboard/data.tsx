var numRows = 500;

var names = ['Col 1', 'Col 2', 'Col 2', 'Col 4', 'Col 5', 'Col 6', 'Col 7'];

var phones = [
  { handset: 'Row 1', price: 599 },
  { handset: 'Row 2', price: 589 },
  { handset: 'Row 3', price: 849 },
  { handset: 'Row 4', price: 499 },
  { handset: 'Row 5', price: 549 },
  { handset: 'Row 6', price: 279 },
];

export function getData(): any[] {
  var data: any[] = [];
  for (var i = 0; i < numRows; i++) {
    var phone = phones[getRandomNumber(0, phones.length)];
    var saleDate = randomDate(new Date(2020, 0, 1), new Date(2020, 11, 31));
    var quarter = 'Q' + Math.floor((saleDate.getMonth() + 3) / 3);

    data.push({
      salesRep: names[getRandomNumber(0, names.length)],
      handset: phone.handset,
      sale: phone.price,
      saleDate: saleDate,
      quarter: quarter,
    });
  }

  data.sort(function (a, b) {
    return a.saleDate.getTime() - b.saleDate.getTime();
  });

  data.forEach(function (d) {
    d.saleDate = d.saleDate.toISOString().substring(0, 10);
  });

  return data;
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
