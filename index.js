import express from "express";
import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3001;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = process.env.yourUsername
const yourPassword = process.env.yourPassword
const yourAPIKey = process.env.yourAPIKey
const yourBearerToken = process.env.yourBearerToken


app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

// No authentication
app.get("/noAuth", async (req, res) => {
  try{
    const response = await axios.get(API_URL + "random")
    const result = JSON.stringify(response.data)
    console.log(result)
    res.render("index.ejs",{content:result})
  }catch(error){
    res.send("Error:",error.message)
  }
});

// Basic authentication (requires username and password)
app.get("/basicAuth",async (req,res)=>{
  try{
    const response = await axios.get(API_URL + "all?page=2",{
      auth:{
        username:yourUsername,
        password:yourPassword,
      }
    });
    res.render("index.ejs",{content:JSON.stringify(response.data)})
  }
  catch(error){
    res.send("Error:",error.message)
  }
});

// API key authentication
app.get("/apiKey", async (req,res)=>{
  try{
    const response = await axios.get(API_URL + "filter",{
      params:{
        score:5,
        apiKey:yourAPIKey,
      }
    });
    const result = JSON.stringify(response.data)
    res.render("index.ejs",{content:result})
  }
  catch(error){
    res.send("Error:",error.message)
  }
});

// Token based authentication
const configs = {
  headers : {Authorization: `Bearer ${yourBearerToken}`}
}
app.get("/bearerToken",async (req,res)=>{
  try{
    const response = await axios.get(API_URL + "secrets/2",configs)
    const result = JSON.stringify(response.data)
    res.render("index.ejs",{content:result})
  }
  catch(error){
    console.log(error)
    res.send("Error:",error.message)
  }});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
