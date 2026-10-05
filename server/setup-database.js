import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pool, sql } from "./db.js";
import { restSpaces } from "../src/data/restSpaces.js";
import { sampleReviews } from "../src/data/reviews.js";

async function setupDatabase() {
  const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
  await pool.connect();
  await pool.request().batch(schema);

  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    for (const space of restSpaces) {
      await new sql.Request(transaction)
        .input("id", sql.Int, space.id)
        .input("name", sql.NVarChar(200), space.name)
        .input("type", sql.NVarChar(50), space.type)
        .input("image", sql.NVarChar(1000), space.image)
        .input("accessibilityScore", sql.Int, space.accessibilityScore)
        .input("features", sql.NVarChar(sql.MAX), JSON.stringify(space.features))
        .input("distance", sql.NVarChar(50), space.distance)
        .input("rating", sql.Decimal(2, 1), space.rating)
        .input("reviewCount", sql.Int, space.reviews)
        .input("crowdLevel", sql.NVarChar(20), space.crowdLevel)
        .input("lat", sql.Float, space.lat)
        .input("lng", sql.Float, space.lng)
        .input("address", sql.NVarChar(300), space.address)
        .input("description", sql.NVarChar(sql.MAX), space.description)
        .input("openHours", sql.NVarChar(100), space.openHours)
        .input("lastUpdated", sql.Date, new Date(`${space.lastUpdated}T00:00:00.000Z`))
        .input("environmentScore", sql.Int, space.environmentScore)
        .input("noiseLevel", sql.NVarChar(30), space.noiseLevel)
        .input("surfaceType", sql.NVarChar(50), space.surfaceType)
        .input("lighting", sql.NVarChar(30), space.lighting)
        .input("nearbyFacilities", sql.NVarChar(sql.MAX), JSON.stringify(space.nearbyFacilities))
        .input("aiConfidence", sql.Int, space.aiConfidence)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM dbo.spaces WHERE id = @id)
          INSERT INTO dbo.spaces (
            id, name, type, image, accessibility_score, features, distance, rating,
            review_count, crowd_level, lat, lng, address, description, open_hours,
            last_updated, environment_score, noise_level, surface_type, lighting,
            nearby_facilities, ai_confidence
          )
          VALUES (
            @id, @name, @type, @image, @accessibilityScore, @features, @distance, @rating,
            @reviewCount, @crowdLevel, @lat, @lng, @address, @description, @openHours,
            @lastUpdated, @environmentScore, @noiseLevel, @surfaceType, @lighting,
            @nearbyFacilities, @aiConfidence
          )
        `);
    }

    await new sql.Request(transaction).batch("SET IDENTITY_INSERT dbo.reviews ON;");
    try {
      for (const review of sampleReviews) {
        await new sql.Request(transaction)
          .input("id", sql.Int, review.id)
          .input("spaceId", sql.Int, review.spaceId)
          .input("user", sql.NVarChar(80), review.user)
          .input("avatar", sql.NVarChar(8), review.avatar)
          .input("rating", sql.Int, review.rating)
          .input("comment", sql.NVarChar(2000), review.comment)
          .input("date", sql.Date, new Date(`${review.date}T00:00:00.000Z`))
          .input("helpful", sql.Int, review.helpful)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM dbo.reviews WHERE id = @id)
            INSERT INTO dbo.reviews (id, space_id, user_name, avatar, rating, comment, review_date, helpful)
            VALUES (@id, @spaceId, @user, @avatar, @rating, @comment, @date, @helpful)
          `);
      }
    } finally {
      await new sql.Request(transaction).batch("SET IDENTITY_INSERT dbo.reviews OFF;");
    }

    await transaction.commit();
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Database setup rollback failed:", rollbackError.message);
    }
    throw error;
  }

  console.log(`Database ready: ${restSpaces.length} spaces and ${sampleReviews.length} sample reviews seeded.`);
}

try {
  await setupDatabase();
} catch (error) {
  console.error("Database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.close();
}
