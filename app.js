/* =========================================================
FIND ME
LÓGICA PRINCIPAL
========================================================= */

/* =========================================================
CONFIGURACIÓN
========================================================= */

const STORAGE_PERSONAS = "findme-personas";
const STORAGE_TEMA = "findme-tema";
const STORAGE_CUENTA = "findme-cuenta";
const STORAGE_NOTIFICACIONES = "findme-notificaciones";

const MAX_IMAGEN_MB = 3;
const MAX_IMAGEN_BYTES = MAX_IMAGEN_MB * 1024 * 1024;

/* =========================================================
VARIABLES
========================================================= */

let personaEditandoId = null;
let terminosAceptadosEnSesion = false;
let geolocalizacionInicializada = false;

/* =========================================================
BASE DE DATOS
========================================================= */

let dbPersonas = cargarPersonasGuardadas();

const dbZonasDelPais = [
    {
        id: "centro",
        nombre: "Zona Centro",
        descripcion: "Capital y alrededores",
        casos: 0
    },
    {
        id: "norte",
        nombre: "Zona Norte",
        descripcion: "Provincias fronterizas del norte",
        casos: 0
    },
    {
        id: "sur",
        nombre: "Zona Sur",
        descripcion: "Provincias y sectores del sur",
        casos: 0
    },
    {
        id: "costa",
        nombre: "Zona Costa",
        descripcion: "Sectores costeros y puertos",
        casos: 0
    },
    {
        id: "oriente",
        nombre: "Zona Oriente",
        descripcion: "Sectores amazónicos y rurales",
        casos: 0
    }
];

/* =========================================================
UTILIDADES
========================================================= */

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function obtenerElemento(id) {
    return document.getElementById(id);
}

function cargarPersonasGuardadas() {
    try {
        const datos = localStorage.getItem(
            STORAGE_PERSONAS
        );

        if (!datos) {
            return [];
        }

        const personas = JSON.parse(datos);

        return Array.isArray(personas)
            ? personas
            : [];
    } catch (error) {
        console.error(
            "No se pudieron cargar los registros:",
            error
        );

        return [];
    }
}

function guardarPersonas() {
    try {
        localStorage.setItem(
            STORAGE_PERSONAS,
            JSON.stringify(dbPersonas)
        );

        return true;
    } catch (error) {
        console.error(
            "No se pudieron guardar los registros:",
            error
        );

        alert(
            "No se pudieron guardar los datos. Es posible que el almacenamiento del navegador esté lleno."
        );

        return false;
    }
}

/* =========================================================
NOTIFICACIONES
========================================================= */

function obtenerNotificaciones() {
    try {
        const cantidad = Number(
            localStorage.getItem(
                STORAGE_NOTIFICACIONES
            )
        );

        return Number.isFinite(cantidad) &&
            cantidad > 0
            ? Math.floor(cantidad)
            : 0;
    } catch (error) {
        console.warn(
            "No se pudieron leer las notificaciones.",
            error
        );

        return 0;
    }
}

function actualizarContadorNotificaciones(
    cantidad,
    animar = false
) {
    const contador =
        obtenerElemento(
            "contadorNotificaciones"
        );

    const boton =
        obtenerElemento(
            "btnNotificaciones"
        );

    if (!contador) {
        return;
    }

    const total =
        Math.max(
            0,
            Number(cantidad) || 0
        );

    contador.textContent =
        total > 99
            ? "99+"
            : String(total);

    contador.setAttribute(
        "aria-label",
        `${total} ${
            total === 1
                ? "notificación"
                : "notificaciones"
        }`
    );

    contador.classList.toggle(
        "oculto",
        total === 0
    );

    if (
        animar &&
        total > 0
    ) {
        contador.classList.remove(
            "actualizado"
        );

        void contador.offsetWidth;

        contador.classList.add(
            "actualizado"
        );

        if (boton) {
            boton.classList.remove(
                "shake-notificacion"
            );

            void boton.offsetWidth;

            boton.classList.add(
                "shake-notificacion"
            );

            setTimeout(
                () => {
                    boton.classList.remove(
                        "shake-notificacion"
                    );
                },
                700
            );
        }
    }
}

function establecerNotificaciones(
    cantidad,
    animar = false
) {
    const anterior =
        obtenerNotificaciones();

    const total =
        Math.max(
            0,
            Number(cantidad) || 0
        );

    try {
        localStorage.setItem(
            STORAGE_NOTIFICACIONES,
            String(total)
        );
    } catch (error) {
        console.warn(
            "No se pudieron guardar las notificaciones.",
            error
        );
    }

    actualizarContadorNotificaciones(
        total,
        animar &&
            total > anterior
    );
}

function agregarNotificacion() {
    establecerNotificaciones(
        obtenerNotificaciones() + 1,
        true
    );
}

function limpiarNotificaciones() {
    establecerNotificaciones(
        0,
        false
    );
}

