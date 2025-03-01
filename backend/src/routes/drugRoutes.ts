import express from "express";
import { dbClient } from "../../db/client";
import { drugTable, stockTable } from "../../db/schema";
import { eq, like } from "drizzle-orm";

const router = express.Router();

// Get all drugs
router.get("/", async (req, res, next) => {
  try {
    const drugsWithStock = await dbClient.query.drugTable.findMany({
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            expired: true,
          }, 
        },
      },
    });
    res.json({
      data: drugsWithStock,
    });
  } catch (err) {
    next(err);
  }
});

// Get a single drug by name
router.get("/search", async (req, res, next) => {
  try {
    const drugName = req.query.name; 
    if (!drugName) {
      res.status(400).json({ msg: "กรุณาระบุชื่อยา" });
      return;
    }

    const drugsWithStock = await dbClient.query.drugTable.findMany({
      where: (drugs, { like }) => like(drugs.name, `%${drugName}%`),
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            expired: true,
          }, 
        },
      },
    });

    res.json({
        msg: `ค้นหา "${drugName}" สำเร็จ`,
      data: drugsWithStock
    });
  } catch (err) {
    next(err);
  }
});

// Get a single drug by ID
router.get("/:id", async (req, res, next) => {
  try {
    const drugId = req.params.id;
    if (!drugId) {
      res.status(400).json({ msg: "กรุณาระบุ Drug ID" });
      return;
    }

    const drugWithStock = await dbClient.query.drugTable.findFirst({
      where: (drugs, { eq }) => eq(drugs.drug_id, drugId), 
      with: {
        stock: {
          columns: {
            stock_id: true,
            unit_price: true,
            amount: true,
            expired: true,
          }, 
        },
      },
    });

    if (!drugWithStock) {
      res.status(404).json({ msg: `ไม่มียานี้ในคลัง` });
      return;
    }

    res.json({
      msg: `ค้นหา ID ${drugId} สำเร็จ`,
      data: drugWithStock,
    });
  } catch (err) {
    next(err);
  }
});

// Add a new drug
router.post("/", async (req, res, next) => {
  const {
    name,
    code,
    drug_type,
    unit_type,
    detail,
    usage,
    slang_food,
    side_effect,
    stock,
  } = req.body;
  try {

    const [newDrug] = await dbClient
      .insert(drugTable)
      .values({name, code, detail, usage, slang_food, side_effect, drug_type, unit_type})
      .returning();

    if (!newDrug) {
      throw new Error("ใส่ข้อมูลยาลงคลังล้มเหลว");
    }

    await dbClient.insert(stockTable).values({
      drug_id: newDrug.drug_id, // ใช้ drug_id จาก newDrug
      unit_price: stock.unit_price,
      amount: stock.amount,
      expired: stock.expired,
    });

    res.status(201).json({
      message: "เพิ่มยาลงในคลังสำเร็จ",
      drug: newDrug,
    });


  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "ไม่สามารถเพิ่มลงคลังได้" });
  }
});

// Edit data for a drug
router.patch("/update", async (req, res, next) => {
  try {
    const { drug_id, drugData} = req.body;
    if (!drug_id) throw new Error("ต้องระบุ Drug ID");
    const drugExists = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, drug_id),
    });
    if (!drugExists) throw new Error("Invalid Drug ID");

    if (drugData) {
      await dbClient
        .update(drugTable)
        .set(drugData)
        .where(eq(drugTable.drug_id, drug_id));
    }

    res.json({
      msg: "เปลี่ยนแปลงข้อมูลสำเร็จ",
      drug_id,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a drug
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params ;
    if (!id) throw new Error("กรุณาระบุ ID ยา");

    const results = await dbClient.query.drugTable.findMany({
      where: eq(drugTable.drug_id, id),
    });

    if (results.length === 0) {
      res.status(404).json({ msg: "ไม่พบข้อมูลของยานี้" });
      return;
    }
    await dbClient.delete(drugTable).where(eq(drugTable.drug_id, id));

    res.json({
      msg: "ลบข้อมูลยาสำเร็จ",
      data: { id },
    });
  } catch (err) {
    next(err);
  }
}); 

router.post("/get-id", async (req, res, next) => {
    try {
      const { drug_name, unit_type } = req.body; 
  
      if (!drug_name || !unit_type) {
        res.status(400).json({ msg: "กรุณาระบุชื่อยาและหน่วยของยา" });
      }
  
      const drug = await dbClient.query.drugTable.findFirst({
        where: (drugs, { and, eq, like }) =>
          and(like(drugs.name, `%${drug_name}%`), eq(drugs.unit_type, unit_type)),
        columns: {
          drug_id: true,
        },
      });
  
      if (!drug) {
        res.status(404).json({ msg: "ไม่พบข้อมูลยา" });
      }
  
      res.json({
        drug_id: drug?.drug_id, 
      });
    } catch (err) {
      next(err);
    }
  });

export default router;