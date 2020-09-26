import * as express from "express";

export const router = express.Router();

router.get("/method/:name", (req, res) => {
    res.status(200).send({method: req.params.name});
});

router.use("/", (req, res) => {
    res.status(200).send({hello: "world"});
});
