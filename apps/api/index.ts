import express from "express";
import { prismaClient } from "db/client";
import { authMiddleware } from "./middleware";
const app = express();
app.use(express.json());
app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const url = req.url;
  const data = await prismaClient.website.create({
    data: {
      userId,
      url,
    },
  });
  res.json({
    id: data.id,
  });
});

app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId! as unknown as string;
  const userId = req.userId;
  //   difference between req.body.userUId and req.userId

  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId: userId,
      disabled: false,
    },
    include: {
      ticks: true,
    },
  });
  res.json(data);
});

app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const data = await prismaClient.website.findMany({
    where: {
      userId,
    },
  });
  res.json(data);
});
app.delete("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const websiteId = req.query.websiteId! as unknown as string;

  const data = await prismaClient.website.update({
    where: {
      id: websiteId,
      userId,
    },
    data: {
      disabled: true,
    },
  });
  res.json({
    message: "Deleted website from database",
  });
});

app.listen(3000, () => {
  console.log("running on 3000");
});
