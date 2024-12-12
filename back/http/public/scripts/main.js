const getTokens = async (login, pwd) => {
    const { data } = await axios.post('/auth/strategy/local/login', { login: 'admin', pwd: 'admin' });

    if(data.status !== 'ok') {
        return false;
    }
    // const { tokens } = data.payload.tokens;
    return data.payload.tokens;
}

const run = async () => {
    const result = await getTokens('admin', 'admin');
    if(!result) {
        //
    }
    const { accessT, refreshT } = result;
    
    {  
        const { data } = await axios.post('/profile', { accessT });
        console.log('Profile data: ', data);
    }

    //refresh access t
    {
        const { data } = await axios.post('/auth/replaceTokens', { accessT, refreshT });
        console.log('ReplaceTokens data: ', data)

        //test
        const newTokens = data.payload;

        await axios.post('/profile', { accessT: newTokens.accessT });
        console.log('New profile data: ', data);
    }
    
}
run();