const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

// handler functions
const shows = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/shows.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/users.json`));

const getAllShows = (req, res) => {
  res.status(200).json({
    status: "success",
    results: shows.length,
    data: {
      shows,
    },
  });
};

const createUser = (req, res) => {
  // console.log(req.body);
  const newId = users[users.length - 1]._id + 1;
  const newUser = Object.assign({ _id: newId }, req.body);

  users.push(newUser);

  fs.writeFile(
    `${__dirname}/dev-data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
    }
  );
};

const getUser = (req, res) => {
  console.log(req.params);

  JSON.stringify(users);
  const username = req.params.username;
  const user = users.find((el) => el.username === username);

  if (!users.includes(user)) {
    return res.status(404).json({
      status: "fail",
      message: "User does not exist",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

// routes
app.get("/shows", getAllShows);
app.post("/users", createUser);
app.get("/users/:username", getUser);

// server
const port = 3500;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
