# equipoJumboPSICODX

Todas las carpetas y archivos se nombran EN MINÚSCULA SIEMPRE.
Utilizar ‘prettier’. Si vamos a utilizar versiones minimizadas de CSS, hay que desactivarlo.
VARIABLES
Para nombrar variables y funciones, se utilizará notación CamelCase, siempre comenzando por minúscula. (Ejemplo: miVariable).
Para nombrar clases y id en HTML o CSS, se usarán guiones. (Ejemplo: first-button).
No se utilizará ‘var’ para declarar variables. Siempre se usará ‘const’, a menos que sea imperativo reasignar, entonces se utiliza ‘let’.
	ARREGLOS
Usar la sintaxis literal para crear un arreglo.
// mal uso:
const items = new Array();
//buen uso
const items = [];
Utilizar ‘push’ por encima de asignar un valor en una localidad específica.
// mal uso: 
items[5] = ‘hola’;
// buen uso:
items.push(‘hola’);

	RAMAS
Nombramiento de las ramas:
feature/(nombre de la característica que se va a desarrollar/implementar).
Ejemplo: feature/login-page, feature/nav-bar
TAGS
Los tags en git son punteros a un commit específico, que generalmente contienen cambios muy importantes en el código (cambio de X en v.X.Y.Z)
Comandos:
git tag nombre_del_tag (para crear)
git tag (para mostrar los tags ya existentes)
git push - - tags (para subir los tags al repositorio remoto)
	Pasos para crear el tag:
git add .
git commit -m “[ADD] new user”.
git tag v.1.2.1
git push - - tags
	SemVer
	vX.Y.Z
X => Major Version, cambios no compatibles con la versión anterior.
Y => Minor Version, nuevas funcionalidades, son retro compatibles con la versión anterior.
Z => Patches, fixes, cambios menores.
	COMMITS
	git commit -m “type(scope): description”
		type: describe el tipo de cambio.
fix: se usa cuando se va a solucionar un bug. Si se usa fix, entonces en el SemVer corresponde a un Patch. Ejemplos: corregir un error en una función, arreglar un problema en User Interface, solucionar un problema con una consulta en base de datos.
feat: se usa agregas una nueva funcionalidad o característica al código. En el SemVer corresponde a Minor Version. Ejemplos: agregar una  nueva página en una app web, añadir autenticación con Google, incorporar un botón de compartir en redes sociales.
chore: cambios que no afectan la funcionalidad del código pero son necesarios para el mantenimiento del proyecto. Ejemplos: actualizar dependencias de proyectos, configurar prettier para formateo de código, actualizar configuración de ESlint.
docs: cambios en la documentación del proyecto sin modificar el código fuente ni su funcionalidad. Ejemplos: actualizar el README con nuevos pasos de instalación, agregar documentación a un archivo de código, modificar la documentación de la API.
perf: mejoras de rendimiento en el código sin cambiar la funcionalidad. Ejemplos: optimización de algoritmos, reducción de tiempos de carga, reducir el tamaño de imágenes en una web.
test: agregar, actualizar o corregir casos de prueba en el código.
refactor: reorganizar o mejorar el código sin cambiar su comportamiento. Ejemplos: eliminar código duplicado, reestructurar una función para mejorar su legibilidad.
		scope: área o módulo del que se está generando el cambio. Ejemplos:            	autenticación, base de datos.
		descripción: descripción breve de los cambios.
En total no debe haber más de 50 caracteres en la línea de commits (sugerido).
Commits en inglés.
COMENTARIOS EN EL CÓDIGO
/**/ Prettier se encargará de que la línea del comentario no sea muy larga (la fragmentará).
