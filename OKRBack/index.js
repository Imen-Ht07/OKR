//importation
const express = require('express');
const app = express();
require('dotenv').config();

//Routes 
//const user = require("./routes/authRoute");
const objectif = require("./routes/objectifRoutes");
const employe  = require("./routes/employeRoutes");
const manager = require ("./routes/managerRoutes") ;
const admin = require("./routes/adminRoutes") ;
const auth = require("./routes/authRoutes");
const resultat = require("./routes/resultatRoutes");
const calendar = require ("./routes/calendarRoutes");
const team = require ("./routes/teamRoutes") ;
const actionRoutes = require('./routes/actionRoutes');
//middleware
app.use(express.json());
//aide les ports de back et front a s'adapter 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
   "Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
   res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
   return res.status(200).json({});
  }
  next();
 });
 //pour les images BFR(Backend et Frontend Relation)
app.use('/uploads', express.static('uploads'));
 //USE express
app.use(express.json());
//other use routes
app.use('/auth', auth);
app.use('/objectif', objectif);
app.use("/employee", employe);
app.use("/manager", manager);
app.use("/admin", admin);
app.use("/resultat",resultat);
app.use("/calendar",calendar);
app.use("/team",team);
app.use("/action",actionRoutes);


//appel a database.js 
require('./database');

//port d'ecoute du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 