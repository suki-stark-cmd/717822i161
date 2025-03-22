const express = require("express");
const fetchNumbers = require("../services/fetchNumbers");
const SlidingWindow = require("../utils/windowManager");

const router = express.Router();
const windowSize = 10;
const windowManager = new SlidingWindow(windowSize);

router.get("/numbers/:numberid", async (req, res) => {
    const { numberid } = req.params;

    if (!["p", "f", "e", "r"].includes(numberid)) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    const previousState = windowManager.getWindowState();
    const newNumbers = await fetchNumbers(numberid);

    if (newNumbers) {
        windowManager.addNumbers(newNumbers);
    }

    const currentState = windowManager.getWindowState();
    const average = windowManager.getAverage();

    res.json({
        windowPrevState: previousState,
        windowCurrState: currentState,
        numbers: newNumbers || [],
        avg: average
    });
});

module.exports = router;
