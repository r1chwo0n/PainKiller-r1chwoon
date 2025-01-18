import express, { Request, Response, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import { dbClient } from "../db/client"; // นำเข้า dbClient ที่สร้างไว้ใน client.ts
import { drugTable, stockTable } from "../db/schema";
import { eq } from "drizzle-orm";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    // origin: false, // Disable CORS
    origin: "*", // Allow all origins
  })
);
app.use(bodyParser.json());

// Routes

// 1. Get all drugs
// http://localhost:3000/drugs
app.get("/drugs", async (req, res) => {
  try {
    const drugs = await dbClient.select().from(drugTable);
    res.json(drugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch drugs" });
  }
});

// 2. search by name
// http://localhost:3000/drugs/search?name=ฟ้าทะลายโจร
app.get("/drugs/search", async (req: Request, res: Response) => {
  const { name } = req.query; // รับ query parameter ชื่อยา
  try {
    const drugs = await dbClient
      .select()
      .from(drugTable)
      .where(eq(drugTable.name, name as string)); // ค้นหาตามชื่อ
    res.json(drugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch drugs" });
  }
});

// 3. Add a new drug
// http://localhost:3000/drugs
app.post("/drugs", async (req, res) => {
  try {
    const newDrug = await dbClient.insert(drugTable).values(req.body).returning();
    res.status(201).json(newDrug);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add drug" });
  }
});

// 4. Update a drug
// http://localhost:3000/drugs
app.patch("/drugs", async (req, res, next) => {
  try {
    const id = req.body.id ?? ""; // รับ UUID ของยา
    const updates = req.body.updates; // รับข้อมูลที่ต้องการอัปเดต

    // ตรวจสอบว่ามีข้อมูลใน body หรือไม่
    if (!updates || Object.keys(updates).length === 0 || !id) {
      throw new Error("Empty updates or id");
    }

    // ตรวจสอบว่ามียาอยู่ในฐานข้อมูลหรือไม่
    const results = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    // อัปเดตข้อมูลยา
    const result = await dbClient
      .update(drugTable)
      .set(updates) // ใช้ข้อมูลที่ส่งมาใน body
      .where(eq(drugTable.drug_id, id)) // ใช้ UUID เพื่อระบุยา
      .returning(); // ส่งค่าที่อัปเดตกลับมา

    res.json({ msg: "Update successfully", data: result[0] }); // ส่งผลลัพธ์ที่อัปเดตกลับไป
  } catch (err) {
    next(err); // ส่งต่อข้อผิดพลาดไปยัง middleware ถัดไป
  }
});

// 5. Delete a drug
// http://localhost:3000/drugs
app.delete("/drugs", async (req, res, next) => {
  try {
    const id = req.body.id ?? ""; // รับ UUID ของยา
    if (!id) throw new Error("Empty id"); // ตรวจสอบว่า id ไม่ว่าง

    // ตรวจสอบว่ามียาอยู่ในฐานข้อมูลหรือไม่
    const results = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, id),
    });
    if (results.length === 0) throw new Error("Invalid id"); // ถ้าไม่พบให้โยนข้อผิดพลาด

    // ลบข้อมูลยา
    await dbClient.delete(drugTable).where(eq(drugTable.drug_id, id)); // ลบยาออกจาก drugTable

    // ส่งข้อความยืนยันการลบกลับไป
    res.json({
      msg: "Delete successfully",
      data: { id }, // ส่ง id ของยาที่ถูกลับกลับไป
    });
  } catch (err) {
    next(err); // ส่งข้อผิดพลาดไปยัง middleware ถัดไป
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

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let serializedError = JSON.stringify(err, Object.getOwnPropertyNames(err));
  serializedError = serializedError.replace(/\/+/g, "/");
  serializedError = serializedError.replace(/\\+/g, "/");
  res.status(500).send({ error: serializedError });
};
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});