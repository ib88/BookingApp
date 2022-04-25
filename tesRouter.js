const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
        res.send('hello my friend');
  });

  module.exports = router;