const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const User = require('../models/User');

// GET /api/analytics/summary -> basic analytics summary
router.get('/summary', async (req, res) => {
  try {
    const grades = await Grade.find();
    if(!grades.length) return res.json({ avgPercent: 0, topStudents: [] });
    const map = {};
    grades.forEach(g => {
      if(!map[g.student]) map[g.student] = { sum:0, count:0 };
      map[g.student].sum += (g.marks / (g.maxMarks || 100)) * 100;
      map[g.student].count += 1;
    });
    const arr = [];
    for(const sid of Object.keys(map)){
      arr.push({ student: sid, avg: map[sid].sum / map[sid].count });
    }
    arr.sort((a,b)=> b.avg - a.avg);
    const top = arr.slice(0,3);
    const topStudents = [];
    for(const t of top){
      const u = await User.findById(t.student);
      topStudents.push({ id: t.student, name: u ? u.name : 'Unknown', avg: Math.round(t.avg*100)/100 });
    }
    const overallAvg = Math.round(arr.reduce((s,a)=> s+a.avg,0)/arr.length *100)/100;
    res.json({ avgPercent: overallAvg, topStudents });
  } catch(err){
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
