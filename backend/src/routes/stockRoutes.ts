import express from "express";
import { dbClient } from "../../db/client";
import { drugTable, stockTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";

const router = express.Router();

// Get stocks
router.get("/", async (req, res) => {
    try {
      const drugsWithStock = await dbClient.query.drugTable.findMany({
        with: {
          stock: true, 
        },
      });
  
      const result = drugsWithStock.map((drug) => ({
        drug_id: drug.drug_id,
        name: drug.name,
        drug_type: drug.drug_type,
        unit_type: drug.unit_type,
        stock: drug.stock.map((stockItem) => ({
          stock_id: stockItem.stock_id,
          amount: stockItem.amount,
          expired: stockItem.expired,
        })),
      }));
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching drug and stock data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// add stock for a drug
router.post("/stocks", async (req, res, next) => {
  try {
    const { name, unit_type, unit_price, amount, expired } = req.body;

    if (
      !name ||
      !unit_type ||
      unit_price === undefined ||
      !amount ||
      !expired
    ) {
      res.status(400).json({
        msg: "Missing required fields: 'name', 'unit_type', 'unit_price', 'amount', or 'expired'",
      });
    }

    const drug = await dbClient.query.drugTable.findFirst({
      where: (drugs, { and, eq, like }) =>
        and(like(drugs.name, `%${name}%`), eq(drugs.unit_type, unit_type)),
      columns: {
        drug_id: true,
      },
    });

    if (!drug) {
      res.status(404).json({ msg: "Drug not found" });
      return;
    }

    const newStock = await dbClient
      .insert(stockTable)
      .values({
        drug_id: drug.drug_id,
        unit_price,
        amount,
        expired,
      })
      .returning({ stock_id: stockTable.stock_id });

    res.status(201).json({
      msg: "Stock added successfully",
      stock_id: newStock[0]?.stock_id,
    });
  } catch (err) {
    next(err);
  }
});

// Update drug stock after a sale
router.patch("/update", async (req, res, next) => {
  try {
    const { drug_id, stock_id, quantity_sold } = req.body;
    if (!drug_id || !stock_id || !quantity_sold) {
      res.status(400).json({ error: "กรุณาระบุข้อมูลให้ครบถ้วน" });
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
      res.status(400).json({ error: "จำนวนยาในคลังไม่เพียงพอ" });
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

// delete only that stock
router.delete("/:stock_id", async (req, res, next) => {
  try {
    const { stock_id } = req.params;
    if (!stock_id) {
      res.status(400).json({ error: "กรุณาระบุ stock ID " });
      return;
    }
    const stock = await dbClient.query.stockTable.findFirst({
      where: eq(stockTable.stock_id, stock_id),
    });
    if (!stock) {
      res.status(404).json({ error: "ไม่พบในคลัง" });
      return;
    }
    await dbClient
      .delete(stockTable)
      .where(eq(stockTable.stock_id, stock_id));

    res.json({
      message: "ลบสำเร็จ"
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;