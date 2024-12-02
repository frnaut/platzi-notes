// content.js
(() => {
    let editingNoteId = null; // Variable para rastrear si estamos editando una nota existente
  
    // Función para generar un ID único
    function generateUniqueId() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  
    // Manejador de eventos para los botones, ligado al content script
    function handleEvent(event) {
      const target = event.target;
  
      if (target.matches('#platzi-notes-tab')) {
        toggleNotesArea();
      } else if (target.matches('#platzi-save-note-button')) {
        event.preventDefault(); // Prevenir comportamiento por defecto
        saveNote();
      } else if (target.matches('#platzi-view-notes-button')) {
        event.preventDefault();
        showNotesList();
      } else if (target.matches('#platzi-close-note-button')) {
        event.preventDefault();
        closeNotesArea();
      } else if (target.matches('.platzi-edit-note-button')) {
        event.preventDefault();
        const noteId = target.dataset.noteId;
        editNote(noteId);
        closeNotesListArea();
      } else if (target.matches('.platzi-delete-note-button')) {
        event.preventDefault();
        const noteId = target.dataset.noteId;
        deleteNote(noteId);
      } else if (target.matches('#platzi-close-notes-list-button')) {
        event.preventDefault();
        closeNotesListArea();
      } else if (target.matches('.platzi-save-comment-button')) {
        event.preventDefault();
        const commentElement = target.closest('.Comment_Comment__pyWmK');
        if (commentElement) {
          saveCommentAsNote(commentElement);
        }
      }
    }
  
    // Añadir un listener global al document del content script
    document.addEventListener('click', handleEvent);
  
    // Función para agregar la pestaña de notas
    function addNotesTab() {
      // Verificar si el botón ya existe
      if (document.getElementById("platzi-notes-tab")) return;
  
      // Seleccionar el contenedor de las pestañas
      const tabList = document.querySelector('div[role="tablist"]');
  
      if (tabList) {
        // Crear el botón de la pestaña
        const tabButton = document.createElement("button");
        tabButton.type = "button";
        tabButton.id = "platzi-notes-tab";
        tabButton.setAttribute("role", "tab");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("aria-controls", "platzi-notes-area");
        tabButton.setAttribute("data-state", "inactive");
        tabButton.className = "Tab MaterialTabs_MaterialTabs__Tab__inUR5";
        tabButton.setAttribute("tabindex", "-1");
        tabButton.setAttribute("data-orientation", "horizontal");
        tabButton.setAttribute("data-radix-collection-item", "");
  
        // Estilos opcionales para el botón
        tabButton.style.display = "flex";
        tabButton.style.alignItems = "center";
        tabButton.style.gap = "4px";
  
        // Crear el ícono SVG
        // const svgNS = "http://www.w3.org/2000/svg";
        // const svg = document.createElementNS(svgNS, "svg");
        // svg.setAttribute("width", "1em");
        // svg.setAttribute("height", "1em");
        // svg.setAttribute("fill", "none");
        // svg.setAttribute("viewBox", "0 0 20 20");
  
        // const path = document.createElementNS(svgNS, "path");
        // path.setAttribute("fill", "#fff");
        // path.setAttribute("fill-rule", "evenodd");
        // path.setAttribute("d", "M5 3h10v14H5V3zm1 1v12h8V4H6z");
        // path.setAttribute("clip-rule", "evenodd");
  
        // svg.appendChild(path);
  
        // Crear el texto del botón
        const buttonText = document.createTextNode("Notas");
  
        // Agregar el ícono y el texto al botón
        // tabButton.appendChild(svg);
        tabButton.appendChild(buttonText);
  
        // Agregar el botón de la pestaña al contenedor
        tabList.appendChild(tabButton);
      }
    }
  
    // Función para alternar el área de notas
    function toggleNotesArea() {
      let notesArea = document.getElementById("platzi-notes-area");
      if (!notesArea) {
        notesArea = createNotesArea(); // Asegúrate de que notesArea se reasigna
      }
  
      // Ahora notesArea debería existir
      if (notesArea.style.display === "none" || notesArea.style.display === "") {
        // Mostrar el área de notas
        notesArea.style.display = "flex";
        // Actualizar el estado del botón de pestaña
        const tabButton = document.getElementById("platzi-notes-tab");
        tabButton.setAttribute("aria-selected", "true");
        tabButton.setAttribute("data-state", "active");
      } else {
        // Ocultar el área de notas
        notesArea.style.display = "none";
        // Actualizar el estado del botón de pestaña
        const tabButton = document.getElementById("platzi-notes-tab");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("data-state", "inactive");
        // Reiniciar el área de notas
        resetNotesArea();
      }
    }
  
    // Función para cerrar el área de notas
    function closeNotesArea() {
      const notesArea = document.getElementById("platzi-notes-area");
      if (notesArea) {
        notesArea.style.display = "none";
        // Cambiar el estado del botón de pestaña
        const tabButton = document.getElementById("platzi-notes-tab");
        tabButton.setAttribute("aria-selected", "false");
        tabButton.setAttribute("data-state", "inactive");
        // Reiniciar el formulario de notas
        resetNotesArea();
      }
    }
  
    // Función para crear el área de notas
    function createNotesArea() {
      // Crear el área de notas
      const notesArea = document.createElement("div");
      notesArea.id = "platzi-notes-area";
      notesArea.style.position = "fixed";
      notesArea.style.top = "60px";
      notesArea.style.right = "0";
      notesArea.style.width = "400px";
      notesArea.style.height = "calc(100% - 60px)";
      notesArea.style.backgroundColor = "#1E2229";
      notesArea.style.zIndex = "10000";
      notesArea.style.padding = "10px";
      notesArea.style.boxShadow = "-4px 0 6px rgba(0, 0, 0, 0.1)";
      notesArea.style.display = "flex";
      notesArea.style.flexDirection = "column";
      notesArea.style.overflowY = "auto";
  
      // Añadir un textarea para las notas
      const textarea = document.createElement("textarea");
      textarea.id = "platzi-notes-textarea";
      textarea.style.flex = "1";
      textarea.style.width = "100%";
      textarea.style.resize = "none";
      textarea.placeholder = "Escribe tus notas aquí...";
  
      // Contenedor de botones
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.marginTop = "10px";
      buttonsContainer.style.display = "flex";
      buttonsContainer.style.gap = "5px";
  
      // Botón para guardar las notas
      const saveButton = document.createElement("button");
      saveButton.id = "platzi-save-note-button";
      saveButton.innerText = "Guardar";
  
      // Botón para ver la lista de notas
      const listButton = document.createElement("button");
      listButton.id = "platzi-view-notes-button";
      listButton.innerText = "Ver todas las notas";
  
      // Botón para cerrar el área de notas
      const closeButton = document.createElement("button");
      closeButton.id = "platzi-close-note-button";
      closeButton.innerText = "Cerrar";
  
      buttonsContainer.appendChild(saveButton);
      buttonsContainer.appendChild(listButton);
      buttonsContainer.appendChild(closeButton);
  
      // Agregar elementos al área de notas
      notesArea.appendChild(textarea);
      notesArea.appendChild(buttonsContainer);
  
      // Agregar el área de notas al body
      document.body.appendChild(notesArea);
  
      return notesArea; // Retornar el elemento creado
    }
  
    // Función para mostrar la lista de notas
    function showNotesList() {
      // Obtener o crear el área de la lista de notas
      let notesListArea = document.getElementById("platzi-notes-list-area");
      if (!notesListArea) {
        notesListArea = document.createElement("div");
        notesListArea.id = "platzi-notes-list-area";
        notesListArea.style.position = "fixed";
        notesListArea.style.top = "60px";
        notesListArea.style.right = "0";
        notesListArea.style.width = "400px";
        notesListArea.style.height = "calc(100% - 60px)";
        notesListArea.style.backgroundColor = "#1E2229";
        notesListArea.style.borderLeft = "1px solid #ccc";
        notesListArea.style.zIndex = "10001";
        notesListArea.style.padding = "10px";
        notesListArea.style.boxShadow = "-4px 0 6px rgba(0, 0, 0, 0.1)";
        notesListArea.style.display = "flex";
        notesListArea.style.flexDirection = "column";
        notesListArea.style.overflowY = "auto";
  
        // Título
        const title = document.createElement("h2");
        title.innerText = "Mis Notas";
  
        // Contenedor de la lista
        const notesList = document.createElement("ul");
        notesList.id = "platzi-notes-list";
        notesList.style.flex = "1";
        notesList.style.padding = "0";
        notesList.style.margin = "0";
        notesList.style.listStyle = "none";
        notesList.style.overflowY = "auto";
  
        // Botón para cerrar la lista
        const closeButton = document.createElement("button");
        closeButton.id = "platzi-close-notes-list-button";
        closeButton.innerText = "Cerrar";
  
        // Agregar elementos al área de lista
        notesListArea.appendChild(title);
        notesListArea.appendChild(notesList);
        notesListArea.appendChild(closeButton);
  
        // Agregar el área de lista al body
        document.body.appendChild(notesListArea);
      }
  
      // Mostrar el área de lista
      notesListArea.style.display = "flex";
  
      // Cargar las notas guardadas
      chrome.storage.local.get({ allPlatziNotes: [] }, (result) => {
        let notesArray = result.allPlatziNotes;
        const notesList = document.getElementById("platzi-notes-list");
        notesList.innerHTML = ''; // Limpiar la lista
  
        if (notesArray.length === 0) {
          const noNotesMessage = document.createElement("p");
          noNotesMessage.innerText = "No tienes notas guardadas.";
          notesList.appendChild(noNotesMessage);
        } else {
          // Ordenar las notas por timestamp en orden descendente
          notesArray.sort((a, b) => {
            const dateA = new Date(a.timestamp || 0);
            const dateB = new Date(b.timestamp || 0);
            return dateB - dateA; // Más recientes primero
          });
  
          notesArray.forEach((note) => {
            const listItem = document.createElement("li");
            listItem.style.borderBottom = "1px solid #ccc";
            listItem.style.padding = "10px 0";
  
            // Mostrar el nombre del curso y la clase
            const courseInfo = document.createElement("p");
            courseInfo.innerHTML = `<strong>Curso:</strong> ${note.course}<br><strong>Clase:</strong> ${note.class}`;
            courseInfo.style.margin = "0 0 5px 0";
  
            // Mostrar las primeras 2 líneas del contenido de la nota
            const notePreview = document.createElement("p");
            const noteLines = note.content.split('\n').slice(0, 2).join('\n');
            notePreview.innerText = noteLines;
            notePreview.style.margin = "0";
            notePreview.style.flex = "1";
  
            // Botones de editar y eliminar
            const buttonsContainer = document.createElement("div");
            buttonsContainer.style.display = "flex";
            buttonsContainer.style.gap = "5px";
            buttonsContainer.style.marginTop = "5px";
  
            const editButton = document.createElement("button");
            editButton.className = "platzi-edit-note-button";
            editButton.dataset.noteId = note.id;
            editButton.innerText = "Editar";
  
            const deleteButton = document.createElement("button");
            deleteButton.className = "platzi-delete-note-button";
            deleteButton.dataset.noteId = note.id;
            deleteButton.innerText = "Eliminar";
  
            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
  
            listItem.appendChild(courseInfo);
            listItem.appendChild(notePreview);
            listItem.appendChild(buttonsContainer);
  
            notesList.appendChild(listItem);
          });
        }
      });
    }
  
    // Función para cerrar la lista de notas
    function closeNotesListArea() {
      const notesListArea = document.getElementById("platzi-notes-list-area");
      if (notesListArea) {
        notesListArea.style.display = "none";
      }
    }
  
    // Función para guardar una nota (nueva o existente)
    function saveNote() {
      const textarea = document.getElementById("platzi-notes-textarea");
      const noteContent = textarea.value.trim();
      if (noteContent) {
        // Obtener información del curso y la clase
        const classTitleElement = document.querySelector('h1[class*="MaterialDesktopHeading-info__title"]');
        const courseInfoElement = document.querySelector('p[class*="MaterialDesktopHeading-info__description"]');
  
        const classTitle = classTitleElement ? classTitleElement.textContent : "Clase desconocida";
        const courseInfo = courseInfoElement ? courseInfoElement.textContent : "Curso desconocido";
  
        chrome.storage.local.get({ allPlatziNotes: [] }, (result) => {
          const notesArray = result.allPlatziNotes;
  
          if (editingNoteId !== null) {
            // Actualizar nota existente
            const noteIndex = notesArray.findIndex(note => note.id === editingNoteId);
            if (noteIndex !== -1) {
              notesArray[noteIndex].content = noteContent;
              notesArray[noteIndex].timestamp = new Date().toISOString(); // Actualizar el timestamp
              // alert("¡Nota actualizada!");
            }
            editingNoteId = null; // Reiniciar el ID de edición
          } else {
            // Generar un ID único para la nueva nota
            const noteId = generateUniqueId();
  
            // Crear el objeto de la nota
            const newNote = {
              id: noteId,
              class: classTitle,
              course: courseInfo,
              content: noteContent,
              timestamp: new Date().toISOString() // Agregar timestamp
            };
  
            // Verificar si ya existe una nota con el mismo curso y clase
            const existingNotes = notesArray.filter(note => note.course === courseInfo && note.class === classTitle);
            if (existingNotes.length > 0) {
              newNote.class += ` (${existingNotes.length + 1})`; // Enumerar las notas duplicadas
            }
  
            notesArray.push(newNote);
            // alert("¡Nota guardada!");
          }
  
          chrome.storage.local.set({ allPlatziNotes: notesArray }, () => {
            // Limpiar el textarea después de guardar
            textarea.value = '';
          });
        });
      } else {
        alert("No puedes guardar una nota vacía.");
      }
    }
  
    // Función para editar una nota
    function editNote(noteId) {
      chrome.storage.local.get({ allPlatziNotes: [] }, (result) => {
        const notesArray = result.allPlatziNotes;
        const noteToEdit = notesArray.find(note => note.id === noteId);
        if (noteToEdit) {
          // Abrir el área de notas si no está abierta
          let notesArea = document.getElementById("platzi-notes-area");
          if (!notesArea) {
            notesArea = createNotesArea();
          }
  
          notesArea.style.display = "flex";
          // Actualizar el estado del botón de pestaña
          const tabButton = document.getElementById("platzi-notes-tab");
          tabButton.setAttribute("aria-selected", "true");
          tabButton.setAttribute("data-state", "active");
  
          // Cargar el contenido en el textarea
          const textarea = document.getElementById("platzi-notes-textarea");
          textarea.value = noteToEdit.content;
  
          // Establecer el ID de la nota que se está editando
          editingNoteId = noteId;
        } else {
          alert("Nota no encontrada.");
        }
      });
    }
  
    // Función para eliminar una nota
    function deleteNote(noteId) {
      if (confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
        chrome.storage.local.get({ allPlatziNotes: [] }, (result) => {
          let notesArray = result.allPlatziNotes;
          notesArray = notesArray.filter(note => note.id !== noteId);
          chrome.storage.local.set({ allPlatziNotes: notesArray }, () => {
            showNotesList();
          });
        });
      }
    }
  
    // Función para reiniciar el área de notas
    function resetNotesArea() {
      const textarea = document.getElementById("platzi-notes-textarea");
      if (textarea) {
        textarea.value = '';
      }
      editingNoteId = null;
    }
  
    // Función para agregar botones "Guardar como nota" a los comentarios
    function addSaveNoteButtons() {
      const comments = document.querySelectorAll('.Comment_Comment__pyWmK');
      comments.forEach((comment) => {
        // Verificar si el botón ya existe
        if (comment.querySelector('.platzi-save-comment-button')) {
          return; // Botón ya agregado
        }
  
        // Crear el botón
        const saveButton = document.createElement('button');
        saveButton.className = 'platzi-save-comment-button';
        saveButton.innerText = 'Guardar';
  
        // Estilos opcionales para el botón
        saveButton.style.marginTop = '0px';
        saveButton.style.padding = '5px 10px';
        saveButton.style.backgroundColor = '#1E2229';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
  
        // Agregar el botón al pie del comentario
        const commentFooter = comment.querySelector('.Comment_Comment-footer__3_iVr');
        if (commentFooter) {
          commentFooter.appendChild(saveButton);
        } else {
          // Si no se encuentra el footer, agregar al final del comentario
          comment.appendChild(saveButton);
        }
      });
    }
  
    // Función para guardar un comentario como nota
    function saveCommentAsNote(commentElement) {
      // Obtener el contenido del comentario
      const contentElement = commentElement.querySelector('.Comment_Comment-message__fyscQ .Markdown_Markdown__k5sxI');
      const commentContent = contentElement ? contentElement.innerText.trim() : '';
  
      if (commentContent) {
        // Obtener el nombre del autor
        const authorElement = commentElement.querySelector('.Comment_Comment-name__JuvPY');
        const authorName = authorElement ? authorElement.innerText.trim() : 'Autor desconocido';
  
        // Obtener información del curso y la clase
        const classTitleElement = document.querySelector('h1[class*="MaterialDesktopHeading-info__title"]');
        const courseInfoElement = document.querySelector('p[class*="MaterialDesktopHeading-info__description"]');
  
        const classTitle = classTitleElement ? classTitleElement.textContent : "Clase desconocida";
        const courseInfo = courseInfoElement ? courseInfoElement.textContent : "Curso desconocido";
  
        chrome.storage.local.get({ allPlatziNotes: [] }, (result) => {
          const notesArray = result.allPlatziNotes;
  
          // Generar un ID único para la nueva nota
          const noteId = generateUniqueId();
  
          // Crear el objeto de la nota
          const newNote = {
            id: noteId,
            class: classTitle,
            course: courseInfo,
            content: `Comentario de ${authorName}:\n\n${commentContent}`,
            timestamp: new Date().toISOString() // Agregar timestamp
          };
  
          notesArray.push(newNote);
          chrome.storage.local.set({ allPlatziNotes: notesArray }, () => {
            alert("¡Comentario guardado como nota!");
          });
        });
      } else {
        alert("No se pudo obtener el contenido del comentario.");
      }
    }
  
    // Observador de mutaciones para monitorear la sección de comentarios
    function observeComments() {
      const commentsContainer = document.querySelector('.Comments_Comments__FE6Fi');
      if (commentsContainer) {
        // Agregar botones a los comentarios existentes
        addSaveNoteButtons();
  
        const commentsObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              // Nuevos comentarios agregados
              addSaveNoteButtons();
            }
          });
        });
  
        commentsObserver.observe(commentsContainer, {
          childList: true,
          subtree: true
        });
      }
    }
  
    // Observador de mutaciones para detectar cuando aparece la sección de comentarios
    const domObserver = new MutationObserver((mutations, obs) => {
      const commentsContainer = document.querySelector('.Comments_Comments__FE6Fi');
      if (commentsContainer) {
        observeComments();
        obs.disconnect(); // Dejar de observar una vez encontrada la sección de comentarios
      }
    });
  
    // Iniciar la observación del DOM
    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  
    // Observador de mutaciones para detectar cambios en el DOM y agregar la pestaña de notas
    const observer = new MutationObserver((mutations, obs) => {
      const tabList = document.querySelector('div[role="tablist"]');
      if (tabList) {
        addNotesTab();
        obs.disconnect(); // Dejar de observar una vez que se ha agregado el botón
      }
    });
  
    // Configurar el observador para la pestaña de notas
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  })();
  