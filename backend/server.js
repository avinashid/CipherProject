const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const { sendFile } = require("express/lib/response");
const cors = require("cors");
connectDB();
const app = express();
const corsOptions = {
  origin: "https://avinashid.github.io/CipherFront",
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", cors(corsOptions), require("./routes/userRoutes"));

// Serve Frontend
// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname,'../frontend/build')))
//     app.get('*',(req,res)=> res.sendFile(path.resolve(__dirname,'../','frontend','build','index.html')
//       )
//     )
// } else{
//     app.get('/',(req,res)=> res.send('Please set to production'))
// }

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
