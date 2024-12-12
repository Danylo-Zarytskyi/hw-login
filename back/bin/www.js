import mongoose from 'mongoose';
import httpServ from './../http/server.js';
import bcrypt from 'bcrypt';
import User from '../models/Users.js'

// BD
{
    mongoose.connection.on('open', () => {
        console.log(`\x1b[42m\x1b[30m DB conected \x1b[0m`);
    });

    const dbname = 'hwLogin';
    await mongoose.connect(`mongodb://127.0.0.1:27017/${dbname}`);

    // const hashedPassword = await bcrypt.hash('admin');

    // const existingUser = await User.findOne({ login: 'admin' });
    // const user = new User({
    //     login: 'admin',
    //     password: hashedPassword,
    // })
    // await user.save();
}

// Http
{
    const port = 4000;
    httpServ.listen(port, () => {
        console.log(`\x1b[42m\x1b[30m Http listening on port ${port} \x1b[0m`)
    })
}

