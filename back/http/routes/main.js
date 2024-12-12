import { Router } from 'express';
import User from '../../models/Users.js';
import onlyAuthMw from './mw/onlyAuth.js'; 
import bcrypt from 'bcrypt';


const router = Router();


router.get('/', (req, res) => {
    res.render('main');
});
router.post('/profile', onlyAuthMw, (req, res) => {
    const { uid } = res.locals;
    res.json({ status: 'ok', payload: { uid }});
})
router.post('/', async (req, res) => {
    console.log('Запит на / прийшов:', req.body);
    const { login, password } = req.body;

    
        console.log('Логін:', login);
        console.log('Пароль:', password);
        

        const user = await User.findOne({ login });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Unknown_user' });
        }

        console.log('Знайдений користувач:', user);


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Wrong_password' });
        }

        res.json({ success: true, message: 'Success' });
    
});





export default router;