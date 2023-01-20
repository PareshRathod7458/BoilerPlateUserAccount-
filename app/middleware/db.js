const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('cloud not connect to MongoDB...', err));