function formatearFechaRegistro(fecha) {
    if (!fecha) {
        return "Fecha no disponible";
    }

    const fechaConvertida =
        new Date(fecha);

    if (
        Number.isNaN(
            fechaConvertida.getTime()
        )
    ) {
        return escaparHTML(fecha);
    }

    const dia = String(
        fechaConvertida.getDate()
    ).padStart(2, "0");

    const mes = String(
        fechaConvertida.getMonth() + 1
    ).padStart(2, "0");

    const anio =
        fechaConvertida.getFullYear();

    let horas =
        fechaConvertida.getHours();

    const minutos = String(
        fechaConvertida.getMinutes()
    ).padStart(2, "0");

    const periodo =
        horas >= 12
            ? "p. m."
            : "a. m.";

    horas = horas % 12;

    if (horas === 0) {
        horas = 12;
    }

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${periodo}`;
}

function formatearFechaDesaparicion(
    fecha,
    hora
) {
    if (!fecha || !hora) {
        return "No especificada";
    }

    const partesFecha =
        fecha.split("-");

    if (partesFecha.length !== 3) {
        return "No especificada";
    }

    const anio =
        partesFecha[0];

    const mes =
        partesFecha[1];

    const dia =
        partesFecha[2];

    const partesHora =
        hora.split(":");

    if (partesHora.length < 2) {
        return "No especificada";
    }

    let horas =
        parseInt(
            partesHora[0],
            10
        );

    const minutos =
        partesHora[1];

    if (
        !Number.isInteger(horas) ||
        horas < 0 ||
        horas > 23 ||
        !/^\d{2}$/.test(minutos)
    ) {
        return "No especificada";
    }

    const periodo =
        horas >= 12
            ? "p. m."
            : "a. m.";

    horas = horas % 12;

    if (horas === 0) {
        horas = 12;
    }

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${periodo}`;
}

/* =========================================================
TÉRMINOS Y CONDICIONES
========================================================= */

const modalTerminos =
    obtenerElemento("modalTerminos");

const checkTerminos =
    obtenerElemento("checkTerminos");

const btnAceptarTerminos =
    obtenerElemento("btnAceptarTerminos");

const btnCerrarTerminos =
    obtenerElemento("btnCerrarTerminos");

const btnVerTerminos =
    obtenerElemento("btnVerTerminos");

function cuentaEstaVinculada() {
    try {
        const cuenta =
            localStorage.getItem(
                STORAGE_CUENTA
            );

        return (
            cuenta === "Google" ||
            cuenta === "Apple"
        );
    } catch (error) {
        console.warn(
            "No se pudo comprobar la cuenta vinculada.",
            error
        );

        return false;
    }
}

function terminosAceptados() {
    return (
        terminosAceptadosEnSesion ||
        cuentaEstaVinculada()
    );
}

function guardarAceptacionTerminos() {
    terminosAceptadosEnSesion = true;
}

function actualizarBotonAceptarTerminos() {
    if (
        !btnAceptarTerminos ||
        !checkTerminos ||
        !modalTerminos
    ) {
        return;
    }

    const obligatorio =
        modalTerminos.dataset.obligatorio ===
        "true";

    if (obligatorio) {
        btnAceptarTerminos.disabled =
            !checkTerminos.checked;
    }
}

function cerrarTerminos() {
    if (!modalTerminos) {
        return;
    }

    modalTerminos.classList.add(
        "oculto"
    );

    document.body.classList.remove(
        "bloqueado-por-terminos"
    );

    modalTerminos.dataset.obligatorio =
        "false";
}

function abrirTerminos(
    obligatorio = false
) {
    if (!modalTerminos) {
        return;
    }

    modalTerminos.classList.remove(
        "oculto"
    );

    modalTerminos.dataset.obligatorio =
        obligatorio
            ? "true"
            : "false";

    document.body.classList.add(
        "bloqueado-por-terminos"
    );

    if (btnCerrarTerminos) {
        btnCerrarTerminos.classList.toggle(
            "oculto",
            obligatorio
        );
    }

    if (checkTerminos) {
        checkTerminos.checked =
            !obligatorio;
    }

    if (btnAceptarTerminos) {
        btnAceptarTerminos.textContent =
            obligatorio
                ? "Aceptar y continuar"
                : "Cerrar";

        btnAceptarTerminos.disabled =
            obligatorio &&
            checkTerminos
                ? !checkTerminos.checked
                : false;
    }
}

if (checkTerminos) {
    checkTerminos.addEventListener(
        "change",
        actualizarBotonAceptarTerminos
    );
}

if (btnAceptarTerminos) {
    btnAceptarTerminos.addEventListener(
        "click",
        () => {
            const obligatorio =
                modalTerminos &&
                modalTerminos.dataset.obligatorio ===
                    "true";

            if (obligatorio) {
                if (
                    !checkTerminos ||
                    !checkTerminos.checked
                ) {
                    return;
                }

                guardarAceptacionTerminos();

                cerrarTerminos();

                inicializarGeolocalizacionYZonas();

                return;
            }

            cerrarTerminos();
        }
    );
}

