import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors";
import { triggerRouter } from "./router/trigger";
import { actionRouter } from "./router/action";

const PORT = 3004;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"]
}))

app.get("/", (req, res) => {
    res.json({
        "message": `Primary Backend service running on http://localhost:${PORT}`
    })
});

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.listen(PORT, () => {
    console.log(`Primary Backend service running on http://localhost:${PORT}`);
});