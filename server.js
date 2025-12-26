const express = require ('express');
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended:true})); // Fix for handling URL-encoded data

require('dotenv').config();


const db = require('./db');


const PORT = process.env.PORT || 3000;



app.get('/', (req,res)=>{
     res.send("Hello, REST API")
});

//1 .get all products by REST API
//Endpoint: GET /api/products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//2 .Get product by id
//Endpoint: GET /api/products/id
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT * FROM products WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: 'Product not found' });

      res.json(results[0]);
    }
  );
});


//3: create a new product
//endpoint: POST  /api/products
app.post('/api/products', (req, res) => {
  const { name, price, quantity } = req.body;

  db.query(
    'INSERT INTO products (name, price, quantity ) VALUES (?, ?, ?)',
    [name, price, quantity],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: result.insertId,
        name,
        price,
        quantity
      });
    }
  );
});


//update a product by ID
//endpoint: PUT /api/products/id
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, quantity } = req.body;

  db.query(
    'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
    [name, price, quantity, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Product not found' });

      res.json({ id, name, price });
    }
  );
});


//5: delete product by id
// endpoint: DELETE /api/products/id
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'DELETE FROM products WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'Product not found' });

      res.json({ message: 'Product deleted successfully' });
    }
  );
});



app.listen(PORT, ()=> {
     console.log(`Server running on PORT ${PORT} at http://localhost:${PORT}/ `);
});
