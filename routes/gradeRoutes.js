const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');

// Create grade
router.post('/', async (req, res) => {
  try {
    const { student, subject, marks, maxMarks, term, remarks } = req.body;
    if(!student || !subject || marks === undefined) return res.status(400).json({ msg: 'Missing fields' });
    const grade = await Grade.create({ student, subject, marks, maxMarks, term, remarks });
    res.status(201).json(grade);
  } catch(err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find().populate('student', 'name email role');
    res.json(grades);
  } catch(err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
