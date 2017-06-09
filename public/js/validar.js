(function(){

	var formulario = document.getElementsByName('formulario')[0],
		elementos = formulario.elements,
		boton = document.getElementById('btn');

		var validarNombre = function(e){
			if (formulario.title.value == 0) {
				alert("¡Coloca el nombre del alumno que quieres añadir!");
				e.preventDefault();
			}
		};

		var validarDescripcion = function(e){
			if (formulario.description.value == 0) {
				alert("¡Coloca la descripcion del alumno que quieres añadir!");
				e.preventDefault();
			}
		};

		var validarEdad = function(e){
			if (formulario.price.value == 0) {
				alert("¡Coloca la edad del alumno que quieres añadir!");
				e.preventDefault();
			}
		};

		var validarImagen = function(e){
			if (formulario.image_avatar.value == "") {
				alert("¡Seleccione imagen!");
				e.preventDefault();
			}
		};

		var validarClave = function(e){
			if (formulario.password.value == 0) {
				alert("¡Coloca el password de administrador!");
				e.preventDefault();
			}
		};


		var validar = function(e){
			validarNombre(e);
			validarDescripcion(e);
			validarEdad(e);
			validarImagen(e);
			validarClave(e);
		};

		formulario.addEventListener("submit", validar);

}());