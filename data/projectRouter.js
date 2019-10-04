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

//post
router.post('/', validateProject, (req, res) => {
    const project = req.body;
    Project.insert(project)
    .then(project => res.status(201).json(project))
    .catch(error => {
        res.status(500).json({error: 'Project could not be added'})
    })
})

//get project by id if it exists
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Project.get(id)
    .then(project => {
        if(project) {
            res.status(200).json(project)
        } else {
            res.status(404).json({error: 'A project with the provided ID does not exist'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: 'Project could not be retrieved'})
    })
})

//put update specific project if it exists
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const completed = req.body.completed;
    
    if(!name && !description) {
        return res.status(400).json({error: 'Please provide a name and a description'})
    }
    if (name && (typeof name !== 'string')) {
        return res.status(400).json({ error: "Name must be provided as a string." })
    }
    if (description && (typeof description !== 'string')) {
        return res.status(400).json({ error: "Description must be provided as a string." })
    }
    Project.update(id, { name, description, completed })
    .then(updated => {
        if (updated) {
            Project.get(id)
    .then(project => {
            //console.log(project);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: "A project with that id does not exist." });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error retrieving the project from the database." });
    })
        } else {
            res.status(404).json({ message: "A project with that id does not exist." });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while updating the project to the database." });
    });
})

//delete
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Project.remove(id)
    .then(removed => {
        if(removed) {
            res.status(200).json(id)
        } else {
            res.status(404).json({error: 'A project with that id does not exist'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: 'Project could not be deleted'})
    })
})

//get retrieves list of actions
router.get('/:project_id/actions', (req, res) => {
    const {project_id} = req.params;
    Project.get(project_id)
    .then(project => {
        if(project) {
            Project.getProjectActions(project_id)
            .then(actions => res.status(200).json(actions))
        } else {
            res.status(404).json({error: 'A project with that id does not exist'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: 'Actions could not be retrieved'})
    })
})

//post actions to a project by id. 
router.post('/:project_id/actions', validateAction, (req, res) => {
    const action = req.body;
    Action.insert(action)
    .then(action => {
        res.status(201).json(action)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: 'Action could not be added'})
    })
})

//get action with specific id and project
router.get('/:project_id/actions/:id', (req, res) => {
    const project_id = req.params.project_id;
    const id = req.params.id;
    Project.get(project_id)
    .then(project => {
        if (project) {
            Action.get(id)
            .then(action => {
                if (action) {
                    res.status(200).json(action)
                } else {
                    res.status(404).json({ error: "An action with that id does not exist." })
                }
            })
        } else {
            res.status(404).json({ error: "A project with that id does not exist." })
        }
    })  
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while retrieving the action." });
    });
})  

//put action to update by specific id
router.put('/:project_id/actions/:id', (req, res) => {
    const project_id = req.params.project_id;
    const id = req.params.id;
    const { description, notes, completed } = req.body;
    if (!notes && !description) {
        return res.status(400).json({ errorMessage: "Please provide a description and notes for the project." });
    }
    if (notes && (typeof notes !== 'string')) {
        return res.status(400).json({ error: "Notes must be provided as a string." })
    }
    if (description && (typeof description !== 'string')) {
        return res.status(400).json({ error: "Description must be provided as a string." })
    }
    if (description && (description.length >= 128)) {
        return res.status(400).json({ error: "Description must be less than 128 characters long." })
    }
    Project.get(project_id)
    .then(project => {
        if (project) {
            Action.update(id, {description, notes, completed})
            .then(action => {
                if (action){
                    res.status(200).json(action);
                } else {
                    res.status(404).json({ error: "An action with that id does not exist." })
                }
            })
        } else {
            res.status(404).json({ error: "A project with that id does not exist." });
        }
    }) 
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while retrieving the action." });
    });
})

//delete
router.delete('/:project_id/actions/:id', (req, res) => {
    const project_id = req.params.project_id;
    const id = req.params.id;
    Project.get(project_id)
    .then(project => {
        if (project) {
            Action.remove(id)
            .then(removed => {
                if (removed) {
                    res.status(200).json(id);
                } else {
                    res.status(404).json({ error: "An action with that id does not exist." })
                }
            })
        } else {
            res.status(404).json({ error: "A project with that id does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error deleting the action from the database." })
    });
})


//project middleware
function validateProject(req, res, next) {
    const id = req.params.id;
    const {name, description} = req.body;

    if(!name) {
        return res.status(400).json({error: 'Name is Required'})
    }
    if (!description) {
        return res.status(400).json({error: 'Descreption is Required'})
    }
    if (description.length >= 128) {
        return res.status(400).json({error: 'Description must be not exceed 128 characters' })
    }
    if (typeof name !== 'string') {
        return res.status(400).json({error: 'Name must be a string'})
    }
    if (typeof description !== 'string'){
        return res.status(400).json({error: 'Description must be a string'})
    }
    next();
}

//action middleware
function validateAction(req, res, next) {
    const {project_id} = req.params;
    const { description, notes } = req.body;

    if (!description) {
        return res.status(400).json({ error: "An action description is required." })
    }
    if (!notes) {
        return res.status(400).json({ error: "Action notes are required." })
    }
    if (typeof description !== 'string') {
        return res.status(400).json({ error: "Action description must be provided as a string." })
    }
    if (typeof notes !== 'string') {
        return res.status(400).json({ error: "Action notes must be provided as a string." })
    }
    req.body = {project_id, description, notes};
    next();
};

module.exports = router;