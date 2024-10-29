import express from "express";
import fs from "fs";

const app = express();
const PORT = 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/cars", (req, res) => {
  const carData = {
    marca: req.body.marca,
    model: req.body.model,
    any: parseInt(req.body.any),
    esElectric: req.body.esElectric === "on",
    imatge: req.body.imatge,
  };

  fs.readFile("data.json", (err, data) => {
    let cars = [];
    if (err && err.code === "ENOENT") {
      cars = [];
    } else if (err) {
      console.error("Error al escriure al arxiu:", err);
      return res.status(500).send("Error intern del servidor");
    } else {
      try {
        cars = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error al parsear JSON:", parseErr);
        return res.status(500).send("Error intern del servidor");
      }
    }

    cars.push(carData);

    fs.writeFile("data.json", JSON.stringify(cars), (err) => {
      if (err) {
        console.error("Error al escriure en el fitxer", err);
        return res.status(500).send("Error intern del servidor");
      }
      res.redirect("/cars");
    });
  });
});

app.get("/cars", (req, res) => {
  const carMarca = req.query.marca;
  const carModel = req.query.model;

  fs.readFile("data.json", (err, data) => {
    let cars = [];
    if (err && err.code === "ENOENT") {
      cars = [];
    } else if (err) {
      console.error("Error al lllegir l'arxiu:", err);
      return res.status(500).send("Error intern del servidor");
    } else {
      try {
        cars = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error:", parseErr);
        return res.status(500).send("Error intern del servidor");
      }
    }

    if (!carMarca || !carModel) {
      let carList = "<h1>Llista de Cotxes</h1><ul>";
      cars.forEach((car) => {
        carList += `<li><a href="/cars?marca=${car.marca}&model=${car.model}">${car.marca} ${car.model}</a></li>`;
      });
      carList += '</ul><a href="/index.html">Crear Nou Cotxe</a>';

      res.send(`
        <!DOCTYPE html>
        <html lang="ca">
        <head><meta charset="UTF-8"></head>
        <body>${carList}</body>
        </html>
      `);
    } else {
      const car = cars.find(
        (c) => c.marca === carMarca && c.model === carModel
      );

      if (car) {
        res.send(`
          <!DOCTYPE html>
          <html lang="ca">
          <head><meta charset="UTF-8"></head>
          <body>
            <h1>Detall del Cotxe</h1>
            <p><strong>Marca:</strong> ${car.marca}</p>
            <p><strong>Model:</strong> ${car.model}</p>
            <p><strong>Any:</strong> ${car.any}</p>
            <p><strong>És elèctric:</strong> ${car.esElectric ? "Sí" : "No"}</p>
            <img src="${
              car.imatge
            }" alt="Imatge del cotxe" style="max-width:400px;">
            <br><a href="/cars">Tornar a la Llista de Cotxes</a>
          </body>  
          </html>
        `);
      } else {
        res.send("Cotxe no trobat.");
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor inicialitzat a: http://localhost:${PORT}`);
});
