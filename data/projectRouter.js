const express = require('express');
const Project = require('./helpers/projectModel');
const Action = require('./helpers/actionModel');

const router = express.Router();



//get all projects
router.get('/', (req, res) => {
    Project.get()
    .then(projects => res.status(200).json(projects))
    .catch(error => {
        console.log(error)
        res.status(500).json({error: 'Projects could not be retrieved'})
    })
})

module.exports = router;