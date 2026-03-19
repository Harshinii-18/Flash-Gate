const express = require('express')
const app = express()

//to get req.body
app.use(express.json())

app.get('/api/v1', (req, res)=>{
  res.status(200).send("Hello there")
})

//port 
const port = process.env.PORT || 4000

const start = async()=>{
  try {
    app.listen(port, ()=>{
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()