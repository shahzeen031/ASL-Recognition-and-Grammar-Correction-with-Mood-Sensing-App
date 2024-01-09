const express = require('express');
const router = express.Router();
const runCompletion = require('../chatgpt')

//@route Post api/Facelandmark
//desc post route
//@access Public
router.get('/:query', async (req, res) => {
    try {

      
        let query = req.params.query
        console.log('hello',query)
        let response = await runCompletion(query)
    
    


    
            res.json(response)
        


    } catch (error) {
        console.log(error)
        console.error('Error indexing face:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;