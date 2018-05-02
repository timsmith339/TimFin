var express = require('express');
var app = express();
var port=Number(process.env.PORT || 3000);

app.use('/', express.static(`${__dirname}/`));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
