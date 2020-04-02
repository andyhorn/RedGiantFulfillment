// const sqlite3 = require('sqlite3').verbose();
const { Pool, Client } = require('pg');
// const pool = new Pool();

const CREATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS userAuth (
    id integer PRIMARY KEY,
    name text,
    email text UNIQUE,
    password text
)`;

const SELECT_BY_EMAIL_SQL = 'SELECT * FROM userAuth WHERE email = ?';

const INSERT_SQL = 'INSERT INTO userAuth (name, email, password) VALUES (?, ?, ?)';

class Db {
    constructor(file) {
        // this.db = new sqlite3.Database(file);
        this.db = new Pool();
        this.createTable();
    }

    createTable() {
        this.db.run(CREATE_TABLE_SQL);
    }

    selectByEmailAsync(email) {
        return new Promise((resolve, reject) => {
            this.db.get(SELECT_BY_EMAIL_SQL, [email], (err, row) => {
                resolve({err, user: row});
            });
        });
    }

    insertAsync(email, name, password) {
        return new Promise((resolve, reject) => {
            this.db.run(INSERT_SQL, [email, name, password], (err) => {
                resolve(err);
            });
        });
    }
}

module.exports = Db;