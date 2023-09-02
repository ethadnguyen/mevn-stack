const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// mongodb+srv://ethad:<password>@cluster0.yivlzdc.mongodb.net/?retryWrites=true&w=majority

mongoose.connect(
    "mongodb+srv://ethad:Nguyen.2003@cluster0.yivlzdc.mongodb.net/?retryWrites=true&w=majority"
).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


app.get('/', (req, res) => {
    res.send('Hello')
});

app.use("/auth", require("./routes/auth.route"));
app.listen(5000, () => {
    console.log(`Server started!`);
});
