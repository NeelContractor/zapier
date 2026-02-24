// processor index.ts
// import { prisma } from "@repo/db"
import 'dotenv/config'

import { prisma } from "@repo/db";
import { Kafka } from "kafkajs"

const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const producer = kafka.producer();
    await producer.connect();

    const shutdown = async () => {
        await producer.disconnect();
        await prisma.$disconnect();
        process.exit(0);
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown); 

    while (1) {
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {},
            take: 10
        })
        console.log(pendingRows);

        await producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => {
                return {
                    value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                }
            }) 
        })

        await prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        })

        await new Promise(r => setTimeout(r, 3000));
    }
}

main();