const express=require('express')
const cors=require('cors')
const { MongoClient }=require('mongodb')
const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken")
const {expressjwt:exjwt}=require("express-jwt")
const jwt_decode=require("jwt-decode")

const app=new express()
app.use(express.json())
app.use(cors())

const secretkey="abcd"
const algorithm="HS256"

const jwtmw=exjwt({
    secret: secretkey,
    algorithms:[algorithm],
})

const client=new MongoClient('mongodb+srv://admin:admin@karthik.llfrpnw.mongodb.net/?retryWrites=true&w=majority')
client.connect()
const db=client.db('s31')
const col=db.collection('register')
const col1=db.collection('Dogs')
const col2=db.collection('Cats')
const col3=db.collection('Fishes')
const col4=db.collection('Birds')

app.post('/insert',async (req,res) => {
    console.log(req.body)
    var reg={...req.body}
    reg.password=await bcrypt.hash(reg.password,5)
    col.insertOne(reg)
    res.send("Recieved Data !")
})

app.get('/home',(req,res) => {
    res.send("Home")
})

app.post('/check',async (req,res)=>{
    console.log(req.body)
    var result=await col.findOne({"name":req.body.un})
    if(result==null){
        res.send({
            message:"Username not Matched !",
            token:null
        })
    }else if(await bcrypt.compare(req.body.pw,result.password)){
        var token=jwt.sign(result,secretkey,{
            algorithm:algorithm,
            expiresIn:"30m",
        })
        res.send({
            message:result,
            token:token
        })
    }else{
        res.send({
            message:"Incorrect Password !",
            token:null
        })
    }
})

app.get('/Dogs', jwtmw, async (req,res) => {
    console.log(req.headers)
    console.log(jwt_decode.jwtDecode(req.headers.authorization.substring(7)))
    var result=await col1.find().toArray()
    res.send(result)
})

app.get('/Cats', jwtmw, async (req,res) => {
    console.log(req.headers)
    console.log(jwt_decode.jwtDecode(req.headers.authorization.substring(7)))
    var result=await col2.find().toArray()
    res.send(result)
})

app.get('/Fishes', jwtmw, async (req,res) => {
    console.log(req.headers)
    console.log(jwt_decode.jwtDecode(req.headers.authorization.substring(7)))
    var result=await col3.find().toArray()
    res.send(result)
})

app.get('/Birds', jwtmw, async (req,res) => {
    console.log(req.headers)
    console.log(jwt_decode.jwtDecode(req.headers.authorization.substring(7)))
    var result=await col4.find().toArray()
    res.send(result)
})

app.delete('/deletedog',async(req,res)=>{
    console.log(req.query.Name)
    await col1.deleteOne({Name:req.query.Name})
    res.send("Deleted Sucessfully!")
})

app.delete('/deletecat',async(req,res)=>{
    console.log(req.query.Name)
    await col2.deleteOne({Name:req.query.Name})
    res.send("Deleted Sucessfully!")
})

app.delete('/deletefish',async(req,res)=>{
    console.log(req.query.Name)
    await col3.deleteOne({Name:req.query.Name})
    res.send("Deleted Sucessfully!")
})

app.delete('/deleteBird',async(req,res)=>{
    console.log(req.query.Name)
    await col4.deleteOne({Name:req.query.Name})
    res.send("Deleted Sucessfully!")
})

app.post('/Form', async (req, res) => {
    try {
        const petData = req.body;
        const petType = petData.Type;

        switch (petType) {
            case 'Dog':
                await col1.insertOne(petData);
                break;
            case 'Cat':
                await col2.insertOne(petData);
                break;
            case 'Fish':
                await col3.insertOne(petData);
                break;
            case 'Bird':
                await col4.insertOne(petData);
                break;
            default:
                return res.status(400).json({ message: 'Invalid pet type' });
        }

        res.status(200).json({ message: 'Pet data inserted successfully' });
    } catch (error) {
        console.error('Error inserting pet data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})



app.listen(8081)
console.log("Server Running !")