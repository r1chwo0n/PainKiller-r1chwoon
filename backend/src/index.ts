import express, { Request, Response, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import { dbClient } from "../db/client"; // นำเข้า dbClient ที่สร้างไว้ใน client.ts
import { drugTable, stockTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
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
app.get("/drugs", async (req, res, next) => {
  try {
    const drugsWithStock = await dbClient.query.drugTable.findMany({
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            unit_type: true,
            expired: true,
          }, 
        },
      },
    });
    res.json({
      msg: "Fetch drugs with stock successfully",
      data: drugsWithStock,
    });
  } catch (err) {
    next(err);
  }
});

// 2. Get a single drug by name
// http://localhost:3000/drugs/search?name=ฟ้าทะลายโจร
app.get("/drugs/search", async (req, res, next) => {
  try {
    const drugName = req.query.name; // รับค่า name จาก query string
    if (!drugName) {
      res.status(400).json({ msg: "Missing 'name' query parameter" });
      return;
    }

    // ดึงข้อมูลยาพร้อมกับข้อมูล stock ที่เกี่ยวข้อง
    const drugsWithStock = await dbClient.query.drugTable.findMany({
      where: (drugs, { like }) => like(drugs.name, `%${drugName}%`), 
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            unit_type: true,
            expired: true,
          }, 
        },
      },
    });

    // ส่งผลลัพธ์กลับไป
    res.json({
      msg: `Search results for "${drugName}"`,
      data: drugsWithStock,
    });
  } catch (err) {
    next(err);
  }
});


// 3. Get a single drug by ID
// http://localhost:3000/drugs/uuid
app.get("/drugs/:id", async (req, res, next) => {
  try {
    const drugId = req.params.id; 
    if (!drugId) {
      res.status(400).json({ msg: "Missing 'id' parameter" });
      return;
    }

    // ดึงข้อมูลยาพร้อมข้อมูลสต็อกที่เกี่ยวข้อง
    const drugWithStock = await dbClient.query.drugTable.findFirst({
      where: (drugs, { eq }) => eq(drugs.drug_id, drugId), // ค้นหายาด้วย drug_id
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            unit_type: true,
            expired: true,
          }, 
        },
      },
    });

    if (!drugWithStock) {
      res.status(404).json({ msg: `Drug with ID ${drugId} not found` });
      return;
    }

    // ส่งผลลัพธ์กลับไป
    res.json({
      msg: `Drug with ID ${drugId} found`,
      data: drugWithStock,
    });
  } catch (err) {
    next(err);
  }
});


// 4. Add a new drug
// {
//   "name": "Paracetamol",
//   "code": "PARACET",
//   "drug_type": "drug",
//   "detail": "Pain reliever and fever reducer",
//   "usage": "Take 1-2 tablets every 4-6 hours",
//   "slang_food": "Alcohol",
//   "side_effect": "Nausea, rash",
// }
app.post("/drugs", async (req, res) => {
  try {
    // ตรวจสอบว่ามียาในระบบอยู่แล้วหรือไม่ (Case-insensitive)
    const existingDrug = await dbClient.query.drugTable.findFirst({
      where: (drugs, { ilike }) => ilike(drugs.name, req.body.name), 
    });

    if (existingDrug) {
      res.status(400).json({
        message: "Drug with the same name already exists",
        existingDrug,
      });
      return;
    }
    const newDrug = await dbClient.insert(drugTable).values(req.body).returning();
    res.status(201).json(newDrug);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add stock" });
  }
});

// 5. Edit data for a drug
// {
//   "drug_id": "32e420b5-ddbd-49ef-ade7-2a6a9c0aba41",
//   "drugData": {
//     "name": "Updated Paracetamol",
//     "detail": "Updated pain reliever details",
//     "unit_price": 15.0
//   }
// }
app.patch("/update", async (req, res, next) => {
  try {
    const { drug_id, drugData} = req.body;
    if (!drug_id) throw new Error("Drug ID is required");
    const drugExists = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, drug_id),
    });
    if (!drugExists) throw new Error("Invalid Drug ID");

    // อัปเดตข้อมูลใน drugTable หากมี drugData
    if (drugData) {
      await dbClient
        .update(drugTable)
        .set(drugData)
        .where(eq(drugTable.drug_id, drug_id));
    }

    res.json({
      msg: "Update successful",
      drug_id,
    });
  } catch (err) {
    next(err);
  }
});

// 6. add stock for a drug
app.post("/stocks", async (req, res) => {
  try {
    const newStock = await dbClient.insert(stockTable).values(req.body).returning();
    res.status(201).json(newStock);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add stock" });
  }
});

// 7. Delete a drug
// {
//   "id": "uuid"
// }
app.delete("/drugs", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id");

    const results = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    // ลบข้อมูลยา
    await dbClient.delete(drugTable).where(eq(drugTable.drug_id, id));
    // ส่งข้อความยืนยันการลบกลับไป
    res.json({
      msg: "Delete successfully",
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

// 8. Update drug stock after a sale
// {
//   "drug_id": "drug_uuid",
//   "stock_id": "stock_uuid",
//   "quantity_sold": 2
// }
app.patch("/stocks/update", async (req, res, next) => {
  try {
    const { drug_id, stock_id, quantity_sold } = req.body;
    if (!drug_id || !stock_id || !quantity_sold) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const stock = await dbClient.query.stockTable.findFirst({
      where: (and(eq(stockTable.drug_id, drug_id), eq(stockTable.stock_id, stock_id))),
    });
    if (!stock) {
      res.status(404).json({ error: "Stock not found for the given drug and stock ID" });
      return;
    }
    if (stock.amount < quantity_sold) {
      res.status(400).json({ error: "Not enough stock available" });
      return;
    }
    const updatedStock = await dbClient
      .update(stockTable)
      .set({ amount: stock.amount - quantity_sold })
      .where(eq(stockTable.stock_id, stock_id))
      .returning();
    res.json({
      message: "Stock updated successfully",
      updatedStock: updatedStock[0],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 9. delete only that stock
app.delete("/stocks/:stock_id", async (req, res, next) => {
  try {
    const { stock_id } = req.params;
    if (!stock_id) {
      res.status(400).json({ error: "Missing stock ID" });
      return;
    }
    const stock = await dbClient.query.stockTable.findFirst({
      where: eq(stockTable.stock_id, stock_id),
    });
    if (!stock) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    await dbClient
      .delete(stockTable)
      .where(eq(stockTable.stock_id, stock_id));

    res.json({
      message: "Stock deleted successfully"
    });
  } catch (err) {
    console.error(err);
    next(err);
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