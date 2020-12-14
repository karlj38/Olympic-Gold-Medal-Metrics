var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("./gold_medals.sqlite");

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  const sql = `CREATE TABLE Country (
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      gdp INTEGER,
      population INTEGER
    );`;
  return sql;
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  const sql = `CREATE TABLE GoldMedal (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    city TEXT NOT NULL,
    season TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    gender TEXT NOT NULL,
    sport TEXT NOT NULL,
    discipline TEXT NOT NULL,
    event TEXT NOT NULL
  );
  `;
  return sql;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = (country) => {
  const sql = `SELECT COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  ;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = (country) => {
  const sql = `SELECT year, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}" AND season = "Summer"
  GROUP BY year
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = (country) => {
  const sql = `SELECT year, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}" AND season = "Winter"
  GROUP BY year
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = (country) => {
  const sql = `SELECT year, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  GROUP BY year
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = (country) => {
  const sql = `SELECT discipline, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  GROUP BY 1
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = (country) => {
  const sql = `SELECT sport, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  GROUP BY 1
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = (country) => {
  const sql = `SELECT event, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  GROUP BY 1
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = (country) => {
  const sql = `SELECT COUNT(DISTINCT name) as "count"
  FROM GoldMedal
  WHERE country = "${country}" AND gender = "Men";
  `;
  return sql;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = (country) => {
  const sql = `SELECT COUNT(DISTINCT name) as "count"
  FROM GoldMedal
  WHERE country = "${country}" AND gender = "Women";
  `;
  return sql;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = (country) => {
  const sql = `SELECT name, COUNT(*) as "count"
  FROM GoldMedal
  WHERE country = "${country}"
  GROUP BY name
  ORDER BY 2 desc
  LIMIT 1;
  `;
  return sql;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  const order = sortAscending ? "ASC" : "DESC";
  let filter = "";
  if (field) {
    filter = `ORDER BY ${field} ${order}`;
  }

  const sql = `SELECT *
    FROM GoldMedal
    WHERE country = "${country}"
    ${filter};
    `;
  return sql;
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  const order = sortAscending ? "ASC" : "DESC";
  let filter = "";
  if (field) {
    filter = `ORDER BY GoldMedal.${field} ${order}`;
  }

  const sql = `
  WITH results as (
    SELECT sport,
      COUNT(*) as "count"
    FROM GoldMedal
    WHERE country = "${country}"
    GROUP BY sport
  )
  SELECT results.sport, 
         results.count as "count", 
         count * 100 / COUNT(count) as "percent"
  FROM GoldMedal, results
  WHERE country = "${country}"
      GROUP BY results.sport
    ${filter};
    `;
  return sql;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports,
};
