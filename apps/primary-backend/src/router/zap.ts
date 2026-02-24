// /primary-backend/src/router/zap.ts
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prisma } from "@repo/db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id: string = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }   

    const zapId = await prisma.$transaction(async tx => {
        const zap = await prisma.zap.create({
            data: {
                userId: parseInt(id),
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata
                    }))
                }
            }
        })

        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            }
        });

        await tx.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        })

        return zap.id;

    })
    return res.json({
        zapId
    })
})

router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    //@ts-ignore
    const userId = Number(req.id);

    // const zapId = req.params.zapId;
    const zapId = Array.isArray(req.params.zapId)
        ? req.params.zapId[0]
        : req.params.zapId;

    if (!zapId || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid request" });
    }

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })
})

router.delete("/:zapId", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = Number(req.id);
    const zapId = Array.isArray(req.params.zapId)
        ? req.params.zapId[0]
        : req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: { id: zapId, userId }
    });

    if (!zap) {
        return res.status(404).json({ message: "Zap not found" });
    }

    await prisma.$transaction(async tx => {
        // Delete run outbox entries first
        await tx.zapRunOutbox.deleteMany({
            where: { zapRun: { zapId } }
        });

        // Delete zap runs
        await tx.zapRun.deleteMany({
            where: { zapId }
        });

        // Delete actions and trigger
        await tx.action.deleteMany({ where: { zapId } });
        await tx.trigger.deleteMany({ where: { zapId } });

        // Finally delete the zap
        await tx.zap.delete({ where: { id: zapId } });
    });

    return res.json({ message: "Zap deleted" });
});

export const zapRouter = router;