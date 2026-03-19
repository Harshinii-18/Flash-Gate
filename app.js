const express = require('express')
const app = express()

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