// 1 - Invocamos a Express
const express = require('express');
const app = express();

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({extended:false}));
app.use(express.json());//además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: '../env/.env'});

//4 -seteamos el directorio de assets
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas
app.set('view engine','ejs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// 8 - Invocamos a la conexion de la DB
const connection = require('../database/db');

//9 - establecemos las rutas
	app.get('/login',(req, res)=>{
		res.render('login');
	})

	app.get('/register',(req, res)=>{
		res.render('register');
	})

//10 - Método para la REGISTRACIÓN
app.post('/register', async (req, res)=>{
	console.log(req.body);
	const name = req.body.user_name;
	const lastname = req.body.user_lastname;
    const phone = req.body.user_phone;
	const email = req.body.user_email;
    connection.query('INSERT INTO users SET ?',{user_name:name, user_lastname:lastname, user_phone:phone, user_email: email	}, async (error, results)=>{
        if(error){
			res.send("<h1>Error al registrar</h1>");
            console.log(error);
        }else{            
			res.send("<h1>Usuario registrado</h1>");
        }
	});
})




//prueba de llamato a la base de datos
app.get('/existe/:user_email', async (req, res)=>{
	const email = req.params.user_email;
	connection.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (error, results)=>{
		if(error){
			console.log(error);
		}else{
			res.send(results);
		}
	}
	);
})



//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const email = req.body.user_email;
	if (email) {
		connection.query('SELECT * FROM users WHERE user_email = ?', [email], async (error, results, fields)=> {
			if( results.length == 0) { 
				/*res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });*/
				
				//Mensaje simple y poco vistoso
                res.send('Incorrect email and/or Password!');				
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.email = results[0].email;
				/*res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        	*/		
				res.send('Login correcto');
			}			
			res.end();
		});
	} else {	
		res.send('Please enter email and Password!');
		res.end();
	}
});

/*//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('signin',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});*/
const routes = require('./routes');

app.use("/api", routes)

app.listen(3001, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3001');
});