const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

console.log(__dirname + '/../public/');
console.log(publicPath);

var app = express();
const port = process.env.PORT || 3000;

// app.get('/', authenticate, (req, res) => {
//     console.log('hello world');
// });

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports={app};
