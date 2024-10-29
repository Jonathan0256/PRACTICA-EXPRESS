import { Router } from "express";
import {
  createCar,
  getCarList,
  getCarDetail,
} from "../controllers/routesController.js";

const router = Router();

router.post("/", createCar);

router.get("/", getCarList);

router.get("/:marca/:model", getCarDetail);

export default router;
