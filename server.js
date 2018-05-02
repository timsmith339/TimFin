const express = require('express');
const app = express();
const PORT = 8080;

app.use('/', express.static(`${__dirname}/`));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});