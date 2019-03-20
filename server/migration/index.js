const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let db = process.env.DATABASE_URL;
if (process.env.NODE_ENV == 'test') {
  db = process.env.TEST_DATABASE_URL;
}
const pool = new Pool({
  connectionString: db,
});

/**
 * Drop Tables
 */

const dropGroupMemberTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS groupmembers';
  try {
    await pool.query(queryText);
    console.log('Dropped group member table');
  } catch (err) {
    console.log('Error dropping table');
  }
};

const dropGroupTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS groups CASCADE';
  try {
    await pool.query(queryText);
    console.log('Dropped group table');
  } catch (err) {
    console.log('Error dropping table');
  }
};

const dropUserTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS users CASCADE';
  try {
    await pool.query(queryText);
    console.log('Dropped user table');
  } catch (err) {
    console.log('Error dropping table');
  }
};

/**
 * Create Tables
 */
const createUserTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        users (
          id serial PRIMARY KEY,
          email VARCHAR(180) NOT NULL,
          password VARCHAR NOT NULL,
          firstname VARCHAR(128) NOT NULL,
          lastname VARCHAR(128) NOT NULL
        )`;

  try {
    await pool.query(queryText);
    console.log('Created user table');
  } catch (err) {
    console.log('Error creating user table');
  }
};

const createGroupTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        groups (
          id serial PRIMARY KEY,
          name VARCHAR(180) NOT NULL,
          adminid INT REFERENCES users(id)
        )`;
  try {
    await pool.query(queryText);
    console.log('Create group table');
  } catch (err) {
    console.log('Error creatinf group table');
  }
};

const createGroupMemberTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        groupmembers (
          groupid INT REFERENCES groups(id),
          memberid INT REFERENCES users(id),
          userrole VARCHAR(180)
        )`;
  try {
    await pool.query(queryText);
    console.log('Create group member table');
  } catch (err) {
    console.log('Error creating group member table');
  }
};

const dropAllTables = async () => {
  await dropGroupMemberTable();
  await dropGroupTable();
  await dropUserTable();
};

const createAllTables = async () => {
  await createUserTable();
  await createGroupTable();
  await createGroupMemberTable();
};

module.exports = {
  dropAllTables,
  createAllTables,
};

require('make-runnable');
