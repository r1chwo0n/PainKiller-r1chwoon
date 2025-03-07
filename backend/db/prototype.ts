import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client";
import { drugTable, stockTable } from "@db/schema";
import { v4 as uuidv4 } from "uuid"; // UUID library

// ----------- Insert Drugs and Stocks Together ------------
async function insertDrugsAndStocks() {
  const now = new Date(); // Current timestamp for `created_at` and `updated_at`

  const formatDateForExpired = (date: Date) => date.toISOString().split("T")[0];

  const drugs = [
    {
      name: "Paracetamol",
      code: "PCM001",
      drug_type: "drug", // Added for the schema
      detail: "Pain reliever and fever reducer",
      usage: "Take one tablet every 6 hours",
      slang_food: "Avoid alcohol",
      side_effect: "Drowsiness, nausea",
      unit_type: "Tablet", // Added for the schema
      unit_price: 10.5,
      stockAmount: 5, // Example stock amount
      expired: new Date("2025-12-31"), // Stock expiry date
    },
    {
      name: "Amoxicillin",
      code: "AMX002",
      drug_type: "herb",
      detail: "Antibiotic for bacterial infections",
      usage: "Take one capsule every 8 hours",
      slang_food: "Avoid dairy products",
      side_effect: "Stomach upset, diarrhea",
      unit_type: "Capsule",
      unit_price: 15.0,
      stockAmount: 100,
      expired: new Date("2025-01-31"),
    },
    {
      name: "Ibuprofen",
      code: "IBP003",
      drug_type: "herb",
      detail: "Nonsteroidal anti-inflammatory drug",
      usage: "Take one tablet every 6 hours with food",
      slang_food: "Avoid alcohol",
      side_effect: "Stomach pain, dizziness",
      unit_type: "Tablet",
      unit_price: 8.0,
      stockAmount: 75,
      expired: new Date("2025-11-30"),
    },
    {
      name: "Cetirizine",
      code: "CET004",
      drug_type: "drug",
      detail: "Antihistamine for allergy relief",
      usage: "Take one tablet daily",
      slang_food: "Avoid alcohol",
      side_effect: "Drowsiness, dry mouth",
      unit_type: "Tablet",
      unit_price: 12.0,
      stockAmount: 30,
      expired: new Date("2025-10-20"),
    },
    {
      name: "Metformin",
      code: "MET005",
      drug_type: "drug",
      detail: "Medication for diabetes management",
      usage: "Take one tablet with meals twice daily",
      slang_food: "Avoid sugary foods",
      side_effect: "Nausea, stomach upset",
      unit_type: "Tablet",
      unit_price: 20.0,
      stockAmount: 150,
      expired: new Date("2026-03-01"),
    },
  ];

  for (const drug of drugs) {
    // Generate a UUID for the drug
    const drugId = uuidv4();

    // Insert into drugTable
    await dbClient.insert(drugTable).values({
      drug_id: drugId,
      name: drug.name,
      code: drug.code,
      drug_type: drug.drug_type, // Added
      detail: drug.detail,
      usage: drug.usage,
      slang_food: drug.slang_food,
      side_effect: drug.side_effect,
      unit_type: drug.unit_type, // Added
      created_at: now,
      updated_at: now,
    });

    // Insert into stockTable using the same drug_id
    await dbClient.insert(stockTable).values({
      stock_id: uuidv4(), // Generate unique stock ID
      drug_id: drugId, // Reuse drugId for foreign key
      unit_price: drug.unit_price, // Corrected placement
      amount: drug.stockAmount,
      expired: formatDateForExpired(drug.expired),
      created_at: now,
      updated_at: now,
    });

    console.log(`Inserted drug and stock for: ${drug.name}`);
  }

  console.log("All drugs and stocks inserted.");
  dbConn.end();
}

// ----------- Execute Example Insertions ------------
(async function main() {
  try {
    await insertDrugsAndStocks();
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    dbConn.end();
  }
})();
