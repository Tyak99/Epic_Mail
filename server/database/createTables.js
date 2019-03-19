import db from './index';

const userQueryText = `CREATE TABLE IF NOT EXISTS
users (
  id serial PRIMARY KEY,
  email VARCHAR(128) NOT NULL,
  password VARCHAR(128) NOT NULL,
  firstname VARCHAR(128) NOT NULL,
  lastname VARCHAR(128) NOT NULL
)`;
const createTable = () => {
  db.query(userQueryText);
};

export default createTable;