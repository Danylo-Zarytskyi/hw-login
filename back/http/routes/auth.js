import { Router } from "express";
import * as authCtrl from './../../ctrls/auth.js';
import onlyAuthMw from './mw/onlyAuth.js';

const router = Router();

const checkPwd = (login, pwd) => {
    if(login === 'admin' && pwd === 'admin') {
        return 1;
    }
}
router.post('/strategy/local/login', (req, res) => {
    
    const uid = 10;
    
    const tokens = authCtrl.createTokenForUid(uid);

    res.json({ status: 'ok', payload: { tokens} });
})
router.post('/logout', onlyAuthMw, (req, res) => {
    const { refreshT } = req.body;
    const tokens = authCtrl.removeRefreshT(refreshT);
    res.json({ status: 'ok', payload: { tokens} });
})
router.post('/replaceTokens', (req, res) => {
    const { refreshT, accessT } = req.body;

    
    const validSign = authCtrl.verifyAccessT(accessT);
    if(!validSign) {
        throw new Error('bad_token');
    }

    const newTokens = authCtrl.replaceTokens(accessT, refreshT);

    res.json({ status: 'ok', payload: { ...newTokens }});
})



export default router;