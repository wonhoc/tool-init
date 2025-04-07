import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import {  } from "./ssh";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/registerServerInfo", async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  try {

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});