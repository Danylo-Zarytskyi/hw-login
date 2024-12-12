import fs from 'fs/promises';
import path from 'path';
import jws from 'jws';
import { nanoid } from 'nanoid';

const alg = 'RS512';
const lifedur = 5 * 60 * 1000;

const reftokns = [

]

const rootdir = process.cwd();

const priv = await fs.readFile(path.join(rootdir, 'keys/priv.key'), 'utf-8');
const pub = await fs.readFile(path.join(rootdir, 'keys/pub.key'), 'utf-8');

const createAccessT = (payload) => { 
    if(!payload.exp) {
        payload.exp = Date.now() + lifedur;
    };

    const jti = nanoid();
    payload.jti = jti;

    const token = jws.sign({
        header: { alg: alg },
        payload,
        secret: priv
    });
    return { token, jti };
}

const createRefreshT = (jti, param) => {  
    const token = nanoid();
    reftokns.push({ 
        jti,
        token,
        param
    })
    return token;
}

const createTokens = (payload) => {
    
    const { token: accessT, jti } = createAccessT(payload);
    const params = {};

    
    if(payload.iss) {
        params.iss = payload.iss;
    }
    const refreshT = createRefreshT(jti, params);

    return { accessT, refreshT };
}

const replaceTokens = (accessT, refreshT) => {
    const payload = getPayloadAccessT(accessT);
    const { jti } = payload;

    const idx = reftokns.findIndex((item) => (item.jti === jti && item.token === refreshT));
    if(idx === -1) return false; 

    delete(reftokns[idx]); 
    delete(payload.exp); 

    const tokens = createTokens(payload);
    return tokens;
}

const withdrawByIss = (iss) => {
    reftokns.forEach((item, idx) => {
        if(item.params.iss !== iss) {
            return;
        }
        delete(reftokns(idx));
    })
}

const createTokenForUid = (uid) => {
    return createTokens({ iss: uid });
}

const removeRefreshT = (refreshT) => {
    reftokns.forEach((item, idx) => {
        if(item.params.token !== refreshT) {
            return;
        }

        delete(reftokns[idx]);
    })
}
const getPayloadAccessT = (accessT) => {
    const result = jws.decode(accessT);
    const payload = JSON.parse(result.payload);
    return payload;
}

const verifySign = (accessT) => {
    return jws.verify(accessT, alg, pub);
}

const verifyAccessT = (accessT) => {
    const result = jws.verify(accessT, alg, pub);
    if(!result) {
        return 'bad_sign';
    }

    const { exp } = getPayloadAccessT(accessT);
    

    if(exp < Date.now()) {
        return 'bad_exp';
    }

    return 'ok';
}

export { 
    createTokens, 
    replaceTokens, 
    withdrawByIss, 
    createTokenForUid, 
    removeRefreshT, 
    verifyAccessT,
    verifySign,
    getPayloadAccessT
 }