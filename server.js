const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bookRoutes = require('./routes/book.routes');
const userRoutes = require('./routes/user.routes');

app.use(bodyParser.json());

// Routes
app.use('/api', bookRoutes);
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
