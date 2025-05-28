const express = require('express')
const app = express()
const port = 3000
const session = require("express-session");

const sessionOptions = {
    secret: "mySuperSecretcode",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/test", (req, res) =>{
    res.send("Test SuccessFull!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})