//esto es para pedir y poder usar express y mongoose, entro otros
var express = require('express'); //framework de nodejs
var mongoose = require('mongoose'); //gestor de mongodb
var bodyParser = require('body-parser'); //para leer el producto
var multer = require('multer');
var cloudinary = require('cloudinary');
var method_override = require("method-override");
var app_password = "123456789";
var port = process.env.PORT || 8080;

//configuarion del api de cloudinary
cloudinary.config({
	cloud_name: "djassiel",
	api_key: "256642225155757",
	api_secret: "wY52bM5sIcHzdAd2K8ajzzr1V9Y"
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({dest: "./uploads"})); //destino de las imagenes subidas estan en uploads
app.use(method_override("_method"));

//conexion a la base de datos
mongoose.Promise = global.Promise; //reglas de mongoose "no he investigado que significa"
mongoose.connect("mongodb://djassiel:j10377954@ds040027.mlab.com:40027/promoxi");

//definir schema de los productos
var productSchema = {
	title:String,
	description:String,
	imageUrl:String
};

var Product = mongoose.model("Product", productSchema); //crear el modelo

//esto de abajo es para usar pug un jade
app.set("view engine", "pug");

app.use(express.static("public")); //para las imagenes, colocar todo en la carpeta publica, css,js,img

//esto es para crear el servidor el "/" es la url, siempre hay que colocar un render
app.get("/", function(solicitud,respuesta){
	respuesta.render("index");
});

app.get("/fotos",function(solicitud,respuesta){
	Product.find(function(error,documento){
		if(error){console.log(error); }
		respuesta.render("fotos/index",{ products: documento })
	}); 
});

app.get("/fotos/edit/:id",function(solicitud,respuesta){
	 var id_producto = solicitud.params.id;
	 
	 Product.findById({"_id": id_producto}, function(error, producto){
		console.log(producto);
		respuesta.render("fotos/edit", { product: producto });
	});
	
});

app.put("/fotos/:id",function(solicitud,respuesta){
	if(solicitud.body.password == app_password){
		var data = {
		title: solicitud.body.title,
		description: solicitud.body.description
		};

		Product.update({"_id": solicitud.params.id},data,function(Product){
			respuesta.redirect("/fotos");
		});
	}else{
		respuesta.redirect("/");
	}
});

app.get("/admin",function(solicitud,respuesta){
	respuesta.render("admin/form")
});

app.post("/admin",function(solicitud,respuesta){
	if(solicitud.body.password == app_password){
		Product.find(function(error,documento){
			if(error){console.log(error); }
			respuesta.render("admin/index",{ products: documento })
		});
	} else {
		respuesta.redirect("/");
	}

});

app.get("/fotos/new", function(solicitud,respuesta){
	respuesta.render("fotos/new");
});

app.post("/fotos", function(solicitud,respuesta){
	//si se pone la contraseña que esta dentro del "" se enviara al index
	var data = {
		title: solicitud.body.title,
		description: solicitud.body.description,
		imageUrl: "data.png"
	}
	
	var product = new Product(data);
	cloudinary.uploader.upload(solicitud.files.image_avatar.path, //configuracion para subir las imagenes a cloudinary
		function(result) {
			product.imageUrl = result.url;

			product.save(function(err){ //imprimir el producto
			respuesta.redirect("fotos");
				console.log(product);
			});
		}
	);

	//si no se coloca la contraseña recargara la pagina

});

app.get("/fotos/delete/:id",function(solicitud,respuesta){
	var id = solicitud.params.id;

	Product.findById({"_id": id},function(error,producto){
		respuesta.render("fotos/delete", { product: producto })
	})
});

app.delete("/fotos/:id",function(solicitud,respuesta){
	var id = solicitud.params.id;
		Product.remove({"_id": id},function(err){
			if(err){console.log(err); }
			respuesta.redirect("/admin");
		});

});

//puerto
app.listen(port, console.log("corriendo en el puerto " + port));
