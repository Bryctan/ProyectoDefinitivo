let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let cookieParser = require("cookie-parser");
const session = require('express-session');
const pdf = require('html-pdf');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const timeEXp = 1000 * 60 * 60 * 24;

let app = express()
    .use(cors({ credentials: true, origin: 'http://localhost:4200' }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(session({
        secret: "jk32gkjn322m23jfwefmknwjkskl",
        saveUninitialized: true,
        cookie: { maxAge: timeEXp },
        resave: false
    }))

app.listen(10101, () => {
    console.log("Conexión establecida en el puerto 10101");
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'testenvioscorreos@gmail.com',
      pass: 'qwkwyjedfaenbykv'
    }
  });

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sena1234',
    database: 'db_proyecto'
});

conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar con la db", error);
    }

    console.log("Conexión establecida con la base de datos");
});

app.get('/generar-pdf', function (req, res) {
    let session = req.session;

    conexion.query('select imagen, nombre, precio from compras,prendas where compras.id_prenda = prendas.id_prenda and compras.correo_usuario = ?',[session.correo], (error, resultado) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error en el servidor' });
        }
        const prendas = resultado.map((atributo) => ({
          imagen: atributo.imagen,
          nombre: atributo.nombre,
          precio: atributo.precio
        }));
    
        conexion.query('select sum(precio) as preciototal from compras,prendas where compras.id_prenda = prendas.id_prenda and compras.correo_usuario = ?;',[session.correo], (error, resultado) => {
          let total;
          total = resultado[0].preciototal;
          let content = `<!DOCTYPE html>
            <html>
            <head>
              <title>Ejemplo de tabla</title>
              <style>
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                img {
                    height: 100px;
                    width: 100px;
                }
                
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
                
                th {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>
              <h1>Ejemplo de tabla</h1>
              
              <table>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre prenda</th>
                  <th>Precio</th>
                </tr>`;
    
          prendas.forEach((prenda) => {
            content += `
                    <tr>
                      <td><img src="${prenda.imagen}"></td>
                      <td>${prenda.nombre}</td>
                      <td>${prenda.precio}</td>
                    <tr>
                  
                  
                `;
          });
          content += `
            <tr>
                <td>${total}</td>
            <tr>
            </table>
            </body>
            </html>`
    
            pdf.create(content).toBuffer((err, buffer) => {
              if (err) {
                console.log(err);
              } else {
                console.log("PDF generado en memoria");
      
                const mailOptions = {
                  from: 'testenvioscorreos@gmail.com',
                  to: session.correo,
                  subject: 'Adjunto de PDF',
                  text: 'Adjunto de PDF',
                  attachments: [
                    {
                      filename: 'html-pdf.pdf',
                      content: buffer
                    }
                  ]
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Correo electrónico enviado: ' + info.response);
                  }
                });
              }
            });
          })
        });
        return res.status(200).json({"Status":"PDF enviado al correo"})
});





app.post('/register', function (req, res) {
    let nombre = req.body.nombre;
    let clave = req.body.clave;
    let correo = req.body.correo;


    conexion.query("INSERT INTO usuario (correo, nombre, clave) VALUES (?,?,?)", [correo, nombre, clave], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ "Status": "Error al registrar" });
        }

        return res.status(200).json({ "Status": "Registrado con éxito" });
    });
});


app.post('/login', function (req, res) {
    let correo = req.body.correo;
    let clave = req.body.clave;

    console.log(correo);
    console.log(clave);

    conexion.query("SELECT * FROM usuario WHERE correo = ?", [correo], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ "Status": "Error al iniciar sesión" });

        }

        console.log("longitud" + results.length);

        if (results.length === 0) {
            // console.log("MALA");
            return res.status(401).json({ "Status": "Credenciales incorrectas" });
        }

        let id = results[0].id;
        let claveAlmacenada = results[0].clave;
        let nombre = results[0].nombre;

        if (clave === claveAlmacenada) {
            let session = req.session;
            session.correo = correo;
            return res.status(200).json({ "Status": "Inicio de sesión exitoso", nombre: nombre, id: id });
        } else {
            return res.status(401).json({ "Status": "Credenciales incorrectas" });
        }
    });
});

app.get('/test-cookies', (req, res) => {

    let correo = req.session.correo;


    if (correo) {
        res.send(`Usted tiene una sesión en nuestro sistema con correo:
        ${correo}`);
    } else
        res.send('Por favor inicie sesión para acceder a esta ruta protegida')
})

app.get('/nav', (req, res) => {
    let correo = req.session.correo;

    if (correo) {



        conexion.query('SELECT nombre FROM usuario WHERE correo = ?', [correo], (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            let usuario = resultado.map((atributo) => ({
                nombre: atributo.nombre
            }))

            return res.status(200).json({ usuario: usuario });
        })
    }
})

app.get('/salir', (req, res) => {

    let session = req.session;

    if (session.correo) {

        req.session.destroy();

        return res.status(200).json({ "Status": "Cierre se sesión ok" });
    }
});


