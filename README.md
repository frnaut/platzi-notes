# Documentación de la Extensión Platzi Notes

## Tabla de Contenidos

- [Introducción](#introducción)
- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
  - [Tomar Notas](#tomar-notas)
  - [Guardar Comentarios como Notas](#guardar-comentarios-como-notas)
  - [Ver y Administrar Notas](#ver-y-administrar-notas)
- [Estructura del Código](#estructura-del-código)
  - [manifest.json](#manifestjson)
  - [content.js](#contentjs)
  - [styles.css](#stylescss)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Introducción

**Platzi Notes** es una extensión de Chrome diseñada para mejorar tu experiencia de aprendizaje en [Platzi](https://platzi.com/). Te permite tomar notas directamente en la plataforma, guardar comentarios de otros estudiantes como notas y gestionar tus notas de manera eficiente.

Esta documentación proporciona una visión general de la extensión, instrucciones para su instalación y uso, y detalles sobre la base de código para ayudar a otros desarrolladores a utilizar o modificar la extensión.

---

## Características

- **Toma de Notas Integrada**: Escribe y guarda notas mientras ves cursos en Platzi.
- **Guardar Comentarios como Notas**: Guarda cualquier comentario de un estudiante como nota con un solo clic.
- **Gestión de Notas**: Visualiza, edita y elimina tus notas dentro de la extensión.
- **Contexto Automático**: Las notas incluyen automáticamente la información del curso y la clase.
- **Notas Recientes Primero**: Las notas se ordenan por las más recientes, asegurando un fácil acceso a tus pensamientos más recientes.

---

## Instalación

Para instalar la extensión Platzi Notes, sigue estos pasos:

1. **Clona o Descarga el Repositorio**:

   - Clona el repositorio usando Git:
     ```bash
     git clone https://github.com/frnaut/platzi-notes.git
     ```
   - O descarga el archivo ZIP y extráelo en una carpeta en tu computadora.

2. **Abre la Página de Extensiones de Chrome**:

   - Abre Google Chrome.
   - Navega a `chrome://extensions/` en la barra de direcciones.

3. **Activa el Modo Desarrollador**:

   - Activa el interruptor que dice **"Modo de desarrollador"** en la esquina superior derecha de la página.

4. **Carga la Extensión**:

   - Haz clic en el botón **"Cargar descomprimida"**.
   - Selecciona la carpeta donde clonaste o extrajiste los archivos de la extensión.

5. **Verifica la Instalación**:

   - La extensión **Platzi Notes** debería aparecer ahora en tu lista de extensiones.
   - Asegúrate de que esté habilitada.

---

## Uso

### Tomar Notas

1. **Navega a un Curso de Platzi**:

   - Abre [Platzi](https://platzi.com/) y comienza cualquier curso o clase.

2. **Accede a la Pestaña de Notas**:

   - En la interfaz del curso, verás una nueva pestaña etiquetada como **"Notas"** junto a otras pestañas.
   - Haz clic en la pestaña **"Notas"** para abrir el área de notas.

3. **Escribe Tu Nota**:

   - Aparecerá un área de texto donde puedes escribir tus notas.
   - El área de notas está diseñada para ser simple y sin distracciones.

4. **Guarda la Nota**:

   - Haz clic en el botón **"Guardar"** para almacenar tu nota.
   - Las notas se guardan automáticamente con el contexto del curso y la clase.

### Guardar Comentarios como Notas

1. **Desplázate a la Sección de Comentarios**:

   - En cualquier clase, desplázate hacia abajo hasta los comentarios realizados por otros estudiantes.

2. **Guarda un Comentario**:

   - Debajo de cada comentario, verás un botón **"Guardar"**.
   - Haz clic en este botón para guardar el comentario como nota.
   - La nota incluirá el contenido del comentario y el nombre del autor.

### Ver y Administrar Notas

1. **Ver Todas las Notas**:

   - En el área de notas, haz clic en **"Ver todas las notas"**.
   - Aparecerá una lista de todas tus notas guardadas, ordenadas por las más recientes.

2. **Editar una Nota**:

   - En la lista de notas, encuentra la nota que deseas editar.
   - Haz clic en el botón **"Editar"**.
   - El contenido de la nota se cargará en el área de notas para su modificación.
   - Después de realizar cambios, haz clic en **"Guardar"** para actualizar la nota.

3. **Eliminar una Nota**:

   - En la lista de notas, haz clic en el botón **"Eliminar"** junto a la nota que deseas eliminar.
   - Confirma la eliminación cuando se te solicite.

---

## Estructura del Código

La extensión consta de tres archivos principales:

1. `manifest.json`
2. `content.js`
3. `styles.css`

### manifest.json

Este archivo contiene metadatos sobre la extensión y especifica sus permisos y los archivos que utiliza.

```json
{
  "manifest_version": 3,
  "name": "Platzi Notes",
  "version": "1.5",
  "description": "Extensión para tomar y gestionar notas mientras estudias en Platzi.",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["https://platzi.com/*"],
  "content_scripts": [
    {
      "matches": ["https://platzi.com/*"],
      "js": ["content.js"],
      "css": ["styles.css"],
      "run_at": "document_idle"
    }
  ]
}
```

### content.js

Este es el archivo JavaScript principal que maneja la funcionalidad de la extensión.

#### Funciones Clave:

- ```addNotesTab()```: Agrega la pestaña "Notas" a la interfaz de Platzi.
- ```toggleNotesArea()```: Muestra u oculta el área de notas.
- ```createNotesArea()```: Crea el área de entrada de notas en el DOM.
- ```saveNote()```: Guarda una nueva nota o actualiza una existente.
- ```showNotesList()```: Muestra la lista de notas guardadas.
- ```editNote()```: Carga una nota en el editor para su modificación.
- ```deleteNote()```: Elimina una nota del almacenamiento.
- ```addSaveNoteButtons()```: Agrega botones "Guardar como nota" a los comentarios.
- ```saveCommentAsNote()```: Guarda un comentario como nota.
- ```observeComments()```: Observa cambios en la sección de comentarios para agregar botones dinámicamente.

#### Manejo de Eventos:

- Utiliza un listener de eventos global para manejar clics en varios botones dentro de la extensión.
- Utiliza ```MutationObserver``` para monitorear cambios en el DOM y asegurar que la extensión se adapte al contenido dinámico.


#### Almacenamiento de Datos:
- Las notas se almacenan en chrome.storage.local bajo la clave allPlatziNotes.
- Cada nota incluye:
    - ```id```: Un identificador único.
    - ```class```: El nombre de la clase donde se tomó la nota.
    - ```course```: El nombre del curso.
    - ```content```: El contenido de texto de la nota.
    - ```timestamp```: La fecha y hora en que se creó o actualizó la nota.

### styles.css

Este archivo contiene estilos para asegurar que los elementos de la interfaz de la extensión se integren sin problemas con el diseño de Platzi.

#### Estilos Clave:

- **Pestaña de Notas:** Estilos personalizados para el botón de la pestaña "Notas".
- **Área de Notas:** Estilos para el área de entrada de notas, incluyendo diseño y espaciado.
- **Botones:** Estilo consistente para todos los botones, incluyendo efectos hover.
- **Lista de Notas:** Diseño y tipografía para la lista de notas guardadas.
- **Botón Guardar Comentario:** Estilos para el botón "Guardar como nota" debajo de los comentarios.


### Contribución
Las contribuciones a la extensión Platzi Notes son bienvenidas. Aquí te mostramos cómo puedes contribuir:

1. #### Haz un Fork del Repositorio:

    - Haz clic en el botón **"Fork"** en la página del repositorio para crear tu propia copia.
2. #### Crea una Rama para tu Funcionalidad:
    - Navega a tu repositorio local.
    - Crea una nueva rama para tu funcionalidad o corrección de errores:
    ```
        git checkout -b feature/nombre-de-tu-funcionalidad
    ```

3. #### Realiza Tus Cambios:
    - Modifica el código según sea necesario.
    - Asegúrate de que tu código siga el estilo y las convenciones existentes.

4. #### Prueba Tus Cambios:
    - Carga la extensión en Chrome y verifica que tus cambios funcionen como se espera.
    - Revisa si hay errores en la consola o problemas.

5. #### Haz Commit y Push:
    - Realiza un commit de tus cambios con un mensaje claro:
    ``` 
    git commit -m "Agregar funcionalidad: descripción de tu funcionalidad"
    ```
    - Envía tu rama a tu repositorio fork:
    ```
    git push origin feature/nombre-de-tu-funcionalidad
    ```
6. #### Crea un Pull Request:
    - Ve al repositorio original en GitHub.
    - Haz clic en **"Compare & pull request".** 
    - Proporciona una descripción detallada de tus cambios y envía el pull request.

7. ### Revisión de Código:

    - Colabora con los mantenedores durante el proceso de revisión.
    - Realiza cualquier cambio solicitado.


**Nota**: Asegúrate de que tus contribuciones no incluyan información sensible y cumplan con los términos de servicio y políticas de Platzi.


### Licencia
Este proyecto está licenciado bajo la licencia MIT. Para obtener más información, consulta el archivo [LICENSE](LICENSE).


**Descargo de Responsabilidad:** Esta extensión es un proyecto independiente y no está afiliado ni respaldado oficialmente por Platzi. Úsala de manera responsable y bajo tu propio riesgo. 

### Contacto:
Para cualquier pregunta o sugerencia, por favor abre un issue en el repositorio o contactame en twitter ( X ) [@ciscojuan2](https://x.com/ciscojuan2).