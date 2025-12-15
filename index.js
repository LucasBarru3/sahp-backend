const express = require('express');
const cors = require('cors');
require('dotenv').config();

const classesRoutes = require('./routes/classes.routes');
const vehiclesRoutes = require('./routes/vehicles.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/classes', classesRoutes);
app.use('/vehicles', vehiclesRoutes);

app.get('/', (req, res) => {
  res.send('SAHP API funcionando 🚓');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
