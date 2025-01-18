import express from "express";
import bodyParser from "body-parser";
import { dbClient } from "../db/client"; // นำเข้า dbClient ที่สร้างไว้ใน client.ts
import { drugTable, stockTable } from "../db/schema";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes

// 1. Get all drugs
app.get("/drugs", async (req, res) => {
  try {
    const drugs = await dbClient.select().from(drugTable);
    res.json(drugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch drugs" });
  }
});

// 2. Add a new drug
app.post("/drugs", async (req, res) => {
  try {
    const newDrug = await dbClient.insert(drugTable).values(req.body).returning();
    res.status(201).json(newDrug);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add drug" });
  }
});


// 6. Add stock
app.post("/stocks", async (req, res) => {
  try {
    const newStock = await dbClient.insert(stockTable).values(req.body).returning();
    res.status(201).json(newStock);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add stock" });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
