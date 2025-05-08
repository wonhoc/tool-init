import { Router } from "express";
import multer from "multer";
import { ServerController } from "../controllers/ServerController";

const router = Router();
const serverController = new ServerController();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/registerServerInfo", upload.single("privateKey"), serverController.registerServerInfo);
router.get("/getServerList", serverController.getServerList);
router.post("/inputCommand", serverController.inputCommand);

export default router;