const express = require("express");
const userRoutes = require("./routes/userRoutes");
const db = require('./database/models');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/api", userRoutes);

app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});
