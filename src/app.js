const request = require("request");
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express(); //express-function generates an app
const port = process.env.PORT || 3000; // Option +  7

const viewsPath = path.join(__dirname, "../templates/views");
const partials = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs"); // handlebars set up!  folder: views
app.set("views", viewsPath);
hbs.registerPartials(partials);

//Serving up a directory
app.use(express.static(path.join(__dirname, "../public")));

app.get("", (req, res) => {
  res.render("index", {
    title: " Weather App by US",
    name: "US",
  }); //hbs templating
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "The ultimate help page",
    message: "Try 42",
    name: "US",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "The About Page is here",
    name: "US",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "No address provided",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      // Only one get a value, error or data

      if (error) {
        return res.send({
          error: "Houston, there is a problem in geocode!",
        });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          location: location,
          forecast: forecastData,
          address: req.query.address,
        });
        //console.log(location)
        //console.log(forecastData)
      });
    }
  );

  /*     res.send({
        forecast: 'It will rain, with a temperature of 22 degrees',
        location: 'Philadelphia',
        address: req.query.address
    }) */
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "Please provide a search!",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get(/help.*/, (req, res) => {
  res.render("404", {
    message: "Help article not found - 404",
  });
});

app.get(/.*/, (req, res) => {
  res.render("404", {
    message: "Page not found - 404",
  });
});

// Start server
app.listen(port, () => {
  console.log("Server started ok on port: " + port);
});
