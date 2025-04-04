import { Router } from 'express'

const router = Router();

router.get('/register', (req, res) => {    
    res.render('home.handlebars')
})

export default router;
