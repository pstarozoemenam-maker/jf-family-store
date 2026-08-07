const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const clientDistPath = path.join(__dirname, "dist");
app.use(express.static(clientDistPath));

// Database
const db = new sqlite3.Database(path.join(__dirname, "store.db"));

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            payment TEXT,
            total REAL,
            items TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

// ================= PRODUCTS =================

const products = [

    {
        id:1,
        name:"ChefPro Studio Oven",
        category:"Kitchen",
        price:145000,
        icon:"🍳",
        description:"Fast, elegant multi-function oven."
    },

    {
        id:2,
        name:"Aura Smart Fridge",
        category:"Electrical",
        price:320000,
        icon:"🧊",
        description:"Energy-saving smart fridge."
    },

    {
        id:3,
        name:"Glow LED Lighting Kit",
        category:"Lifestyle",
        price:48000,
        icon:"💡",
        description:"Modern ambient lighting."
    },

    {
        id:4,
        name:"Nova Blender Pro",
        category:"Kitchen",
        price:76000,
        icon:"🥤",
        description:"Powerful kitchen blender."
    },

    {
        id:5,
        name:"Luma Washing Machine",
        category:"Electrical",
        price:280000,
        icon:"🧺",
        description:"Quiet washing machine."
    },

    {
        id:6,
        name:"PureAir Air Purifier",
        category:"Lifestyle",
        price:94000,
        icon:"🌬️",
        description:"Cleaner indoor air."
    }

];

app.get("/api/products",(req,res)=>{

    res.json(products);

});

// ================= SIGNUP =================

app.post("/api/signup",(req,res)=>{

    const {name,email,password}=req.body;

    db.run(

        "INSERT INTO users(name,email,password) VALUES(?,?,?)",

        [name,email,password],

        function(err){

            if(err){

                return res.json({

                    success:false,

                    message:"Email already exists"

                });

            }

            res.json({

                success:true

            });

        }

    );

});

// ================= LOGIN =================

app.post("/api/login",(req,res)=>{

    const {email,password}=req.body;

    db.get(

        "SELECT id,name,email FROM users WHERE email=? AND password=?",

        [email,password],

        (err,row)=>{

            if(err || !row){

                return res.json({

                    success:false,

                    message:"Invalid email or password"

                });

            }

            res.json({

                success:true,

                user:row

            });

        }

    );

});

// ================= ORDERS =================

app.post("/api/orders",(req,res)=>{

    const {

        customerName,

        email,

        phone,

        address,

        payment,

        total,

        items

    }=req.body;

    db.run(

        `INSERT INTO orders
        (customer_name,email,phone,address,payment,total,items)
        VALUES(?,?,?,?,?,?,?)`,

        [

            customerName,

            email,

            phone,

            address,

            payment,

            total,

            JSON.stringify(items)

        ],

        function(err){

            if(err){

                return res.json({

                    success:false

                });

            }

            res.json({

                success:true,

                orderId:this.lastID

            });

        }

    );

});

// ================= GET ORDERS =================

app.get("/api/orders",(req,res)=>{

    db.all(

        "SELECT * FROM orders ORDER BY id DESC",

        [],

        (err,rows)=>{

            if(err){

                return res.json([]);

            }

            res.json(rows);

        }

    );

});

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
});

// ================= START SERVER =================

app.listen(PORT,()=>{

    console.log(`Server running at http://localhost:${PORT}`);

});
