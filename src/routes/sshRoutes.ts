import { Router } from "express";
import multer from "multer";
import { registerServerInfo } from "../controllers/sshController";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/registerServerInfo", upload.single("privateKey"), registerServerInfo);

export default router;