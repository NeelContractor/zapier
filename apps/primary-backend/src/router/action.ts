import { Router } from "express";
// import { prisma } from "@repo/db"
import { prisma } from "@repo/db";

const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prisma.availableAction.findMany({});
    res.json({
        availableActions
    })
});

export const actionRouter = router;