if (btnCerrarTerminos) {
    btnCerrarTerminos.addEventListener(
        "click",
        cerrarTerminos
    );
}

if (btnVerTerminos) {
    btnVerTerminos.addEventListener(
        "click",
        () => {
            abrirTerminos(false);
        }
    );
}

/* =========================================================
DETERMINAR ZONA
========================================================= */

function determinarZona(ciudad) {
    const texto = String(
        ciudad || ""
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

    const costa = [
        "guayaquil",
        "duran",
        "samborondon",
        "milagro",
        "machala",
        "manta",
        "portoviejo",
        "esmeraldas",
        "quevedo",
        "babahoyo",
        "salinas",
        "santa elena",
        "playas"
    ];

    const norte = [
        "tulcan",
        "ibarra",
        "otavalo",
        "cayambe"
    ];

    const sur = [
        "loja",
        "cuenca",
        "azogues",
        "pasaje",
        "catamayo"
    ];

    const oriente = [
        "tena",
        "puyo",
        "macas",
        "zamora",
        "lago agrio",
        "nueva loja",
        "francisco de orellana",
        "el coca",
        "sucua"
    ];

    if (
        costa.some(
            lugar =>
                texto.includes(lugar)
        )
    ) {
        return "costa";
    }

    if (
        norte.some(
            lugar =>
                texto.includes(lugar)
        )
    ) {
        return "norte";
    }

    if (
        sur.some(
            lugar =>
                texto.includes(lugar)
        )
    ) {
        return "sur";
    }

    if (
        oriente.some(
            lugar =>
                texto.includes(lugar)
        )
    ) {
        return "oriente";
    }

    return "centro";
}

/* =========================================================
ACTUALIZAR CONTADORES
========================================================= */

function actualizarContadoresZonas() {
    dbZonasDelPais.forEach(
        zona => {
            zona.casos = 0;
        }
    );

    dbPersonas.forEach(
        persona => {
            const zonaId =
                determinarZona(
                    persona.ciudad
                );

            const zona =
                dbZonasDelPais.find(
                    z =>
                        z.id === zonaId
                );

            if (zona) {
                zona.casos += 1;
            }
        }
    );
}

/* =========================================================
NAVEGACIÓN
========================================================= */

const botonesNav =
    document.querySelectorAll(
        ".nav-item"
    );

const pantallas =
    document.querySelectorAll(
        ".pantalla"
    );

function cambiarPantalla(
    pantallaId
) {
    if (!terminosAceptados()) {
        abrirTerminos(true);
        return;
    }

    const pantallaExiste =
        Array.from(
            pantallas
        ).some(
            pantalla =>
                pantalla.id ===
                pantallaId
        );

    if (!pantallaExiste) {
        console.warn(
            `No existe la pantalla: ${pantallaId}`
        );

        return;
    }

    botonesNav.forEach(
        boton => {
            boton.classList.toggle(
                "activo",
                boton.dataset.pantalla ===
                    pantallaId
            );
        }
    );

    pantallas.forEach(
        pantalla => {
            pantalla.classList.toggle(
                "activa",
                pantalla.id ===
                    pantallaId
            );
        }
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (
        pantallaId ===
        "pantalla-zonas"
    ) {
        cargarZonas();
    }
}

botonesNav.forEach(
    boton => {
        boton.addEventListener(
            "click",
            () => {
                cambiarPantalla(
                    boton.dataset.pantalla
                );
            }
        );
    }
);

/* =========================================================
PANTALLA INICIO
========================================================= */

function cargarAlertasInicio() {
    const contenedor =
        obtenerElemento(
            "contenedorTarjetas"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (dbPersonas.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-alertas">
                <div class="sin-alertas-icono">
                    —
                </div>

                <p class="mensaje-principal">
                    No hay alertas activas
                </p>

                <p class="mensaje-secundario">
                    Usa la pestaña
                    <strong>Reportar</strong>
                    para registrar un caso.
                </p>
            </div>
        `;

        return;
    }

    dbPersonas.forEach(
        persona => {
            const tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.className =
                "tarjeta-persona";

            const fotoHTML =
                persona.foto
                    ? `
                        <img
                            src="${escaparHTML(persona.foto)}"
                            class="foto-tarjeta"
                            alt="Foto de persona registrada"
                        >
                    `
                    : "";

            const ropaHTML =
                persona.ropa
                    ? `
                        <p>
                            <strong>Ropa:</strong>
                            ${escaparHTML(
                                persona.ropa
                            )}
                        </p>
                    `
                    : "";

            const desaparicionHTML = `
                <p>
                    <strong>Desapareció:</strong>
                    ${formatearFechaDesaparicion(
                        persona.fechaDesaparicion,
                        persona.horaDesaparicion
                    )}
                </p>
            `;

            tarjeta.innerHTML = `
                ${fotoHTML}

                <div class="info-persona">

                    <h3>
                        ${escaparHTML(
                            persona.nombre
                        )}
                    </h3>

                    <p>
                        <strong>Edad:</strong>
                        ${escaparHTML(
                            persona.edad
                        )}
                        años
                    </p>

                    <p>
                        <strong>Ubicación:</strong>
                        ${escaparHTML(
                            persona.ciudad
                        )}
                    </p>

                    <p>
                        <strong>Rastro:</strong>
                        ${escaparHTML(
                            persona.zona
                        )}
                    </p>

                    ${desaparicionHTML}

                    ${ropaHTML}

                    <p class="fecha-registro">
                        <small>
                            Registrado:
                            ${formatearFechaRegistro(
                                persona.fecha
                            )}
                        </small>
                    </p>

                    <div class="acciones-persona">

                        <button
                            class="btn-editar"
                            data-id="${escaparHTML(
                                persona.id
                            )}"
                            type="button"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-eliminar"
                            data-id="${escaparHTML(
                                persona.id
                            )}"
                            type="button"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>
            `;

            contenedor.appendChild(
                tarjeta
            );
        }
    );

    document
        .querySelectorAll(
            ".btn-editar"
        )
        .forEach(
            boton => {
                boton.addEventListener(
                    "click",
                    () => {
                        abrirModalEditar(
                            boton.dataset.id
                        );
                    }
                );
            }
        );

    document
        .querySelectorAll(
            ".btn-eliminar"
        )
        .forEach(
            boton => {
                boton.addEventListener(
                    "click",
                    () => {
                        eliminarPersona(
                            boton.dataset.id
                        );
                    }
                );
            }
        );
}

/* =========================================================
ELIMINAR PERSONA
========================================================= */

function eliminarPersona(id) {
    const persona =
        dbPersonas.find(
            p => p.id === id
        );

    if (!persona) {
        return;
    }

    const confirmar =
        confirm(
            `¿Seguro que deseas eliminar el registro de ${persona.nombre}?`
        );

    if (!confirmar) {
        return;
    }

    dbPersonas =
        dbPersonas.filter(
            p => p.id !== id
        );

    if (!guardarPersonas()) {
        return;
    }

    actualizarContadoresZonas();

    cargarAlertasInicio();

    cargarZonas();

    alert(
        "El registro ha sido eliminado correctamente."
    );
}

/* =========================================================
MODAL EDITAR
========================================================= */

const modalEditar =
    obtenerElemento(
        "modalEditar"
    );

const formEditar =
    obtenerElemento(
        "formEditar"
    );

const btnCerrarModal =
    obtenerElemento(
        "btnCerrarModal"
    );

function abrirModalEditar(id) {
    if (!terminosAceptados()) {
        abrirTerminos(true);
        return;
    }

    const persona =
        dbPersonas.find(
            p => p.id === id
        );

    if (!persona) {
        return;
    }

    personaEditandoId = id;

    const editarNombre =
        obtenerElemento(
            "editarNombre"
        );

    const editarEdad =
        obtenerElemento(
            "editarEdad"
        );

    const editarCiudad =
        obtenerElemento(
            "editarCiudad"
        );

    const editarZona =
        obtenerElemento(
            "editarZona"
        );

    const editarRopa =
        obtenerElemento(
            "editarRopa"
        );

    if (
        !editarNombre ||
        !editarEdad ||
        !editarCiudad ||
        !editarZona ||
        !editarRopa
    ) {
        console.error(
            "Faltan campos del formulario de edición."
        );

        return;
    }

    editarNombre.value =
        persona.nombre || "";

    editarEdad.value =
        persona.edad ?? "";

    editarCiudad.value =
        persona.ciudad || "";

    editarZona.value =
        persona.zona || "";

    editarRopa.value =
        persona.ropa || "";

    if (modalEditar) {
        modalEditar.classList.remove(
            "oculto"
        );
    }
}

function cerrarModalEditar() {
    personaEditandoId = null;

    if (modalEditar) {
        modalEditar.classList.add(
            "oculto"
        );
    }
}

if (btnCerrarModal) {
    btnCerrarModal.addEventListener(
        "click",
        cerrarModalEditar
    );
}

if (modalEditar) {
    modalEditar.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                modalEditar
            ) {
                cerrarModalEditar();
            }
        }
    );
}

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            modalEditar &&
            !modalEditar.classList.contains(
                "oculto"
            )
        ) {
            cerrarModalEditar();
        }
    }
);

/* =========================================================
GUARDAR CAMBIOS
========================================================= */

if (formEditar) {
    formEditar.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!personaEditandoId) {
                return;
            }

            const persona =
                dbPersonas.find(
                    p =>
                        p.id ===
                        personaEditandoId
                );

            if (!persona) {
                return;
            }

            const editarNombre =
                obtenerElemento(
                    "editarNombre"
                );

            const editarEdad =
                obtenerElemento(
                    "editarEdad"
                );

            const editarCiudad =
                obtenerElemento(
                    "editarCiudad"
                );

            const editarZona =
                obtenerElemento(
                    "editarZona"
                );

            const editarRopa =
                obtenerElemento(
                    "editarRopa"
                );

            if (
                !editarNombre ||
                !editarEdad ||
                !editarCiudad ||
                !editarZona ||
                !editarRopa
            ) {
                alert(
                    "No se encontraron todos los campos del formulario."
                );

                return;
            }

            const nombre =
                editarNombre.value.trim();

            const edad =
                parseInt(
                    editarEdad.value,
                    10
                );

            const ciudad =
                editarCiudad.value.trim();

            const zona =
                editarZona.value.trim();

            const ropa =
                editarRopa.value.trim();

            if (
                !nombre ||
                !Number.isInteger(
                    edad
                ) ||
                edad < 0 ||
                edad > 120 ||
                !ciudad ||
                !zona
            ) {
                alert(
                    "Revisa los datos ingresados."
                );

                return;
            }

            const datosAnteriores = {
                nombre:
                    persona.nombre,

                edad:
                    persona.edad,

                ciudad:
                    persona.ciudad,

                zona:
                    persona.zona,

                ropa:
                    persona.ropa
            };

            persona.nombre =
                nombre;

            persona.edad =
                edad;

            persona.ciudad =
                ciudad;

            persona.zona =
                zona;

            persona.ropa =
                ropa;

            if (!guardarPersonas()) {
                persona.nombre =
                    datosAnteriores.nombre;

                persona.edad =
                    datosAnteriores.edad;

                persona.ciudad =
                    datosAnteriores.ciudad;

                persona.zona =
                    datosAnteriores.zona;

                persona.ropa =
                    datosAnteriores.ropa;

                return;
            }

            actualizarContadoresZonas();

            cargarAlertasInicio();

            cargarZonas();

            cerrarModalEditar();

            alert(
                "Los cambios se guardaron correctamente."
            );
        }
    );
}

/* =========================================================
CONFIGURACIÓN DE TEMA
========================================================= */

const opcionesTema =
    document.querySelectorAll(
        ".tema-opcion"
    );

function aplicarTema(tema) {
    const temaValido =
        tema === "oscuro"
            ? "oscuro"
            : "claro";

    document.body.classList.toggle(
        "modo-oscuro",
        temaValido === "oscuro"
    );

    opcionesTema.forEach(
        opcion => {
            opcion.classList.toggle(
                "seleccionado",
                opcion.dataset.tema ===
                    temaValido
            );
        }
    );

    try {
        localStorage.setItem(
            STORAGE_TEMA,
            temaValido
        );
    } catch (error) {
        console.warn(
            "No se pudo guardar el tema.",
            error
        );
    }
}

opcionesTema.forEach(
    opcion => {
        opcion.addEventListener(
            "click",
            () => {
                aplicarTema(
                    opcion.dataset.tema
                );
            }
        );
    }
);

let temaGuardado = "claro";

try {
    temaGuardado =
        localStorage.getItem(
            STORAGE_TEMA
        ) || "claro";
} catch (error) {
    console.warn(
        "No se pudo leer el tema guardado.",
        error
    );
}

aplicarTema(
    temaGuardado
);

/* =========================================================
CUENTA
========================================================= */

const btnGoogle =
    obtenerElemento(
        "btnGoogle"
    );

const btnApple =
    obtenerElemento(
        "btnApple"
    );

const btnCerrarSesion =
    obtenerElemento(
        "btnCerrarSesion"
    );

const cuentaTexto =
    document.querySelector(
        ".cuenta-texto"
    );

function mostrarCuentaConectada(
    proveedor
) {
    if (
        proveedor !== "Google" &&
        proveedor !== "Apple"
    ) {
        return;
    }

    if (cuentaTexto) {
        cuentaTexto.innerHTML = `
            <strong>
                Cuenta conectada
            </strong>

            <span>
                Sesión iniciada con
                ${escaparHTML(proveedor)}.
            </span>
        `;
    }

    if (btnGoogle) {
        btnGoogle.classList.add(
            "oculto"
        );
    }

    if (btnApple) {
        btnApple.classList.add(
            "oculto"
        );
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.classList.remove(
            "oculto"
        );
    }

    try {
        localStorage.setItem(
            STORAGE_CUENTA,
            proveedor
        );
    } catch (error) {
        console.warn(
            "No se pudo guardar la cuenta.",
            error
        );
    }
}

function cerrarSesion() {
    try {
        localStorage.removeItem(
            STORAGE_CUENTA
        );
    } catch (error) {
        console.warn(
            "No se pudo cerrar la sesión guardada.",
            error
        );
    }

    terminosAceptadosEnSesion = false;

    if (cuentaTexto) {
        cuentaTexto.innerHTML = `
            <strong>
                Inicia sesión en Find Me
            </strong>

            <span>
                Guarda tu información en este dispositivo.
            </span>
        `;
    }

    if (btnGoogle) {
        btnGoogle.classList.remove(
            "oculto"
        );
    }

    if (btnApple) {
        btnApple.classList.remove(
            "oculto"
        );
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.classList.add(
            "oculto"
        );
    }
}

if (btnGoogle) {
    btnGoogle.addEventListener(
        "click",
        () => {
            mostrarCuentaConectada(
                "Google"
            );
        }
    );
}

if (btnApple) {
    btnApple.addEventListener(
        "click",
        () => {
            mostrarCuentaConectada(
                "Apple"
            );
        }
    );
}

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener(
        "click",
        () => {
            cerrarSesion();

            alert(
                "Has cerrado sesión. Debes volver a aceptar los términos para continuar."
            );

            abrirTerminos(true);
        }
    );
}

let cuentaGuardada = null;

try {
    cuentaGuardada =
        localStorage.getItem(
            STORAGE_CUENTA
        );
} catch (error) {
    console.warn(
        "No se pudo leer la cuenta guardada.",
        error
    );
}

if (
    cuentaGuardada === "Google" ||
    cuentaGuardada === "Apple"
) {
    mostrarCuentaConectada(
        cuentaGuardada
    );
}

/* =========================================================
PREVISUALIZACIÓN DE FOTOS
========================================================= */

function configurarPreviewFoto(
    inputId,
    previewId
) {
    const input =
        obtenerElemento(inputId);

    const preview =
        obtenerElemento(previewId);

    if (!input || !preview) {
        return;
    }

    input.addEventListener(
        "change",
        () => {
            const archivo =
                input.files &&
                input.files[0];

            if (!archivo) {
                preview.textContent =
                    "Sin imagen seleccionada";

                return;
            }

            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {
                input.value = "";

                preview.textContent =
                    "Selecciona un archivo de imagen válido.";

                return;
            }

            if (
                archivo.size >
                MAX_IMAGEN_BYTES
            ) {
                input.value = "";

                preview.textContent =
                    `La imagen supera el límite de ${MAX_IMAGEN_MB} MB.`;

                alert(
                    `La imagen es demasiado grande. El límite es ${MAX_IMAGEN_MB} MB.`
                );

                return;
            }

            const lector =
                new FileReader();

            lector.onload =
                event => {
                    preview.innerHTML =
                        "";

                    const imagen =
                        document.createElement(
                            "img"
                        );

                    imagen.src =
                        event.target.result;

                    imagen.alt =
                        "Vista previa de imagen";

                    preview.appendChild(
                        imagen
                    );
                };

            lector.onerror =
                () => {
                    preview.textContent =
                        "No fue posible cargar la vista previa.";
                };

            lector.readAsDataURL(
                archivo
            );
        }
    );
}

configurarPreviewFoto(
    "fotoDesaparecido",
    "previewDesaparecido"
);

configurarPreviewFoto(
    "fotoEncontrado",
    "previewEncontrado"
);

configurarPreviewFoto(
    "repFoto",
    "previewRepFoto"
);

/* =========================================================
FORMULARIO REPORTAR
========================================================= */

const formReportar =
    obtenerElemento(
        "formReportar"
    );

if (formReportar) {
    formReportar.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!terminosAceptados()) {
                abrirTerminos(true);
                return;
            }

            const repNombre =
                obtenerElemento(
                    "repNombre"
                );

            const repEdad =
                obtenerElemento(
                    "repEdad"
                );

            const repCiudad =
                obtenerElemento(
                    "repCiudad"
                );

            const repSector =
                obtenerElemento(
                    "repSector"
                );

            const repFechaDesaparicion =
                obtenerElemento(
                    "repFechaDesaparicion"
                );

            const repHoraDesaparicion =
                obtenerElemento(
                    "repHoraDesaparicion"
                );

            const repRopa =
                obtenerElemento(
                    "repRopa"
                );

            const fotoInput =
                obtenerElemento(
                    "repFoto"
                );

            if (
                !repNombre ||
                !repEdad ||
                !repCiudad ||
                !repSector ||
                !repFechaDesaparicion ||
                !repHoraDesaparicion ||
                !repRopa ||
                !fotoInput
            ) {
                alert(
                    "Faltan elementos del formulario de reporte."
                );

                return;
            }

            const nombre =
                repNombre.value.trim();

            const edad =
                parseInt(
                    repEdad.value,
                    10
                );

            const ciudad =
                repCiudad.value.trim();

            const zona =
                repSector.value.trim();

            const fechaDesaparicion =
                repFechaDesaparicion.value;

            const horaDesaparicion =
                repHoraDesaparicion.value;

            const ropa =
                repRopa.value.trim();

            const archivo =
                fotoInput.files &&
                fotoInput.files[0];

            if (
                !nombre ||
                !Number.isInteger(edad) ||
                edad < 0 ||
                edad > 120 ||
                !ciudad ||
                !zona ||
                !fechaDesaparicion ||
                !horaDesaparicion ||
                !archivo
            ) {
                alert(
                    "Completa correctamente todos los campos obligatorios."
                );

                return;
            }

            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {
                alert(
                    "Selecciona una imagen válida."
                );

                return;
            }

            if (
                archivo.size >
                MAX_IMAGEN_BYTES
            ) {
                alert(
                    `La imagen supera el límite de ${MAX_IMAGEN_MB} MB.`
                );

                return;
            }

            const lector =
                new FileReader();

            lector.onload =
                event => {
                    if (
                        !event.target ||
                        !event.target.result
                    ) {
                        alert(
                            "No se pudo procesar la imagen."
                        );

                        return;
                    }

                    const nuevaPersona = {
                        id:
                            `${Date.now()}-${Math.random()
                                .toString(36)
                                .slice(2, 8)}`,

                        nombre:
                            nombre,

                        edad:
                            edad,

                        ciudad:
                            ciudad,

                        zona:
                            zona,

                        fechaDesaparicion:
                            fechaDesaparicion,

                        horaDesaparicion:
                            horaDesaparicion,

                        ropa:
                            ropa,

                        foto:
                            event.target.result,

                        fecha:
                            new Date().toISOString()
                    };

                    dbPersonas.push(
                        nuevaPersona
                    );

                    if (
                        !guardarPersonas()
                    ) {
                        dbPersonas.pop();
                        return;
                    }

                    agregarNotificacion();

                    actualizarContadoresZonas();

                    cargarAlertasInicio();

                    cargarZonas();

                    formReportar.reset();

                    const preview =
                        obtenerElemento(
                            "previewRepFoto"
                        );

                    if (preview) {
                        preview.innerHTML =
                            "";

                        preview.textContent =
                            "No se ha subido foto";
                    }

                    alert(
                        "La alerta se publicó correctamente."
                    );

                    cambiarPantalla(
                        "pantalla-inicio"
                    );
                };

            lector.onerror =
                () => {
                    alert(
                        "No fue posible leer la imagen seleccionada."
                    );
                };

            lector.readAsDataURL(
                archivo
            );
        }
    );
}

/* =========================================================
ZONAS
========================================================= */

function cargarZonas(
    filtro = ""
) {
    const lista =
        obtenerElemento(
            "lista-regiones"
        );

    if (!lista) {
        return;
    }

    actualizarContadoresZonas();

    lista.innerHTML = "";

    const filtroNormalizado =
        String(filtro)
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    const zonasFiltradas =
        dbZonasDelPais.filter(
            zona => {
                const texto =
                    `${zona.nombre} ${zona.descripcion}`
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(
                            /[\u0300-\u036f]/g,
                            ""
                        );

                return texto.includes(
                    filtroNormalizado
                );
            }
        );

    if (
        zonasFiltradas.length === 0
    ) {
        lista.innerHTML = `
            <div class="item-zona">
                <span>
                    No se encontraron zonas.
                </span>
            </div>
        `;

        return;
    }

    zonasFiltradas.forEach(
        zona => {
            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "item-zona";

            item.innerHTML = `
                <div>

                    <strong>
                        ${escaparHTML(
                            zona.nombre
                        )}
                    </strong>

                    <div style="
                        font-size: 11px;
                        color: var(--texto-suave);
                        margin-top: 3px;
                    ">
                        ${escaparHTML(
                            zona.descripcion
                        )}
                    </div>

                </div>

                <span class="badge-casos">
                    ${zona.casos}
                    ${
                        zona.casos === 1
                            ? "caso"
                            : "casos"
                    }
                </span>
            `;

            lista.appendChild(
                item
            );
        }
    );
}

const inputBuscarZona =
    obtenerElemento(
        "inputBuscarZona"
    );

if (inputBuscarZona) {
    inputBuscarZona.addEventListener(
        "input",
        () => {
            cargarZonas(
                inputBuscarZona.value
            );
        }
    );
}

/* =========================================================
GEOLOCALIZACIÓN
========================================================= */

function inicializarGeolocalizacionYZonas() {
    if (geolocalizacionInicializada) {
        return;
    }

    if (!terminosAceptados()) {
        return;
    }

    cargarZonas();

    const ubicacion =
        obtenerElemento(
            "ubicacion-dispositivo"
        );

    if (!ubicacion) {
        geolocalizacionInicializada =
            true;

        return;
    }

    if (
        !navigator.geolocation
    ) {
        ubicacion.textContent =
            "La geolocalización no está disponible.";

        geolocalizacionInicializada =
            true;

        return;
    }

    geolocalizacionInicializada =
        true;

    navigator.geolocation.getCurrentPosition(
        posicion => {
            const lat =
                posicion.coords.latitude;

            const lon =
                posicion.coords.longitude;

            ubicacion.textContent =
                `Ubicación detectada · ${lat.toFixed(
                    3
                )}, ${lon.toFixed(3)}`;
        },

        () => {
            ubicacion.textContent =
                "No fue posible detectar tu ubicación.";
        },

        {
            enableHighAccuracy:
                false,

            timeout:
                10000,

            maximumAge:
                300000
        }
    );
}

/* =========================================================
ESCÁNER
========================================================= */

const btnIniciarEscaneo =
    obtenerElemento(
        "btnIniciarEscaneo"
    );

const radarEscaner =
    obtenerElemento(
        "radar-escaner"
    );

const resultadoAnalisis =
    obtenerElemento(
        "resultado-analisis"
    );

const barraLlenado =
    obtenerElemento(
        "barra-llenado"
    );

const textoCoincidencia =
    obtenerElemento(
        "texto-coincidencia"
    );

const detallesBiometricos =
    obtenerElemento(
        "detalles-biometricos"
    );

if (btnIniciarEscaneo) {
    btnIniciarEscaneo.addEventListener(
        "click",
        () => {
            if (!terminosAceptados()) {
                abrirTerminos(true);
                return;
            }

            const foto1 =
                obtenerElemento(
                    "fotoDesaparecido"
                );

            const foto2 =
                obtenerElemento(
                    "fotoEncontrado"
                );

            if (
                !foto1 ||
                !foto2
            ) {
                alert(
                    "No se encontraron los campos de imágenes del escáner."
                );

                return;
            }

            if (
                !foto1.files ||
                !foto2.files ||
                !foto1.files[0] ||
                !foto2.files[0]
            ) {
                alert(
                    "Selecciona las dos imágenes antes de iniciar el análisis."
                );

                return;
            }

            if (resultadoAnalisis) {
                resultadoAnalisis.classList.add(
                    "oculto"
                );
            }

            if (barraLlenado) {
                barraLlenado.style.width =
                    "0%";
            }

            if (radarEscaner) {
                radarEscaner.classList.remove(
                    "oculto"
                );
            }

            btnIniciarEscaneo.disabled =
                true;

            setTimeout(
                () => {
                    if (radarEscaner) {
                        radarEscaner.classList.add(
                            "oculto"
                        );
                    }

                    const porcentaje =
                        Math.floor(
                            Math.random() * 21
                        ) + 75;

                    if (resultadoAnalisis) {
                        resultadoAnalisis.classList.remove(
                            "oculto"
                        );
                    }

                    if (barraLlenado) {
                        barraLlenado.style.width =
                            `${porcentaje}%`;
                    }

                    if (
                        textoCoincidencia
                    ) {
                        textoCoincidencia.textContent =
                            `Coincidencia simulada: ${porcentaje}%`;
                    }

                    if (
                        detallesBiometricos
                    ) {
                        detallesBiometricos.textContent =
                            "Este resultado es simulado y no constituye un reconocimiento facial real ni una identificación oficial. Una implementación real requiere tecnología especializada, medidas de seguridad y las autorizaciones correspondientes.";
                    }

                    btnIniciarEscaneo.disabled =
                        false;
                },
                2500
            );
        }
    );
}

/* =========================================================
BOTÓN PERFIL
========================================================= */

const btnPerfil =
    obtenerElemento(
        "btnPerfil"
    );

if (btnPerfil) {
    btnPerfil.addEventListener(
        "click",
        () => {
            cambiarPantalla(
                "pantalla-configuracion"
            );
        }
    );
}

/* =========================================================
BOTÓN NOTIFICACIONES
========================================================= */

const btnNotificaciones =
    obtenerElemento(
        "btnNotificaciones"
    );

if (btnNotificaciones) {
    btnNotificaciones.addEventListener(
        "click",
        () => {
            if (!terminosAceptados()) {
                abrirTerminos(true);
                return;
            }

            const total =
                obtenerNotificaciones();

            if (total === 0) {
                alert(
                    "No tienes nuevas notificaciones."
                );

                return;
            }

            alert(
                `Tienes ${total} ${
                    total === 1
                        ? "notificación"
                        : "notificaciones"
                } nueva${
                    total === 1
                        ? ""
                        : "s"
                }.`
            );

            limpiarNotificaciones();
        }
    );
}

/* =========================================================
INICIALIZACIÓN
========================================================= */

actualizarContadorNotificaciones(
    obtenerNotificaciones()
);

actualizarContadoresZonas();

cargarAlertasInicio();

if (terminosAceptados()) {
    inicializarGeolocalizacionYZonas();
} else {
    abrirTerminos(true);
}
