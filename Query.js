const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("5m Sales Records.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // create a new connection to the database
    const pool = new Pool({
        user: 'me',
        host: 'localhost',
        database: 'priya',
        password: 'Govind@123',
        port: 5432,
      })
 
    const query =
      "INSERT INTO category (region, country, item_type, sales_channel, order_priority, order_date, order_id, ship_date, units_sold, unit_price, unit-cost, total_revenue, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);