app.get("/productos", (req, res) => {

    conexion.query('SELECT * FROM prendas', (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let prendas = resultado.map((atributo) => ({
            id_prenda: atributo.id_prenda,
            nombre: atributo.nombre,
            precio: atributo.precio,
            imagen: atributo.imagen,
            descripcion: atributo.descripcion

        }))

        return res.status(200).json({ prendas: prendas });
    })
})


app.get("/prendas/:categoria", (req, res) => {

    categoria = req.params.categoria;

    conexion.query('SELECT * FROM prendas where nombre_Categoria = ? ', [categoria], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let prendas = resultado.map((atributo) => ({
            id_prenda: atributo.id_prenda,
            nombre: atributo.nombre,
            precio: atributo.precio,
            imagen: atributo.imagen,
            descripcion: atributo.descripcion

        }));

        return res.status(200).json({ prendas: prendas});
    })
})

app.get("/detalle-prenda/:id", (req, res) => {
    let session = req.session.correo;
    id = req.params.id;

    conexion.query('SELECT * FROM prendas where id_prenda = ?', [id], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let prendas = resultado.map((atributo) => ({
            id_prenda: atributo.id_prenda,
            nombre: atributo.nombre,
            precio: atributo.precio,
            imagen: atributo.imagen,
            talla: atributo.talla,
            color: atributo.color,
            descripcion: atributo.descripcion,
            estado: atributo.estado,
            nombreCategoria: atributo.nombre_Categoria,
            idCategoria: atributo.id_categoria_Prenda

        }))

        return res.status(200).json({ prendas: prendas , correo: session });
    })
})

app.post('/prendas-recomendadas', (req, res) => {
    let idCategoria = req.body.idCategoria;
    let nombreCategoria = req.body.nombreCategoria;
    let idPrenda = req.body.idPrenda;

    conexion.query('SELECT * FROM prendas where id_categoria_Prenda = ? AND nombre_Categoria = ? AND id_prenda != ?', [idCategoria, nombreCategoria, idPrenda], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let recomendadas = resultado.map((atributo) => ({
            id_prenda: atributo.id_prenda,
            nombre: atributo.nombre,
            precio: atributo.precio,
            imagen: atributo.imagen,
            talla: atributo.talla,
            color: atributo.color,
            descripcion: atributo.descripcion,
            estado: atributo.estado,
            nombreCategoria: atributo.nombre_Categoria,
            idCategoria: atributo.id_categoria_Prenda
        }))

        // console.log(prendas);

        return res.status(200).json({ recomendadas: recomendadas });
    })
})

app.get("/detalle-usuario/:id", (req, res) => {
    
    id = req.params.id;

    conexion.query('SELECT * FROM usuario where id = ?', [id], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let usuario = resultado.map((atributo) => ({
            id: atributo.id,
            name: atributo.nombre,
            email: atributo.correo
        }))

        return res.status(200).json({ usuario: usuario});
    })
})

app.get("/categoria/:categoria", (req, res) => {

    categoria = req.params.categoria;

    console.log(categoria);

    conexion.query('SELECT * FROM prendas WHERE nombre_Categoria = ? ORDER BY RAND() LIMIT 5', [categoria], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        let prendas = resultado.map((atributo) => ({
            id_prenda: atributo.id_prenda,
            nombre: atributo.nombre,
            precio: atributo.precio,
            imagen: atributo.imagen,
            descripcion: atributo.descripcion

        }));

        return res.status(200).json({ prendas: prendas });
    })
})

app.post("/categorias/:categoria", (req, res) => {

    categoria = req.params.categoria;
    filtro = req.body.filtro;
    console.log(categoria);
    console.log("a" + filtro);

    if (filtro == undefined) {

        conexion.query('SELECT * FROM prendas WHERE nombre_Categoria = ?', [categoria], (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            let prendas = resultado.map((atributo) => ({
                id_prenda: atributo.id_prenda,
                nombre: atributo.nombre,
                precio: atributo.precio,
                imagen: atributo.imagen,
                descripcion: atributo.descripcion

            }));

            return res.status(200).json({ prendas: prendas });
        })
    } else {
        conexion.query('SELECT * FROM prendas WHERE nombre_Categoria = ? AND id_categoria_Prenda = ?', [categoria, filtro], (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            let prendas = resultado.map((atributo) => ({
                id_prenda: atributo.id_prenda,
                nombre: atributo.nombre,
                precio: atributo.precio,
                imagen: atributo.imagen,
                descripcion: atributo.descripcion

            }));

            return res.status(200).json({ prendas: prendas });
        })
    }

});

app.post("/detalle-prenda/:id", (req, res) => {
    let session = req.session;
    let id = req.params.id;

    conexion.query('INSERT INTO compras (correo_usuario, id_prenda) VALUES (?,?)', [session.correo, id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ "Status": "Error en la compra" });
        }

        return res.status(200).json({ "Status": "¡Compra Exitosa!" });
    })

})