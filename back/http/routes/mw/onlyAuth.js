import createError from 'http-errors';
import * as authCtrl from './../../../ctrls/auth.js';

const mw = (req, res, next) => {
    if(!req.body.accessT) {
        next(createError(401));
        return;
    }

    const result = authCtrl.verifyAccessT(req.body.accessT);
    if(result !== 'ok') {
        next(createError(403));
        return;
    }

    const payload = authCtrl.getPayloadAccessT(req.body.accessT);
    res.locals.uid = payload.iss;

    next();
}

export default mw;