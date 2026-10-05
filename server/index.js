import "dotenv/config";
import express from "express";
import { pool, sql } from "./db.js";

const app = express();
const port = Number(process.env.API_PORT || 3001);

app.use(express.json({ limit: "32kb" }));

const spaceSelect = `
  SELECT id, name, type, image, accessibility_score AS [accessibilityScore],
         features, distance, rating, review_count AS reviews,
         crowd_level AS [crowdLevel], lat, lng, address, description,
         open_hours AS [openHours], CONVERT(varchar(10), last_updated, 23) AS [lastUpdated],
         environment_score AS [environmentScore], noise_level AS [noiseLevel],
         surface_type AS [surfaceType], lighting, nearby_facilities AS [nearbyFacilities],
         ai_confidence AS [aiConfidence]
  FROM dbo.spaces
`;

const reviewSelect = `
  SELECT id, space_id AS [spaceId], user_name AS [user], avatar, rating, comment,
         CONVERT(varchar(10), review_date, 23) AS [date], helpful
  FROM dbo.reviews
`;

function parseSpace(row) {
  return {
    ...row,
    features: JSON.parse(row.features),
    nearbyFacilities: JSON.parse(row.nearbyFacilities),
  };
}

app.get("/api/health", async (_request, response) => {
  await pool.request().query("SELECT 1");
  response.json({ status: "ok" });
});

app.get("/api/spaces", async (_request, response) => {
  const { recordset } = await pool.request().query(`${spaceSelect} ORDER BY id`);
  response.json(recordset.map(parseSpace));
});

app.get("/api/spaces/:id", async (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return response.status(400).json({ error: "Space id must be a positive integer." });
  }

  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`${spaceSelect} WHERE id = @id`);
  if (result.recordset.length === 0) {
    return response.status(404).json({ error: "Space not found." });
  }
  response.json(parseSpace(result.recordset[0]));
});

app.get("/api/reviews", async (request, response) => {
  const spaceId = request.query.spaceId === undefined ? null : Number(request.query.spaceId);
  if (spaceId !== null && (!Number.isInteger(spaceId) || spaceId < 1)) {
    return response.status(400).json({ error: "spaceId must be a positive integer." });
  }

  const query = pool.request();
  const filter = spaceId === null ? "" : (query.input("spaceId", sql.Int, spaceId), " WHERE space_id = @spaceId");
  const { recordset } = await query.query(`${reviewSelect}${filter} ORDER BY review_date DESC, id DESC`);
  response.json(recordset);
});

app.post("/api/reviews", async (request, response) => {
  const { spaceId, user, avatar, rating, comment } = request.body ?? {};
  const normalizedComment = typeof comment === "string" ? comment.trim() : "";

  if (!Number.isInteger(Number(spaceId)) || Number(spaceId) < 1) {
    return response.status(400).json({ error: "spaceId must be a positive integer." });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return response.status(400).json({ error: "rating must be an integer from 1 to 5." });
  }
  if (!normalizedComment || normalizedComment.length > 2000) {
    return response.status(400).json({ error: "comment must contain between 1 and 2000 characters." });
  }

  const parsedSpaceId = Number(spaceId);
  const userName = typeof user === "string" && user.trim() ? user.trim().slice(0, 80) : "Guest User";
  const userAvatar = typeof avatar === "string" && avatar.trim() ? avatar.trim().slice(0, 8) : "GU";
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const space = await new sql.Request(transaction)
      .input("spaceId", sql.Int, parsedSpaceId)
      .query("SELECT id FROM dbo.spaces WITH (UPDLOCK, ROWLOCK) WHERE id = @spaceId");
    if (space.recordset.length === 0) {
      await transaction.rollback();
      return response.status(404).json({ error: "Space not found." });
    }

    const inserted = await new sql.Request(transaction)
      .input("spaceId", sql.Int, parsedSpaceId)
      .input("user", sql.NVarChar(80), userName)
      .input("avatar", sql.NVarChar(8), userAvatar)
      .input("rating", sql.Int, rating)
      .input("comment", sql.NVarChar(2000), normalizedComment)
      .query(`
        INSERT INTO dbo.reviews (space_id, user_name, avatar, rating, comment)
        OUTPUT inserted.id, inserted.space_id AS [spaceId], inserted.user_name AS [user],
               inserted.avatar, inserted.rating, inserted.comment,
               CONVERT(varchar(10), inserted.review_date, 23) AS [date], inserted.helpful
        VALUES (@spaceId, @user, @avatar, @rating, @comment)
      `);
    await new sql.Request(transaction)
      .input("spaceId", sql.Int, parsedSpaceId)
      .input("rating", sql.Int, rating)
      .query(`
        UPDATE dbo.spaces
        SET rating = CONVERT(decimal(2, 1),
              ROUND((rating * review_count + @rating) * 1.0 / (review_count + 1), 1)),
            review_count = review_count + 1
        WHERE id = @spaceId
      `);

    await transaction.commit();
    response.status(201).json(inserted.recordset[0]);
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Review transaction rollback failed:", rollbackError.message);
    }
    throw error;
  }
});

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  console.error("API request failed:", error);
  response.status(error.status === 400 ? 400 : 500).json({
    error: error.status === 400 ? "Invalid JSON request body." : "The request could not be completed.",
  });
});

const server = app.listen(port, async () => {
  try {
    await pool.connect();
    console.log(`Space Finder API listening on http://localhost:${port}`);
  } catch (error) {
    console.error("SQL Server connection failed:", error.message);
    server.close(() => process.exit(1));
  }
});
