const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE;
const dbPort = process.env.DB_PORT;

const url = `mongodb://${dbHost}:${dbPort}/${dbDatabase}`;
console.log("MongoDB Connection String:");
console.log(url);

const UserSchema = new Schema({
  id: ObjectId,
  name: String,
  email: String,
  password: String
});

class Db {
  constructor() {
    this.user = mongoose.model("User", UserSchema);
  }
  openConnection() {
    return new Promise((resolve, reject) => {
      mongoose.Promise = global.Promise;
      mongoose
        .connect(url, {
          useNewUrlParser: true
        })
        .then(() => {
          console.log("Connected to database!");
          resolve();
        })
        .catch(err => {
          console.log("Error connecting to database:");
          console.log(err);
          reject();
        });
    });
  }

  async selectByEmailAsync(email) {
    try {
      await this.openConnection();
    } catch (e) {
      console.log("Unable to open database connection");
      return false;
    }
    return new Promise((resolve, reject) => {
      this.user.findOne({ email: email }, function(err, res) {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    });
  }

  async insertAsync(name, email, password) {
    console.log("Inserting user data:");
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Password: ${password}`);

    try {
      await this.openConnection();
    } catch (e) {
      console.log("Unable to open database connection");
      return false;
    }
    return new Promise((resolve, reject) => {
      this.user.create({ email, name, password }, (err, res) => {
        if (err) {
          console.log("Error creating user:");
          console.log(err);
          return reject(err);
        }

        return resolve(true);
      });
    });
  }
}

module.exports = Db;
