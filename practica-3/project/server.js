import express from "express";
import rutes from "./routes/routes.js";

const app = express();
const PORT = 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/cars", (req, res, next) => {
  console.log("Nova petició a /cars");
  next();
});

app.use("/cars", rutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
