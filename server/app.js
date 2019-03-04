import express from "express";

const app = express();


app.get('/', (req, res) => {
    res.send('Welcome to epic mail')
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server has started");
});
