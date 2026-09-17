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
const STORAGE_IDIOMA = "findme-idioma";
const STORAGE_PAIS = "findme-pais";
const STORAGE_CIUDAD = "findme-ciudad";

const MAX_IMAGEN_MB = 3;
const MAX_IMAGEN_BYTES = MAX_IMAGEN_MB * 1024 * 1024;

const MODEL_URL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

const COUNTRIES_API =
    "https://countriesnow.space/api/v0.1/countries/cities";

const REVERSE_GEOCODING_API =
    "https://api.bigdatacloud.net/data/reverse-geocode-client";

const IDIOMAS_VALIDOS = [
    "es",
    "en",
    "pt",
    "fr",
    "it",
    "de"
];

/*
 * Para OAuth real debes colocar aquí los datos
 * proporcionados por Google y Apple.
 *
 * No se inventan Client IDs.
 */
const GOOGLE_CLIENT_ID = "";
const APPLE_CLIENT_ID = "";
const APPLE_REDIRECT_URI =
    window.location.origin +
    window.location.pathname;


/* =========================================================
   VARIABLES
   ========================================================= */

let personaEditandoId = null;
let terminosAceptadosEnSesion = false;
let geolocalizacionInicializada = false;

let paisDetectado =
    localStorage.getItem(STORAGE_PAIS) || "";

let ciudadDetectada =
    localStorage.getItem(STORAGE_CIUDAD) || "";

let ciudadesDelPais = [];

let vistaZonas = "ciudades";
let ciudadSeleccionada = null;
let sectorSeleccionado = null;

let modelosFacialesCargados = false;
let cargandoModelosFaciales = null;

let dbPersonas = cargarPersonasGuardadas();

let idiomaActual =
    obtenerIdiomaGuardado() || "";


/* =========================================================
   TRADUCCIONES
   ========================================================= */

const TRADUCCIONES = {

    es: {
        configuracionInicial:
            "CONFIGURACIÓN INICIAL",

        seleccionarIdioma:
            "Selecciona tu idioma",

        elegirIdioma:
            "Elige el idioma que utilizarás en Find Me.",

        sinInternet:
            "Sin conexión a Internet",

        sinInternetMensaje:
            "No se ha detectado una conexión a Internet. Find Me necesita Internet para funcionar.",

        reintentar:
            "Reintentar conexión",

        inicio:
            "Inicio",

        zonas:
            "Zonas",

        escaner:
            "Escáner",

        reportar:
            "Reportar",

        configuracion:
            "Configuración",

        personasRegistradas:
            "Personas registradas",

        noHayAlertas:
            "No hay alertas activas",

        usaReportar:
            "Usa la pestaña Reportar para registrar un caso.",

        cobertura:
            "Cobertura nacional",

        detectando:
            "Detectando tu ubicación...",

        buscarZona:
            "Buscar ciudad, provincia o zona...",

        analisisFacial:
            "Análisis facial",

        compararImagenes:
            "Compara dos imágenes para detectar similitudes",

        personaDesaparecida:
            "1. Persona desaparecida",

        personaAvistada:
            "2. Persona avistada",

        sinImagen:
            "Sin imagen seleccionada",

        iniciarAnalisis:
            "Iniciar análisis comparativo",

        analizando:
            "Analizando puntos faciales y estructuras de referencia...",

        resultado:
            "Resultado de comparación",

        reportarDesaparicion:
            "Reportar desaparición",

        registrarCaso:
            "Registra un caso para alertar a la comunidad",

        nombres:
            "Nombres y apellidos",

        edad:
            "Edad",

        ciudad:
            "Ciudad",

        sector:
            "Sector / Último rastro",

        fechaDesaparicion:
            "Fecha de desaparición",

        horaDesaparicion:
            "Hora de desaparición",

        vestimenta:
            "Vestimenta / Ropa",

        fotoPersona:
            "Foto de la persona",

        publicarAlerta:
            "Publicar alerta",

        configuracionTitulo:
            "Configuración",

        personaliza:
            "Personaliza tu cuenta y la apariencia de la aplicación",

        tuCuenta:
            "Tu cuenta",

        iniciaSesion:
            "Inicia sesión para guardar tus datos y casos.",

        iniciarFindMe:
            "Inicia sesión en Find Me",

        guardaInformacion:
            "Guarda tu información en este dispositivo.",

        google:
            "Continuar con Google",

        apple:
            "Continuar con Apple",

        cerrarSesion:
            "Cerrar sesión",

        apariencia:
            "Apariencia",

        seleccionaComo:
            "Selecciona cómo quieres ver Find Me",

        modoClaro:
            "Modo claro",

        modoClaroDesc:
            "Morado, blanco y gris",

        modoOscuro:
            "Modo oscuro",

        modoOscuroDesc:
            "Morado, negro y gris",

        idioma:
            "Idioma",

        cambiaIdioma:
            "Cambia el idioma de Find Me",

        cambiarIdioma:
            "Cambiar idioma",

        privacidad:
            "Privacidad y seguridad",

        consultaTerminos:
            "Consulta los términos y cómo se utiliza la información en Find Me.",

        verTerminos:
            "Ver términos y privacidad",

        preferencia:
            "Preferencia guardada",

        preferenciaDesc:
            "Find Me recordará el modo que elegiste.",

        editarRegistro:
            "Editar registro",

        modificaDatos:
            "Modifica los datos de la persona registrada.",

        guardarCambios:
            "Guardar cambios",

        terminos:
            "Términos y condiciones",

        aceptarContinuar:
            "Aceptar y continuar",

        cerrar:
            "Cerrar",

        obligatorio:
            "Debes aceptar estas condiciones para continuar utilizando Find Me.",

        registrarPerfil:
            "Crear perfil",

        completarPerfil:
            "Completa tus datos para personalizar Find Me.",

        nombreUsuario:
            "Nombre de usuario",

        correo:
            "Correo electrónico",

        contrasena:
            "Contraseña",

        fotoPerfil:
            "Foto de perfil",

        opcional:
            "(opcional)",

        guardarPerfil:
            "Guardar perfil",

        sinFoto:
            "Sin foto de perfil",

        casos:
            "casos",

        caso:
            "caso",

        volver:
            "Volver",

        personas:
            "Personas",

        noCasosSector:
            "No hay casos registrados en este sector.",

        noCiudades:
            "No se encontraron ciudades.",

        noSectores:
            "No se encontraron sectores.",

        noPersonas:
            "No se encontraron personas.",

        registrado:
            "Registrado",

        desaparecio:
            "Desapareció",

        rastro:
            "Rastro",

        ropa:
            "Ropa",

        editar:
            "Editar",

        eliminar:
            "Eliminar",

        noNotificaciones:
            "No tienes nuevas notificaciones.",

        notificacion:
            "notificación",

        notificaciones:
            "notificaciones",

        alertaPublicada:
            "La alerta se publicó correctamente.",

        cambiosGuardados:
            "Los cambios se guardaron correctamente.",

        registroEliminado:
            "El registro ha sido eliminado correctamente.",

        confirmarEliminar:
            "¿Seguro que deseas eliminar el registro de",

        ubicacionDetectada:
            "Ubicación detectada",

        ubicacionNoDetectada:
            "No fue posible detectar tu ubicación.",

        geolocalizacionNoDisponible:
            "La geolocalización no está disponible.",

        cargandoCiudades:
            "Cargando ciudades de tu país...",

        sinPais:
            "No fue posible determinar tu país.",

        altaSimilitud:
            "Alta similitud facial",

        similitudModerada:
            "Similitud facial moderada",

        bajaSimilitud:
            "Baja similitud facial",

        similitud:
            "Similitud facial estimada",

        noPersona:
            "No se ha identificado una persona en la imagen.",

        variasPersonas:
            "Se identificaron varias personas en la imagen. Usa una fotografía donde aparezca una sola persona.",

        errorModelo:
            "No se pudo cargar el sistema de análisis facial. Verifica tu conexión a Internet.",

        escanerApoyo:
            "Este resultado es una estimación de similitud facial y no constituye una identificación oficial. Puede contener falsos positivos o falsos negativos.",

        seleccionaDos:
            "Selecciona las dos imágenes antes de iniciar el análisis.",

        cuentaOAuthNoConfigurada:
            "El inicio de sesión real con este proveedor todavía necesita configurarse con sus credenciales oficiales.",

        conexionRequerida:
            "Se necesita conexión a Internet para utilizar esta función.",

        cuentaGuardada:
            "Cuenta conectada",

        sesionProveedor:
            "Sesión iniciada con",

        avatarInicial:
            "Usuario"
    },


    en: {
        configuracionInicial:
            "INITIAL SETUP",

        seleccionarIdioma:
            "Select your language",

        elegirIdioma:
            "Choose the language you will use in Find Me.",

        sinInternet:
            "No Internet connection",

        sinInternetMensaje:
            "No Internet connection was detected. Find Me needs Internet to work.",

        reintentar:
            "Retry connection",

        inicio:
            "Home",

        zonas:
            "Zones",

        escaner:
            "Scanner",

        reportar:
            "Report",

        configuracion:
            "Settings",

        personasRegistradas:
            "Registered people",

        noHayAlertas:
            "No active alerts",

        usaReportar:
            "Use the Report tab to register a case.",

        cobertura:
            "National coverage",

        detectando:
            "Detecting your location...",

        buscarZona:
            "Search city, province or area...",

        analisisFacial:
            "Facial analysis",

        compararImagenes:
            "Compare two images to detect similarities",

        personaDesaparecida:
            "1. Missing person",

        personaAvistada:
            "2. Sighted person",

        sinImagen:
            "No image selected",

        iniciarAnalisis:
            "Start comparative analysis",

        analizando:
            "Analyzing facial points and reference structures...",

        resultado:
            "Comparison result",

        reportarDesaparicion:
            "Report disappearance",

        registrarCaso:
            "Register a case to alert the community",

        nombres:
            "Full name",

        edad:
            "Age",

        ciudad:
            "City",

        sector:
            "Area / Last known location",

        fechaDesaparicion:
            "Date of disappearance",

        horaDesaparicion:
            "Time of disappearance",

        vestimenta:
            "Clothing",

        fotoPersona:
            "Person's photo",

        publicarAlerta:
            "Publish alert",

        configuracionTitulo:
            "Settings",

        personaliza:
            "Customize your account and app appearance",

        tuCuenta:
            "Your account",

        iniciaSesion:
            "Sign in to save your data and cases.",

        iniciarFindMe:
            "Sign in to Find Me",

        guardaInformacion:
            "Save your information on this device.",

        google:
            "Continue with Google",

        apple:
            "Continue with Apple",

        cerrarSesion:
            "Sign out",

        apariencia:
            "Appearance",

        seleccionaComo:
            "Choose how you want to view Find Me",

        modoClaro:
            "Light mode",

        modoClaroDesc:
            "Purple, white and gray",

        modoOscuro:
            "Dark mode",

        modoOscuroDesc:
            "Purple, black and gray",

        idioma:
            "Language",

        cambiaIdioma:
            "Change the Find Me language",

        cambiarIdioma:
            "Change language",

        privacidad:
            "Privacy and security",

        consultaTerminos:
            "View the terms and how information is used in Find Me.",

        verTerminos:
            "View terms and privacy",

        preferencia:
            "Preference saved",

        preferenciaDesc:
            "Find Me will remember the mode you selected.",

        editarRegistro:
            "Edit record",

        modificaDatos:
            "Modify the registered person's information.",

        guardarCambios:
            "Save changes",

        terminos:
            "Terms and conditions",

        aceptarContinuar:
            "Accept and continue",

        cerrar:
            "Close",

        obligatorio:
            "You must accept these conditions to continue using Find Me.",

        registrarPerfil:
            "Create profile",

        completarPerfil:
            "Complete your information to personalize Find Me.",

        nombreUsuario:
            "Username",

        correo:
            "Email",

        contrasena:
            "Password",

        fotoPerfil:
            "Profile photo",

        opcional:
            "(optional)",

        guardarPerfil:
            "Save profile",

        sinFoto:
            "No profile photo",

        casos:
            "cases",

        caso:
            "case",

        volver:
            "Back",

        personas:
            "People",

        noCasosSector:
            "There are no cases registered in this area.",

        noCiudades:
            "No cities found.",

        noSectores:
            "No areas found.",

        noPersonas:
            "No people found.",

        registrado:
            "Registered",

        desaparecio:
            "Disappeared",

        rastro:
            "Last known location",

        ropa:
            "Clothing",

        editar:
            "Edit",

        eliminar:
            "Delete",

        noNotificaciones:
            "You have no new notifications.",

        notificacion:
            "notification",

        notificaciones:
            "notifications",

        alertaPublicada:
            "The alert was published successfully.",

        cambiosGuardados:
            "The changes were saved successfully.",

        registroEliminado:
            "The record was deleted successfully.",

        confirmarEliminar:
            "Are you sure you want to delete the record of",

        ubicacionDetectada:
            "Location detected",

        ubicacionNoDetectada:
            "Your location could not be detected.",

        geolocalizacionNoDisponible:
            "Geolocation is not available.",

        cargandoCiudades:
            "Loading cities from your country...",

        sinPais:
            "Your country could not be determined.",

        altaSimilitud:
            "High facial similarity",

        similitudModerada:
            "Moderate facial similarity",

        bajaSimilitud:
            "Low facial similarity",

        similitud:
            "Estimated facial similarity",

        noPersona:
            "No person was identified in the image.",

        variasPersonas:
            "Multiple people were identified in the image. Use a photo containing only one person.",

        errorModelo:
            "The facial analysis system could not be loaded. Check your Internet connection.",

        escanerApoyo:
            "This result is an estimated facial similarity and is not an official identification. False positives and false negatives are possible.",

        seleccionaDos:
            "Select both images before starting the analysis.",

        cuentaOAuthNoConfigurada:
            "Real sign-in with this provider still needs to be configured with its official credentials.",

        conexionRequerida:
            "An Internet connection is required for this feature.",

        cuentaGuardada:
            "Connected account",

        sesionProveedor:
            "Signed in with",

        avatarInicial:
            "User"
    },


    pt: {
        configuracionInicial:
            "CONFIGURAÇÃO INICIAL",

        seleccionarIdioma:
            "Selecione seu idioma",

        elegirIdioma:
            "Escolha o idioma que você usará no Find Me.",

        sinInternet:
            "Sem conexão com a Internet",

        sinInternetMensaje:
            "Nenhuma conexão com a Internet foi detectada. O Find Me precisa de Internet para funcionar.",

        reintentar:
            "Tentar novamente",

        inicio:
            "Início",

        zonas:
            "Zonas",

        escaner:
            "Scanner",

        reportar:
            "Relatar",

        configuracion:
            "Configurações",

        personasRegistradas:
            "Pessoas registradas",

        cobertura:
            "Cobertura nacional",

        detectando:
            "Detectando sua localização...",

        buscarZona:
            "Pesquisar cidade, província ou área...",

        analisisFacial:
            "Análise facial",

        compararImagenes:
            "Compare duas imagens para detectar semelhanças",

        personaDesaparecida:
            "1. Pessoa desaparecida",

        personaAvistada:
            "2. Pessoa avistada",

        sinImagen:
            "Nenhuma imagem selecionada",

        iniciarAnalisis:
            "Iniciar análise comparativa",

        analizando:
            "Analisando pontos faciais e estruturas de referência...",

        resultado:
            "Resultado da comparação",

        reportarDesaparicion:
            "Relatar desaparecimento",

        registrarCaso:
            "Registre um caso para alertar a comunidade",

        nombres:
            "Nome completo",

        edad:
            "Idade",

        ciudad:
            "Cidade",

        sector:
            "Área / Último local conhecido",

        fechaDesaparicion:
            "Data do desaparecimento",

        horaDesaparicion:
            "Hora do desaparecimento",

        vestimenta:
            "Roupas",

        fotoPersona:
            "Foto da pessoa",

        publicarAlerta:
            "Publicar alerta",

        configuracionTitulo:
            "Configurações",

        personaliza:
            "Personalize sua conta e a aparência do aplicativo",

        tuCuenta:
            "Sua conta",

        iniciaSesion:
            "Entre para salvar seus dados e casos.",

        iniciarFindMe:
            "Entrar no Find Me",

        guardaInformacion:
            "Salve suas informações neste dispositivo.",

        google:
            "Continuar com Google",

        apple:
            "Continuar com Apple",

        cerrarSesion:
            "Sair",

        apariencia:
            "Aparência",

        seleccionaComo:
            "Escolha como deseja ver o Find Me",

        modoClaro:
            "Modo claro",

        modoClaroDesc:
            "Roxo, branco e cinza",

        modoOscuro:
            "Modo escuro",

        modoOscuroDesc:
            "Roxo, preto e cinza",

        idioma:
            "Idioma",

        cambiaIdioma:
            "Alterar o idioma do Find Me",

        cambiarIdioma:
            "Alterar idioma",

        privacidad:
            "Privacidade e segurança",

        verTerminos:
            "Ver termos e privacidade",

        preferencia:
            "Preferência salva",

        preferenciaDesc:
            "O Find Me lembrará o modo escolhido.",

        editar:
            "Editar",

        eliminar:
            "Excluir",

        caso:
            "caso",

        casos:
            "casos",

        volver:
            "Voltar",

        personas:
            "Pessoas",

        altaSimilitud:
            "Alta semelhança facial",

        similitudModerada:
            "Semelhança facial moderada",

        bajaSimilitud:
            "Baixa semelhança facial",

        similitud:
            "Semelhança facial estimada",

        noPersona:
            "Nenhuma pessoa foi identificada na imagem.",

        variasPersonas:
            "Várias pessoas foram identificadas. Use uma foto com apenas uma pessoa.",

        errorModelo:
            "Não foi possível carregar o sistema de análise facial. Verifique sua conexão com a Internet.",

        escanerApoyo:
            "Este resultado é uma estimativa de semelhança facial e não constitui uma identificação oficial.",

        seleccionaDos:
            "Selecione as duas imagens antes de iniciar a análise.",

        cuentaOAuthNoConfigurada:
            "O login real com este provedor ainda precisa ser configurado com suas credenciais oficiais."
    },


    fr: {
        configuracionInicial:
            "CONFIGURATION INITIALE",

        seleccionarIdioma:
            "Sélectionnez votre langue",

        elegirIdioma:
            "Choisissez la langue que vous utiliserez dans Find Me.",

        sinInternet:
            "Pas de connexion Internet",

        sinInternetMensaje:
            "Aucune connexion Internet n'a été détectée. Find Me a besoin d'Internet pour fonctionner.",

        reintentar:
            "Réessayer",

        inicio:
            "Accueil",

        zonas:
            "Zones",

        escaner:
            "Scanner",

        reportar:
            "Signaler",

        configuracion:
            "Paramètres",

        personasRegistradas:
            "Personnes enregistrées",

        cobertura:
            "Couverture nationale",

        detectando:
            "Détection de votre position...",

        buscarZona:
            "Rechercher une ville, une province ou une zone...",

        analisisFacial:
            "Analyse faciale",

        compararImagenes:
            "Comparez deux images pour détecter des similitudes",

        personaDesaparecida:
            "1. Personne disparue",

        personaAvistada:
            "2. Personne aperçue",

        sinImagen:
            "Aucune image sélectionnée",

        iniciarAnalisis:
            "Démarrer l'analyse comparative",

        analizando:
            "Analyse des points faciaux et des structures de référence...",

        resultado:
            "Résultat de comparaison",

        reportarDesaparicion:
            "Signaler une disparition",

        registrarCaso:
            "Enregistrez un cas pour alerter la communauté",

        nombres:
            "Nom complet",

        edad:
            "Âge",

        ciudad:
            "Ville",

        sector:
            "Zone / Dernier lieu connu",

        fechaDesaparicion:
            "Date de disparition",

        horaDesaparicion:
            "Heure de disparition",

        vestimenta:
            "Vêtements",

        fotoPersona:
            "Photo de la personne",

        publicarAlerta:
            "Publier l'alerte",

        configuracionTitulo:
            "Paramètres",

        personaliza:
            "Personnalisez votre compte et l'apparence de l'application",

        tuCuenta:
            "Votre compte",

        iniciaSesion:
            "Connectez-vous pour enregistrer vos données et vos cas.",

        iniciarFindMe:
            "Se connecter à Find Me",

        guardaInformacion:
            "Enregistrez vos informations sur cet appareil.",

        google:
            "Continuer avec Google",

        apple:
            "Continuer avec Apple",

        cerrarSesion:
            "Se déconnecter",

        apariencia:
            "Apparence",

        seleccionaComo:
            "Choisissez comment afficher Find Me",

        modoClaro:
            "Mode clair",

        modoClaroDesc:
            "Violet, blanc et gris",

        modoOscuro:
            "Mode sombre",

        modoOscuroDesc:
            "Violet, noir et gris",

        idioma:
            "Langue",

        cambiaIdioma:
            "Changer la langue de Find Me",

        cambiarIdioma:
            "Changer de langue",

        privacidad:
            "Confidentialité et sécurité",

        verTerminos:
            "Voir les conditions et la confidentialité",

        preferencia:
            "Préférence enregistrée",

        preferenciaDesc:
            "Find Me mémorisera le mode choisi.",

        editar:
            "Modifier",

        eliminar:
            "Supprimer",

        caso:
            "cas",

        casos:
            "cas",

        volver:
            "Retour",

        personas:
            "Personnes",

        altaSimilitud:
            "Forte similitude faciale",

        similitudModerada:
            "Similitude faciale modérée",

        bajaSimilitud:
            "Faible similitude faciale",

        similitud:
            "Similitude faciale estimée",

        noPersona:
            "Aucune personne n'a été identifiée dans l'image.",

        variasPersonas:
            "Plusieurs personnes ont été identifiées. Utilisez une photo avec une seule personne.",

        errorModelo:
            "Impossible de charger le système d'analyse faciale. Vérifiez votre connexion Internet.",

        escanerApoyo:
            "Ce résultat est une estimation de similitude faciale et ne constitue pas une identification officielle.",

        seleccionaDos:
            "Sélectionnez les deux images avant de commencer l'analyse.",

        cuentaOAuthNoConfigurada:
            "La connexion réelle avec ce fournisseur doit encore être configurée avec ses identifiants officiels."
    },


    it: {
        configuracionInicial:
            "CONFIGURAZIONE INIZIALE",

        seleccionarIdioma:
            "Seleziona la lingua",

        elegirIdioma:
            "Scegli la lingua che utilizzerai in Find Me.",

        sinInternet:
            "Nessuna connessione Internet",

        sinInternetMensaje:
            "Non è stata rilevata una connessione Internet. Find Me richiede Internet per funzionare.",

        reintentar:
            "Riprova",

        inicio:
            "Home",

        zonas:
            "Zone",

        escaner:
            "Scanner",

        reportar:
            "Segnala",

        configuracion:
            "Impostazioni",

        personasRegistradas:
            "Persone registrate",

        cobertura:
            "Copertura nazionale",

        detectando:
            "Rilevamento della posizione...",

        buscarZona:
            "Cerca città, provincia o zona...",

        analisisFacial:
            "Analisi facciale",

        compararImagenes:
            "Confronta due immagini per rilevare somiglianze",

        personaDesaparecida:
            "1. Persona scomparsa",

        personaAvistada:
            "2. Persona avvistata",

        sinImagen:
            "Nessuna immagine selezionata",

        iniciarAnalisis:
            "Avvia analisi comparativa",

        analizando:
            "Analisi dei punti facciali e delle strutture di riferimento...",

        resultado:
            "Risultato del confronto",

        reportarDesaparicion:
            "Segnala scomparsa",

        registrarCaso:
            "Registra un caso per avvisare la comunità",

        nombres:
            "Nome completo",

        edad:
            "Età",

        ciudad:
            "Città",

        sector:
            "Zona / Ultimo luogo conosciuto",

        fechaDesaparicion:
            "Data della scomparsa",

        horaDesaparicion:
            "Ora della scomparsa",

        vestimenta:
            "Abbigliamento",

        fotoPersona:
            "Foto della persona",

        publicarAlerta:
            "Pubblica avviso",

        configuracionTitulo:
            "Impostazioni",

        personaliza:
            "Personalizza il tuo account e l'aspetto dell'app",

        tuCuenta:
            "Il tuo account",

        iniciaSesion:
            "Accedi per salvare dati e casi.",

        iniciarFindMe:
            "Accedi a Find Me",

        guardaInformacion:
            "Salva le tue informazioni su questo dispositivo.",

        google:
            "Continua con Google",

        apple:
            "Continua con Apple",

        cerrarSesion:
            "Esci",

        apariencia:
            "Aspetto",

        seleccionaComo:
            "Scegli come visualizzare Find Me",

        modoClaro:
            "Modalità chiara",

        modoClaroDesc:
            "Viola, bianco e grigio",

        modoOscuro:
            "Modalità scura",

        modoOscuroDesc:
            "Viola, nero e grigio",

        idioma:
            "Lingua",

        cambiaIdioma:
            "Cambia la lingua di Find Me",

        cambiarIdioma:
            "Cambia lingua",

        privacidad:
            "Privacy e sicurezza",

        verTerminos:
            "Visualizza termini e privacy",

        preferencia:
            "Preferenza salvata",

        preferenciaDesc:
            "Find Me ricorderà la modalità scelta.",

        editar:
            "Modifica",

        eliminar:
            "Elimina",

        caso:
            "caso",

        casos:
            "casi",

        volver:
            "Indietro",

        personas:
            "Persone",

        altaSimilitud:
            "Elevata somiglianza facciale",

        similitudModerada:
            "Somiglianza facciale moderata",

        bajaSimilitud:
            "Bassa somiglianza facciale",

        similitud:
            "Somiglianza facciale stimata",

        noPersona:
            "Nessuna persona è stata identificata nell'immagine.",

        variasPersonas:
            "Sono state identificate più persone. Usa una foto con una sola persona.",

        errorModelo:
            "Impossibile caricare il sistema di analisi facciale. Controlla la connessione Internet.",

        escanerApoyo:
            "Questo risultato è una stima della somiglianza facciale e non costituisce un'identificazione ufficiale.",

        seleccionaDos:
            "Seleziona entrambe le immagini prima di iniziare l'analisi.",

        cuentaOAuthNoConfigurada:
            "L'accesso reale con questo provider deve ancora essere configurato con le credenziali ufficiali."
    },


    de: {
        configuracionInicial:
            "ERSTEINRICHTUNG",

        seleccionarIdioma:
            "Sprache auswählen",

        elegirIdioma:
            "Wähle die Sprache, die du in Find Me verwenden möchtest.",

        sinInternet:
            "Keine Internetverbindung",

        sinInternetMensaje:
            "Es wurde keine Internetverbindung erkannt. Find Me benötigt Internet.",

        reintentar:
            "Verbindung erneut versuchen",

        inicio:
            "Startseite",

        zonas:
            "Gebiete",

        escaner:
            "Scanner",

        reportar:
            "Melden",

        configuracion:
            "Einstellungen",

        personasRegistradas:
            "Registrierte Personen",

        cobertura:
            "Nationale Abdeckung",

        detectando:
            "Standort wird erkannt...",

        buscarZona:
            "Stadt, Provinz oder Gebiet suchen...",

        analisisFacial:
            "Gesichtsanalyse",

        compararImagenes:
            "Vergleiche zwei Bilder, um Ähnlichkeiten zu erkennen",

        personaDesaparecida:
            "1. Vermisste Person",

        personaAvistada:
            "2. Gesehene Person",

        sinImagen:
            "Kein Bild ausgewählt",

        iniciarAnalisis:
            "Vergleichsanalyse starten",

        analizando:
            "Gesichtspunkte und Referenzstrukturen werden analysiert...",

        resultado:
            "Vergleichsergebnis",

        reportarDesaparicion:
            "Vermisstenfall melden",

        registrarCaso:
            "Registriere einen Fall, um die Gemeinschaft zu informieren",

        nombres:
            "Vollständiger Name",

        edad:
            "Alter",

        ciudad:
            "Stadt",

        sector:
            "Gebiet / Letzter bekannter Ort",

        fechaDesaparicion:
            "Datum des Verschwindens",

        horaDesaparicion:
            "Zeit des Verschwindens",

        vestimenta:
            "Kleidung",

        fotoPersona:
            "Foto der Person",

        publicarAlerta:
            "Meldung veröffentlichen",

        configuracionTitulo:
            "Einstellungen",

        personaliza:
            "Passe dein Konto und das Erscheinungsbild der App an",

        tuCuenta:
            "Dein Konto",

        iniciaSesion:
            "Melde dich an, um deine Daten und Fälle zu speichern.",

        iniciarFindMe:
            "Bei Find Me anmelden",

        guardaInformacion:
            "Speichere deine Informationen auf diesem Gerät.",

        google:
            "Mit Google fortfahren",

        apple:
            "Mit Apple fortfahren",

        cerrarSesion:
            "Abmelden",

        apariencia:
            "Erscheinungsbild",

        seleccionaComo:
            "Wähle, wie Find Me angezeigt werden soll",

        modoClaro:
            "Heller Modus",

        modoClaroDesc:
            "Lila, Weiß und Grau",

        modoOscuro:
            "Dunkler Modus",

        modoOscuroDesc:
            "Lila, Schwarz und Grau",

        idioma:
            "Sprache",

        cambiaIdioma:
            "Sprache von Find Me ändern",

        cambiarIdioma:
            "Sprache ändern",

        privacidad:
            "Datenschutz und Sicherheit",

        verTerminos:
            "Bedingungen und Datenschutz anzeigen",

        preferencia:
            "Einstellung gespeichert",

        preferenciaDesc:
            "Find Me merkt sich den gewählten Modus.",

        editar:
            "Bearbeiten",

        eliminar:
            "Löschen",

        caso:
            "Fall",

        casos:
            "Fälle",

        volver:
            "Zurück",

        personas:
            "Personen",

        altaSimilitud:
            "Hohe Gesichtsähnlichkeit",

        similitudModerada:
            "Mittlere Gesichtsähnlichkeit",

        bajaSimilitud:
            "Geringe Gesichtsähnlichkeit",

        similitud:
            "Geschätzte Gesichtsähnlichkeit",

        noPersona:
            "Es wurde keine Person im Bild erkannt.",

        variasPersonas:
            "Mehrere Personen wurden erkannt. Verwende ein Foto mit nur einer Person.",

        errorModelo:
            "Das Gesichtsanalyse-System konnte nicht geladen werden. Überprüfe deine Internetverbindung.",

        escanerApoyo:
            "Dieses Ergebnis ist eine Schätzung der Gesichtsähnlichkeit und keine offizielle Identifizierung.",

        seleccionaDos:
            "Wähle beide Bilder aus, bevor du die Analyse startest.",

        cuentaOAuthNoConfigurada:
            "Die echte Anmeldung bei diesem Anbieter muss noch mit den offiziellen Zugangsdaten konfiguriert werden."
    }

};


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


function texto(key) {

    const idioma =
        TRADUCCIONES[idiomaActual] ||
        TRADUCCIONES.es;

    return idioma[key] ||
        TRADUCCIONES.es[key] ||
        key;

}


function normalizarTexto(valor) {

    return String(valor || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


function obtenerIdiomaGuardado() {

    try {

        const idioma =
            localStorage.getItem(
                STORAGE_IDIOMA
            );

        if (
            idioma &&
            IDIOMAS_VALIDOS.includes(
                idioma
            )
        ) {
            return idioma;
        }

    } catch (error) {

        console.warn(
            "No se pudo leer el idioma.",
            error
        );

    }

    return "";

}


function guardarIdioma(idioma) {

    if (
        !IDIOMAS_VALIDOS.includes(
            idioma
        )
    ) {
        return;
    }

    idiomaActual = idioma;

    try {

        localStorage.setItem(
            STORAGE_IDIOMA,
            idioma
        );

    } catch (error) {

        console.warn(
            "No se pudo guardar el idioma.",
            error
        );

    }

}


/* =========================================================
   BASE DE DATOS
   ========================================================= */

function cargarPersonasGuardadas() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_PERSONAS
            );

        if (!datos) {
            return [];
        }

        const personas =
            JSON.parse(datos);

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

        const cantidad =
            Number(
                localStorage.getItem(
                    STORAGE_NOTIFICACIONES
                )
            );

        return Number.isFinite(cantidad) &&
            cantidad > 0
            ? Math.floor(cantidad)
            : 0;

    } catch (error) {

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
                ? texto("notificacion")
                : texto("notificaciones")
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

    } catch (error) {}

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


/* =========================================================
   FECHAS
   ========================================================= */

function formatearFechaRegistro(
    fecha
) {

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

    const dia =
        String(
            fechaConvertida.getDate()
        ).padStart(2, "0");

    const mes =
        String(
            fechaConvertida.getMonth() + 1
        ).padStart(2, "0");

    const anio =
        fechaConvertida.getFullYear();

    let horas =
        fechaConvertida.getHours();

    const minutos =
        String(
            fechaConvertida.getMinutes()
        ).padStart(2, "0");

    const periodo =
        horas >= 12
            ? "p. m."
            : "a. m.";

    horas =
        horas % 12;

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

    if (
        partesFecha.length !== 3
    ) {
        return "No especificada";
    }

    const partesHora =
        hora.split(":");

    if (
        partesHora.length < 2
    ) {
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

    horas =
        horas % 12;

    if (horas === 0) {
        horas = 12;
    }

    return `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]} ${horas}:${minutos} ${periodo}`;

}


/* =========================================================
   IDIOMAS
   ========================================================= */

const modalIdioma =
    obtenerElemento(
        "modalIdioma"
    );


function abrirSelectorIdioma(
    obligatorio = false
) {

    if (!modalIdioma) {
        return;
    }

    modalIdioma.classList.remove(
        "oculto"
    );

    modalIdioma.dataset.obligatorio =
        obligatorio
            ? "true"
            : "false";

    document.body.classList.add(
        "bloqueado-por-idioma"
    );

    document
        .querySelectorAll(
            ".idioma-opcion"
        )
        .forEach(
            boton => {

                boton.classList.toggle(
                    "seleccionado",
                    boton.dataset.idioma ===
                        idiomaActual
                );

            }
        );

}


function cerrarSelectorIdioma() {

    if (!modalIdioma) {
        return;
    }

    modalIdioma.classList.add(
        "oculto"
    );

    document.body.classList.remove(
        "bloqueado-por-idioma"
    );

}


function configurarSelectorIdioma() {

    document
        .querySelectorAll(
            ".idioma-opcion"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const idioma =
                            boton.dataset.idioma;

                        if (
                            !IDIOMAS_VALIDOS.includes(
                                idioma
                            )
                        ) {
                            return;
                        }

                        guardarIdioma(
                            idioma
                        );

                        aplicarIdioma();

                        cerrarSelectorIdioma();

                        iniciarFlujoInicial();

                    }
                );

            }
        );

}


function aplicarIdioma() {

    if (!idiomaActual) {
        return;
    }

    document.documentElement.lang =
        idiomaActual;

    const setText = (
        selector,
        key
    ) => {

        const elemento =
            document.querySelector(
                selector
            );

        if (elemento) {
            elemento.textContent =
                texto(key);
        }

    };


    const setPlaceholder = (
        selector,
        key
    ) => {

        const elemento =
            document.querySelector(
                selector
            );

        if (elemento) {
            elemento.placeholder =
                texto(key);
        }

    };


    setText(
        "#idiomaEtiqueta",
        "configuracionInicial"
    );

    setText(
        "#tituloIdioma",
        "seleccionarIdioma"
    );

    setText(
        "#subtituloIdioma",
        "elegirIdioma"
    );

    setText(
        "#offlineTitulo",
        "sinInternet"
    );

    setText(
        "#offlineMensaje",
        "sinInternetMensaje"
    );

    setText(
        "#btnReintentarConexion",
        "reintentar"
    );

    setText(
        ".titulo-personas-registradas",
        "personasRegistradas"
    );

    setText(
        "#pantalla-zonas h1",
        "cobertura"
    );

    setText(
        "#pantalla-zonas #ubicacion-dispositivo",
        "detectando"
    );

    setPlaceholder(
        "#inputBuscarZona",
        "buscarZona"
    );

    setText(
        "#pantalla-escaner h1",
        "analisisFacial"
    );

    setText(
        "#pantalla-escaner .header-content p",
        "compararImagenes"
    );

    setText(
        'label[for="fotoDesaparecido"]',
        "personaDesaparecida"
    );

    setText(
        'label[for="fotoEncontrado"]',
        "personaAvistada"
    );

    setText(
        "#previewDesaparecido",
        "sinImagen"
    );

    setText(
        "#previewEncontrado",
        "sinImagen"
    );

    setText(
        "#btnIniciarEscaneo",
        "iniciarAnalisis"
    );

    setText(
        "#radar-escaner p",
        "analizando"
    );

    setText(
        "#resultado-analisis h3",
        "resultado"
    );

    setText(
        "#pantalla-reportar h1",
        "reportarDesaparicion"
    );

    const reportHeader =
        document.querySelector(
            "#pantalla-reportar .header-content p"
        );

    if (reportHeader) {
        reportHeader.textContent =
            texto("registrarCaso");
    }

    setText(
        'label[for="repNombre"]',
        "nombres"
    );

    setText(
        'label[for="repEdad"]',
        "edad"
    );

    setText(
        'label[for="repCiudad"]',
        "ciudad"
    );

    setText(
        'label[for="repSector"]',
        "sector"
    );

    setText(
        'label[for="repFechaDesaparicion"]',
        "fechaDesaparicion"
    );

    setText(
        'label[for="repHoraDesaparicion"]',
        "horaDesaparicion"
    );

    setText(
        'label[for="repRopa"]',
        "vestimenta"
    );

    setText(
        'label[for="repFoto"]',
        "fotoPersona"
    );

    setText(
        ".btn-guardar",
        "publicarAlerta"
    );

    setText(
        "#pantalla-configuracion h1",
        "configuracionTitulo"
    );

    const configHeader =
        document.querySelector(
            "#pantalla-configuracion .header-content p"
        );

    if (configHeader) {
        configHeader.textContent =
            texto("personaliza");
    }

    setText(
        ".cuenta-seccion h2",
        "tuCuenta"
    );

    setText(
        ".cuenta-seccion .config-titulo p",
        "iniciaSesion"
    );

    setText(
        "#btnGoogle .cuenta-btn-texto",
        "google"
    );

    setText(
        "#btnApple .cuenta-btn-texto",
        "apple"
    );

    setText(
        "#btnCerrarSesion",
        "cerrarSesion"
    );

    setText(
        ".idioma-config-seccion h2",
        "idioma"
    );

    setText(
        ".idioma-config-seccion .config-titulo p",
        "cambiaIdioma"
    );

    setText(
        "#btnCambiarIdioma",
        "cambiarIdioma"
    );

    setText(
        ".privacidad-seccion h2",
        "privacidad"
    );

    setText(
        ".privacidad-seccion .config-titulo p",
        "consultaTerminos"
    );

    setText(
        "#btnVerTerminos",
        "verTerminos"
    );

    setText(
        ".config-footer strong",
        "preferencia"
    );

    setText(
        ".config-footer p",
        "preferenciaDesc"
    );

    setText(
        ".tema-opcion[data-tema='claro'] strong",
        "modoClaro"
    );

    setText(
        ".tema-opcion[data-tema='claro'] small",
        "modoClaroDesc"
    );

    setText(
        ".tema-opcion[data-tema='oscuro'] strong",
        "modoOscuro"
    );

    setText(
        ".tema-opcion[data-tema='oscuro'] small",
        "modoOscuroDesc"
    );

    setText(
        "#btnCerrarModal",
        "cerrar"
    );

    const tituloEditar =
        document.querySelector(
            "#modalEditar h2"
        );

    if (tituloEditar) {
        tituloEditar.textContent =
            texto("editarRegistro");
    }

    const subtituloEditar =
        document.querySelector(
            "#modalEditar .modal-subtitulo"
        );

    if (subtituloEditar) {
        subtituloEditar.textContent =
            texto("modificaDatos");
    }

    const guardarEditar =
        document.querySelector(
            "#formEditar .btn-guardar"
        );

    if (guardarEditar) {
        guardarEditar.textContent =
            texto("guardarCambios");
    }

    setText(
        "#tituloTerminos",
        "terminos"
    );

    setText(
        "#btnAceptarTerminos",
        "aceptarContinuar"
    );

    setText(
        ".terminos-obligatorio",
        "obligatorio"
    );

    setText(
        "#tituloCuentaModal",
        "registrarPerfil"
    );

    setText(
        "#subtituloCuentaModal",
        "completarPerfil"
    );

    setText(
        'label[for="perfilUsuario"]',
        "nombreUsuario"
    );

    setText(
        'label[for="perfilCorreo"]',
        "correo"
    );

    setText(
        'label[for="perfilContrasena"]',
        "contrasena"
    );

    setText(
        'label[for="perfilFoto"]',
        "fotoPerfil"
    );

    setText(
        "#btnGuardarPerfil",
        "guardarPerfil"
    );

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            boton => {

                const key =
                    boton.dataset.pantalla ===
                    "pantalla-inicio"
                        ? "inicio"
                        : boton.dataset.pantalla ===
                          "pantalla-zonas"
                            ? "zonas"
                            : boton.dataset.pantalla ===
                              "pantalla-escaner"
                                ? "escaner"
                                : boton.dataset.pantalla ===
                                  "pantalla-reportar"
                                    ? "reportar"
                                    : "configuracion";

                const span =
                    boton.querySelector(
                        ".texto"
                    );

                if (span) {
                    span.textContent =
                        texto(key);
                }

            }
        );

}


/* =========================================================
   INTERNET
   ========================================================= */

const offlineOverlay =
    obtenerElemento(
        "offlineOverlay"
    );


function actualizarEstadoInternet() {

    const conectado =
        navigator.onLine;

    if (!offlineOverlay) {
        return;
    }

    offlineOverlay.classList.toggle(
        "oculto",
        conectado
    );

    offlineOverlay.setAttribute(
        "aria-hidden",
        conectado
            ? "true"
            : "false"
    );

    document.body.classList.toggle(
        "bloqueado-sin-internet",
        !conectado
    );

}


window.addEventListener(
    "online",
    () => {

        actualizarEstadoInternet();

        if (
            navigator.onLine &&
            terminosAceptados()
        ) {
            cargarZonas();
        }

    }
);


window.addEventListener(
    "offline",
    actualizarEstadoInternet
);


const btnReintentarConexion =
    obtenerElemento(
        "btnReintentarConexion"
    );

if (btnReintentarConexion) {

    btnReintentarConexion.addEventListener(
        "click",
        () => {

            actualizarEstadoInternet();

            if (!navigator.onLine) {

                alert(
                    texto("sinInternetMensaje")
                );

            }

        }
    );

}


/* =========================================================
   TÉRMINOS Y CONDICIONES
   ========================================================= */

const modalTerminos =
    obtenerElemento(
        "modalTerminos"
    );

const checkTerminos =
    obtenerElemento(
        "checkTerminos"
    );

const btnAceptarTerminos =
    obtenerElemento(
        "btnAceptarTerminos"
    );

const btnCerrarTerminos =
    obtenerElemento(
        "btnCerrarTerminos"
    );

const btnVerTerminos =
    obtenerElemento(
        "btnVerTerminos"
    );


/* =========================================================
   TRADUCCIÓN DEL CONTENIDO DE TÉRMINOS
   ========================================================= */

function aplicarIdiomaTerminos() {

    if (!modalTerminos) {
        return;
    }

    const contenido =
        modalTerminos.querySelector(
            ".terminos-contenido"
        );

    const titulo =
        obtenerElemento(
            "tituloTerminos"
        );

    const etiquetaCheck =
        modalTerminos.querySelector(
            ".terminos-check span"
        );

    const textoObligatorio =
        modalTerminos.querySelector(
            ".terminos-obligatorio"
        );

    if (!contenido) {
        return;
    }


    const terminos = {

        es: {

            titulo:
                "Términos y privacidad",

            introduccion:
                "Antes de utilizar Find Me, debes leer y aceptar las siguientes condiciones. Estas condiciones establecen el uso responsable de la aplicación y de la información registrada por los usuarios.",

            h1:
                "1. Uso de la información",

            p1:
                "Find Me utiliza la información que registras, como nombre, edad, ciudad, sector, descripción y fotografías, para mostrar y organizar los casos dentro de la aplicación.",

            h2:
                "2. Fotografías",

            p2:
                "Las fotografías seleccionadas por el usuario se utilizan para los registros de personas y para realizar el análisis comparativo de imágenes dentro de Find Me. No debes subir fotografías de otras personas sin tener una razón legítima para hacerlo.",

            h3:
                "3. Ubicación y GPS",

            p3:
                "Find Me puede solicitar la ubicación del dispositivo para mostrar una referencia de ubicación y apoyar la organización de las zonas. El navegador solicitará permiso antes de proporcionar la ubicación.",

            h4:
                "4. Escáner facial",

            p4:
                "El escáner facial es una herramienta de apoyo. Sus resultados no constituyen una identificación oficial ni deben utilizarse como prueba de identidad. Una implementación real requiere tecnología especializada, medidas de seguridad y las autorizaciones correspondientes.",

            h5:
                "5. Responsabilidad del usuario",

            p5:
                "La persona que registra un caso debe procurar que la información ingresada sea correcta y utilizar la aplicación de forma responsable. No se debe publicar información falsa, engañosa o utilizada para perjudicar a otra persona.",

            h6:
                "6. Find Me no reemplaza a las autoridades",

            p6:
                "Find Me es una herramienta de apoyo. No reemplaza a la Policía Nacional, Fiscalía, servicios de emergencia ni ninguna otra autoridad competente. En una desaparición real se debe realizar la denuncia y acudir a las autoridades correspondientes.",

            h7:
                "7. Privacidad",

            p7:
                "La información de esta versión se almacena localmente en el navegador mediante almacenamiento local. No debe considerarse un sistema de almacenamiento oficial para información sensible.",

            check:
                "He leído y acepto los Términos y condiciones y la Política de privacidad.",

            obligatorio:
                "Debes aceptar estas condiciones para continuar utilizando Find Me."

        },


        en: {

            titulo:
                "Terms and Privacy",

            introduccion:
                "Before using Find Me, you must read and accept the following conditions. These conditions establish the responsible use of the application and the information registered by users.",

            h1:
                "1. Use of information",

            p1:
                "Find Me uses the information you register, such as name, age, city, sector, description and photographs, to display and organize cases within the application.",

            h2:
                "2. Photographs",

            p2:
                "Photographs selected by the user are used for person records and to perform image comparison analysis within Find Me. You should not upload photographs of other people without a legitimate reason to do so.",

            h3:
                "3. Location and GPS",

            p3:
                "Find Me may request the device location to display a location reference and help organize areas. The browser will request permission before providing the location.",

            h4:
                "4. Facial scanner",

            p4:
                "The facial scanner is a support tool. Its results do not constitute official identification and should not be used as proof of identity. A real implementation requires specialized technology, security measures and the appropriate authorizations.",

            h5:
                "5. User responsibility",

            p5:
                "The person registering a case should ensure that the information entered is accurate and use the application responsibly. False or misleading information, or information intended to harm another person, must not be published.",

            h6:
                "6. Find Me does not replace authorities",

            p6:
                "Find Me is a support tool. It does not replace the National Police, prosecutors, emergency services or any other competent authority. In a real disappearance, a report must be filed and the appropriate authorities must be contacted.",

            h7:
                "7. Privacy",

            p7:
                "Information in this version is stored locally in the browser using local storage. It should not be considered an official storage system for sensitive information.",

            check:
                "I have read and accept the Terms and Conditions and Privacy Policy.",

            obligatorio:
                "You must accept these conditions to continue using Find Me."

        },


        pt: {

            titulo:
                "Termos e privacidade",

            introduccion:
                "Antes de utilizar o Find Me, você deve ler e aceitar as seguintes condições. Estas condições estabelecem o uso responsável do aplicativo e das informações registradas pelos usuários.",

            h1:
                "1. Uso das informações",

            p1:
                "O Find Me utiliza as informações registradas, como nome, idade, cidade, setor, descrição e fotografias, para mostrar e organizar os casos dentro do aplicativo.",

            h2:
                "2. Fotografias",

            p2:
                "As fotografias selecionadas pelo usuário são utilizadas para os registros de pessoas e para realizar a análise comparativa de imagens dentro do Find Me. Não envie fotografias de outras pessoas sem um motivo legítimo.",

            h3:
                "3. Localização e GPS",

            p3:
                "O Find Me pode solicitar a localização do dispositivo para mostrar uma referência de localização e ajudar na organização das áreas. O navegador solicitará permissão antes de fornecer a localização.",

            h4:
                "4. Scanner facial",

            p4:
                "O scanner facial é uma ferramenta de apoio. Seus resultados não constituem uma identificação oficial e não devem ser utilizados como prova de identidade. Uma implementação real requer tecnologia especializada, medidas de segurança e as autorizações correspondentes.",

            h5:
                "5. Responsabilidade do usuário",

            p5:
                "A pessoa que registra um caso deve procurar garantir que as informações inseridas estejam corretas e utilizar o aplicativo de forma responsável. Não devem ser publicadas informações falsas ou enganosas, nem informações destinadas a prejudicar outra pessoa.",

            h6:
                "6. O Find Me não substitui as autoridades",

            p6:
                "O Find Me é uma ferramenta de apoio. Não substitui a Polícia Nacional, a Promotoria, os serviços de emergência ou qualquer outra autoridade competente. Em um desaparecimento real, deve ser feita uma denúncia e as autoridades correspondentes devem ser procuradas.",

            h7:
                "7. Privacidade",

            p7:
                "As informações desta versão são armazenadas localmente no navegador por meio do armazenamento local. Não deve ser considerado um sistema oficial de armazenamento de informações sensíveis.",

            check:
                "Li e aceito os Termos e Condições e a Política de Privacidade.",

            obligatorio:
                "Você deve aceitar estas condições para continuar usando o Find Me."

        },


        fr: {

            titulo:
                "Conditions et confidentialité",

            introduccion:
                "Avant d'utiliser Find Me, vous devez lire et accepter les conditions suivantes. Ces conditions établissent l'utilisation responsable de l'application et des informations enregistrées par les utilisateurs.",

            h1:
                "1. Utilisation des informations",

            p1:
                "Find Me utilise les informations que vous enregistrez, telles que le nom, l'âge, la ville, le secteur, la description et les photographies, afin d'afficher et d'organiser les cas dans l'application.",

            h2:
                "2. Photographies",

            p2:
                "Les photographies sélectionnées par l'utilisateur sont utilisées pour les dossiers des personnes et pour effectuer l'analyse comparative des images dans Find Me. Vous ne devez pas télécharger les photographies d'autres personnes sans raison légitime.",

            h3:
                "3. Localisation et GPS",

            p3:
                "Find Me peut demander la localisation de l'appareil afin d'afficher une référence de localisation et d'aider à organiser les zones. Le navigateur demandera l'autorisation avant de fournir la localisation.",

            h4:
                "4. Scanner facial",

            p4:
                "Le scanner facial est un outil d'assistance. Ses résultats ne constituent pas une identification officielle et ne doivent pas être utilisés comme preuve d'identité. Une mise en œuvre réelle nécessite une technologie spécialisée, des mesures de sécurité et les autorisations appropriées.",

            h5:
                "5. Responsabilité de l'utilisateur",

            p5:
                "La personne qui enregistre un cas doit s'assurer que les informations saisies sont correctes et utiliser l'application de manière responsable. Les informations fausses ou trompeuses, ou destinées à nuire à une autre personne, ne doivent pas être publiées.",

            h6:
                "6. Find Me ne remplace pas les autorités",

            p6:
                "Find Me est un outil d'assistance. Il ne remplace pas la Police nationale, le ministère public, les services d'urgence ou toute autre autorité compétente. En cas de disparition réelle, une plainte doit être déposée et les autorités compétentes doivent être contactées.",

            h7:
                "7. Confidentialité",

            p7:
                "Les informations de cette version sont stockées localement dans le navigateur à l'aide du stockage local. Il ne doit pas être considéré comme un système officiel de stockage d'informations sensibles.",

            check:
                "J'ai lu et j'accepte les conditions générales et la politique de confidentialité.",

            obligatorio:
                "Vous devez accepter ces conditions pour continuer à utiliser Find Me."

        },


        it: {

            titulo:
                "Termini e privacy",

            introduccion:
                "Prima di utilizzare Find Me, devi leggere e accettare le seguenti condizioni. Queste condizioni stabiliscono l'uso responsabile dell'applicazione e delle informazioni registrate dagli utenti.",

            h1:
                "1. Utilizzo delle informazioni",

            p1:
                "Find Me utilizza le informazioni registrate, come nome, età, città, settore, descrizione e fotografie, per mostrare e organizzare i casi all'interno dell'applicazione.",

            h2:
                "2. Fotografie",

            p2:
                "Le fotografie selezionate dall'utente vengono utilizzate per i registri delle persone e per effettuare l'analisi comparativa delle immagini all'interno di Find Me. Non devi caricare fotografie di altre persone senza un motivo legittimo.",

            h3:
                "3. Posizione e GPS",

            p3:
                "Find Me può richiedere la posizione del dispositivo per mostrare un riferimento di posizione e aiutare a organizzare le zone. Il browser richiederà l'autorizzazione prima di fornire la posizione.",

            h4:
                "4. Scanner facciale",

            p4:
                "Lo scanner facciale è uno strumento di supporto. I suoi risultati non costituiscono un'identificazione ufficiale e non devono essere utilizzati come prova d'identità. Un'implementazione reale richiede tecnologia specializzata, misure di sicurezza e le autorizzazioni appropriate.",

            h5:
                "5. Responsabilità dell'utente",

            p5:
                "La persona che registra un caso deve assicurarsi che le informazioni inserite siano corrette e utilizzare l'applicazione in modo responsabile. Non devono essere pubblicate informazioni false, ingannevoli o destinate a danneggiare un'altra persona.",

            h6:
                "6. Find Me non sostituisce le autorità",

            p6:
                "Find Me è uno strumento di supporto. Non sostituisce la Polizia nazionale, la Procura, i servizi di emergenza o qualsiasi altra autorità competente. In caso di scomparsa reale, è necessario presentare una denuncia e rivolgersi alle autorità competenti.",

            h7:
                "7. Privacy",

            p7:
                "Le informazioni di questa versione vengono memorizzate localmente nel browser tramite l'archiviazione locale. Non deve essere considerato un sistema ufficiale per la conservazione di informazioni sensibili.",

            check:
                "Ho letto e accetto i Termini e condizioni e l'Informativa sulla privacy.",

            obligatorio:
                "Devi accettare queste condizioni per continuare a utilizzare Find Me."

        },


        de: {

            titulo:
                "Nutzungsbedingungen und Datenschutz",

            introduccion:
                "Bevor du Find Me verwendest, musst du die folgenden Bedingungen lesen und akzeptieren. Diese Bedingungen legen die verantwortungsvolle Nutzung der Anwendung und der von den Benutzern registrierten Informationen fest.",

            h1:
                "1. Verwendung der Informationen",

            p1:
                "Find Me verwendet die von dir registrierten Informationen wie Name, Alter, Stadt, Bereich, Beschreibung und Fotos, um Fälle innerhalb der Anwendung anzuzeigen und zu organisieren.",

            h2:
                "2. Fotos",

            p2:
                "Vom Benutzer ausgewählte Fotos werden für Personenregistrierungen und für den Bildvergleich innerhalb von Find Me verwendet. Du solltest keine Fotos anderer Personen ohne einen legitimen Grund hochladen.",

            h3:
                "3. Standort und GPS",

            p3:
                "Find Me kann den Standort des Geräts anfordern, um einen Standortbezug anzuzeigen und die Organisation der Bereiche zu unterstützen. Der Browser fragt nach deiner Zustimmung, bevor der Standort bereitgestellt wird.",

            h4:
                "4. Gesichtsscanner",

            p4:
                "Der Gesichtsscanner ist ein Hilfswerkzeug. Seine Ergebnisse stellen keine offizielle Identifizierung dar und dürfen nicht als Identitätsnachweis verwendet werden. Eine echte Implementierung erfordert spezielle Technologie, Sicherheitsmaßnahmen und entsprechende Genehmigungen.",

            h5:
                "5. Verantwortung des Benutzers",

            p5:
                "Die Person, die einen Fall registriert, sollte sicherstellen, dass die eingegebenen Informationen korrekt sind, und die Anwendung verantwortungsvoll nutzen. Falsche oder irreführende Informationen sowie Informationen, die einer anderen Person schaden sollen, dürfen nicht veröffentlicht werden.",

            h6:
                "6. Find Me ersetzt keine Behörden",

            p6:
                "Find Me ist ein Hilfswerkzeug. Es ersetzt nicht die Polizei, die Staatsanwaltschaft, Rettungsdienste oder andere zuständige Behörden. Bei einem echten Vermisstenfall muss eine Meldung gemacht und die zuständigen Behörden kontaktiert werden.",

            h7:
                "7. Datenschutz",

            p7:
                "Die Informationen dieser Version werden lokal im Browser über den lokalen Speicher gespeichert. Es sollte nicht als offizielles Speichersystem für sensible Informationen betrachtet werden.",

            check:
                "Ich habe die Nutzungsbedingungen und die Datenschutzrichtlinie gelesen und akzeptiere sie.",

            obligatorio:
                "Du musst diese Bedingungen akzeptieren, um Find Me weiterhin zu verwenden."

        }

    };


    const idioma =
        IDIOMAS_VALIDOS.includes(
            idiomaActual
        )
            ? idiomaActual
            : "es";

    const t =
        terminos[idioma] ||
        terminos.es;


    if (titulo) {

        titulo.textContent =
            t.titulo;

    }


    contenido.innerHTML = `

        <p>
            ${t.introduccion}
        </p>

        <h3>
            ${t.h1}
        </h3>

        <p>
            ${t.p1}
        </p>

        <h3>
            ${t.h2}
        </h3>

        <p>
            ${t.p2}
        </p>

        <h3>
            ${t.h3}
        </h3>

        <p>
            ${t.p3}
        </p>

        <h3>
            ${t.h4}
        </h3>

        <p>
            ${t.p4}
        </p>

        <h3>
            ${t.h5}
        </h3>

        <p>
            ${t.p5}
        </p>

        <h3>
            ${t.h6}
        </h3>

        <p>
            ${t.p6}
        </p>

        <h3>
            ${t.h7}
        </h3>

        <p>
            ${t.p7}
        </p>

    `;


    if (etiquetaCheck) {

        etiquetaCheck.textContent =
            t.check;

    }


    if (textoObligatorio) {

        textoObligatorio.textContent =
            t.obligatorio;

    }

}


/* =========================================================
   CUENTA
   ========================================================= */

function cuentaEstaVinculada() {

    try {

        const cuenta =
            localStorage.getItem(
                STORAGE_CUENTA
            );

        if (!cuenta) {
            return false;
        }

        const datos =
            JSON.parse(cuenta);

        return Boolean(
            datos &&
            datos.provider &&
            datos.username
        );

    } catch (error) {

        return false;

    }

}


function obtenerCuenta() {

    try {

        const cuenta =
            localStorage.getItem(
                STORAGE_CUENTA
            );

        if (!cuenta) {
            return null;
        }

        const datos =
            JSON.parse(cuenta);

        return datos &&
            typeof datos === "object"
            ? datos
            : null;

    } catch (error) {

        return null;

    }

}


function terminosAceptados() {

    return (
        terminosAceptadosEnSesion ||
        cuentaEstaVinculada()
    );

}


function guardarAceptacionTerminos() {

    terminosAceptadosEnSesion =
        true;

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

    btnAceptarTerminos.disabled =
        obligatorio &&
        !checkTerminos.checked;

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

    aplicarIdioma();

    aplicarIdiomaTerminos();

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
                ? texto("aceptarContinuar")
                : texto("cerrar");

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

    if (!navigator.onLine) {
        actualizarEstadoInternet();
        return;
    }

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

    if (
        dbPersonas.length === 0
    ) {

        contenedor.innerHTML = `
            <div class="sin-alertas">

                <div class="sin-alertas-icono">
                    —
                </div>

                <p class="mensaje-principal">
                    ${escaparHTML(
                        texto("noHayAlertas")
                    )}
                </p>

                <p class="mensaje-secundario">
                    ${escaparHTML(
                        texto("usaReportar")
                    )}
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
                            alt="${escaparHTML(persona.nombre)}"
                        >
                    `
                    : "";

            const ropaHTML =
                persona.ropa
                    ? `
                        <p>
                            <strong>
                                ${escaparHTML(
                                    texto("ropa")
                                )}:
                            </strong>
                            ${escaparHTML(
                                persona.ropa
                            )}
                        </p>
                    `
                    : "";

            tarjeta.innerHTML = `
                ${fotoHTML}

                <div class="info-persona">

                    <h3>
                        ${escaparHTML(
                            persona.nombre
                        )}
                    </h3>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("edad")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.edad
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("ciudad")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.ciudad
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("rastro")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.zona
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("desaparecio")
                            )}:
                        </strong>
                        ${escaparHTML(
                            formatearFechaDesaparicion(
                                persona.fechaDesaparicion,
                                persona.horaDesaparicion
                            )
                        )}
                    </p>

                    ${ropaHTML}

                    <p class="fecha-registro">

                        <small>
                            ${escaparHTML(
                                texto("registrado")
                            )}:
                            ${escaparHTML(
                                formatearFechaRegistro(
                                    persona.fecha
                                )
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
                            ${escaparHTML(
                                texto("editar")
                            )}
                        </button>

                        <button
                            class="btn-eliminar"
                            data-id="${escaparHTML(
                                persona.id
                            )}"
                            type="button"
                        >
                            ${escaparHTML(
                                texto("eliminar")
                            )}
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

function eliminarPersona(
    id
) {

    const persona =
        dbPersonas.find(
            p => p.id === id
        );

    if (!persona) {
        return;
    }

    const confirmar =
        confirm(
            `${texto("confirmarEliminar")} ${persona.nombre}?`
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


function abrirModalEditar(
    id
) {

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

    personaEditandoId =
        id;

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

    personaEditandoId =
        null;

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
                !Number.isInteger(edad) ||
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
                return;
            }

            actualizarContadoresZonas();

            cargarAlertasInicio();

            cargarZonas();

            cerrarModalEditar();

            alert(
                texto("cambiosGuardados")
            );

        }
    );

}


/* =========================================================
   TEMA
   ========================================================= */

const opcionesTema =
    document.querySelectorAll(
        ".tema-opcion"
    );


function aplicarTema(
    tema
) {

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

    } catch (error) {}

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


let temaGuardado =
    "claro";

try {

    temaGuardado =
        localStorage.getItem(
            STORAGE_TEMA
        ) ||
        "claro";

} catch (error) {}


aplicarTema(
    temaGuardado
);


/* =========================================================
   CUENTA Y PERFIL
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

const cuentaAvatar =
    obtenerElemento(
        "cuentaAvatar"
    );

const btnPerfil =
    obtenerElemento(
        "btnPerfil"
    );

const modalCuenta =
    obtenerElemento(
        "modalCuenta"
    );

const btnCerrarCuenta =
    obtenerElemento(
        "btnCerrarCuenta"
    );

const formPerfil =
    obtenerElemento(
        "formPerfil"
    );

const perfilUsuario =
    obtenerElemento(
        "perfilUsuario"
    );

const perfilCorreo =
    obtenerElemento(
        "perfilCorreo"
    );

const perfilContrasena =
    obtenerElemento(
        "perfilContrasena"
    );

const perfilFoto =
    obtenerElemento(
        "perfilFoto"
    );

const previewPerfilFoto =
    obtenerElemento(
        "previewPerfilFoto"
    );

const perfilModalAvatar =
    obtenerElemento(
        "perfilModalAvatar"
    );


function actualizarAvatar(
    cuenta
) {

    if (!cuenta) {
        return;
    }

    const inicial =
        String(
            cuenta.username ||
            cuenta.email ||
            "?"
        )
            .trim()
            .charAt(0)
            .toUpperCase() ||
            "?";

    if (cuenta.photo) {

        const imagen =
            `
            <img
                src="${escaparHTML(
                    cuenta.photo
                )}"
                alt="${escaparHTML(
                    cuenta.username ||
                    "Perfil"
                )}"
            >
            `;

        if (cuentaAvatar) {
            cuentaAvatar.innerHTML =
                imagen;
        }

        const placeholder =
            btnPerfil?.querySelector(
                ".perfil-placeholder"
            );

        if (placeholder) {
            placeholder.innerHTML =
                imagen;
        }

        if (perfilModalAvatar) {
            perfilModalAvatar.innerHTML =
                imagen;
        }

        return;

    }

    const color =
        cuenta.avatarColor ||
        "#7c3aed";

    const contenido =
        `
        <span
            class="avatar-inicial"
            style="
                background:${escaparHTML(color)};
            "
        >
            ${escaparHTML(inicial)}
        </span>
        `;

    if (cuentaAvatar) {
        cuentaAvatar.innerHTML =
            contenido;
    }

    const placeholder =
        btnPerfil?.querySelector(
            ".perfil-placeholder"
        );

    if (placeholder) {
        placeholder.innerHTML =
            contenido;
    }

    if (perfilModalAvatar) {
        perfilModalAvatar.innerHTML =
            contenido;
    }

}


function mostrarCuentaConectada(
    cuenta
) {

    if (!cuenta) {
        return;
    }

    if (cuentaTexto) {

        cuentaTexto.innerHTML = `
            <strong>
                ${escaparHTML(
                    cuenta.username ||
                    texto("cuentaGuardada")
                )}
            </strong>

            <span>
                ${escaparHTML(
                    texto("sesionProveedor")
                )}
                ${escaparHTML(
                    cuenta.provider ||
                    ""
                )}
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

    actualizarAvatar(
        cuenta
    );

}


function guardarCuenta(
    cuenta
) {

    try {

        localStorage.setItem(
            STORAGE_CUENTA,
            JSON.stringify(cuenta)
        );

        return true;

    } catch (error) {

        alert(
            "No se pudo guardar la información de la cuenta."
        );

        return false;

    }

}


function generarColorAvatar() {

    const colores = [
        "#7c3aed",
        "#2563eb",
        "#0891b2",
        "#059669",
        "#d97706",
        "#dc2626",
        "#db2777",
        "#4f46e5"
    ];

    return colores[
        Math.floor(
            Math.random() *
            colores.length
        )
    ];

}


async function hashPassword(
    password
) {

    if (
        !window.crypto ||
        !window.crypto.subtle
    ) {
        throw new Error(
            "Web Crypto no disponible"
        );
    }

    const datos =
        new TextEncoder().encode(
            password
        );

    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            datos
        );

    return Array.from(
        new Uint8Array(hash)
    )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


function abrirModalPerfil(
    provider,
    email = ""
) {

    if (!modalCuenta) {
        return;
    }

    const titulo =
        obtenerElemento(
            "tituloCuentaModal"
        );

    const subtitulo =
        obtenerElemento(
            "subtituloCuentaModal"
        );

    if (titulo) {
        titulo.textContent =
            texto("registrarPerfil");
    }

    if (subtitulo) {
        subtitulo.textContent =
            texto("completarPerfil");
    }

    if (perfilUsuario) {
        perfilUsuario.value = "";
    }

    if (perfilCorreo) {
        perfilCorreo.value =
            email || "";
    }

    if (perfilContrasena) {
        perfilContrasena.value =
            "";
    }

    if (perfilFoto) {
        perfilFoto.value =
            "";
    }

    if (previewPerfilFoto) {
        previewPerfilFoto.innerHTML =
            "";

        previewPerfilFoto.textContent =
            texto("sinFoto");
    }

    modalCuenta.dataset.provider =
        provider || "";

    modalCuenta.classList.remove(
        "oculto"
    );

}


function cerrarModalCuenta() {

    if (modalCuenta) {
        modalCuenta.classList.add(
            "oculto"
        );
    }

}


if (btnCerrarCuenta) {

    btnCerrarCuenta.addEventListener(
        "click",
        cerrarModalCuenta
    );

}


if (modalCuenta) {

    modalCuenta.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalCuenta
            ) {
                cerrarModalCuenta();
            }

        }
    );

}


/* =========================================================
   OAUTH PREPARADO
   ========================================================= */

function iniciarGoogle() {

    if (!navigator.onLine) {
        alert(
            texto("conexionRequerida")
        );
        return;
    }

    if (!GOOGLE_CLIENT_ID) {

        alert(
            texto(
                "cuentaOAuthNoConfigurada"
            )
        );

        return;

    }

    /*
     * Aquí se conectará Google Identity Services
     * cuando se coloque el Client ID oficial.
     */

    window.location.href =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        "?client_id=" +
        encodeURIComponent(
            GOOGLE_CLIENT_ID
        ) +
        "&redirect_uri=" +
        encodeURIComponent(
            window.location.origin +
            window.location.pathname
        ) +
        "&response_type=token" +
        "&scope=" +
        encodeURIComponent(
            "openid email profile"
        );

}


function iniciarApple() {

    if (!navigator.onLine) {
        alert(
            texto("conexionRequerida")
        );
        return;
    }

    if (!APPLE_CLIENT_ID) {

        alert(
            texto(
                "cuentaOAuthNoConfigurada"
            )
        );

        return;

    }

    const url =
        "https://appleid.apple.com/auth/authorize" +
        "?client_id=" +
        encodeURIComponent(
            APPLE_CLIENT_ID
        ) +
        "&redirect_uri=" +
        encodeURIComponent(
            APPLE_REDIRECT_URI
        ) +
        "&response_type=code" +
        "&response_mode=query" +
        "&scope=name%20email";

    window.location.href =
        url;

}


if (btnGoogle) {

    btnGoogle.addEventListener(
        "click",
        iniciarGoogle
    );

}


if (btnApple) {

    btnApple.addEventListener(
        "click",
        iniciarApple
    );

}


/* =========================================================
   PERFIL LOCAL DESPUÉS DE AUTENTICACIÓN
   ========================================================= */

if (formPerfil) {

    formPerfil.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const username =
                perfilUsuario?.value.trim();

            const email =
                perfilCorreo?.value.trim();

            const password =
                perfilContrasena?.value;

            const provider =
                modalCuenta?.dataset.provider ||
                "Find Me";

            if (
                !username ||
                username.length < 3
            ) {

                alert(
                    "El nombre de usuario debe tener al menos 3 caracteres."
                );

                return;

            }

            if (
                !email ||
                !email.includes("@")
            ) {

                alert(
                    "Introduce un correo electrónico válido."
                );

                return;

            }

            if (
                !password ||
                password.length < 8
            ) {

                alert(
                    "La contraseña debe tener al menos 8 caracteres."
                );

                return;

            }

            try {

                const passwordHash =
                    await hashPassword(
                        password
                    );

                let foto =
                    "";

                if (
                    perfilFoto &&
                    perfilFoto.files &&
                    perfilFoto.files[0]
                ) {

                    const archivo =
                        perfilFoto.files[0];

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

                    foto =
                        await leerArchivoComoDataURL(
                            archivo
                        );

                }

                const cuenta = {

                    provider:
                        provider,

                    username:
                        username,

                    email:
                        email,

                    passwordHash:
                        passwordHash,

                    photo:
                        foto,

                    avatarColor:
                        foto
                            ? ""
                            : generarColorAvatar(),

                    createdAt:
                        new Date().toISOString()

                };

                if (
                    !guardarCuenta(
                        cuenta
                    )
                ) {
                    return;
                }

                mostrarCuentaConectada(
                    cuenta
                );

                cerrarModalCuenta();

                terminosAceptadosEnSesion =
                    true;

                alert(
                    "Perfil guardado correctamente."
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "No fue posible guardar el perfil."
                );

            }

        }
    );

}


if (perfilFoto) {

    perfilFoto.addEventListener(
        "change",
        () => {

            const archivo =
                perfilFoto.files &&
                perfilFoto.files[0];

            if (!archivo) {

                if (previewPerfilFoto) {
                    previewPerfilFoto.textContent =
                        texto("sinFoto");
                }

                return;

            }

            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {

                perfilFoto.value =
                    "";

                return;

            }

            if (
                archivo.size >
                MAX_IMAGEN_BYTES
            ) {

                perfilFoto.value =
                    "";

                alert(
                    `La imagen supera el límite de ${MAX_IMAGEN_MB} MB.`
                );

                return;

            }

            const lector =
                new FileReader();

            lector.onload =
                event => {

                    if (!previewPerfilFoto) {
                        return;
                    }

                    previewPerfilFoto.innerHTML =
                        `
                        <img
                            src="${escaparHTML(
                                event.target.result
                            )}"
                            alt="Vista previa"
                        >
                        `;

                };

            lector.readAsDataURL(
                archivo
            );

        }
    );

}


function leerArchivoComoDataURL(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            const lector =
                new FileReader();

            lector.onload =
                () => resolve(
                    lector.result
                );

            lector.onerror =
                () => reject(
                    new Error(
                        "No se pudo leer el archivo."
                    )
                );

            lector.readAsDataURL(
                archivo
            );

        }
    );

}


function cerrarSesion() {

    try {

        localStorage.removeItem(
            STORAGE_CUENTA
        );

    } catch (error) {}

    terminosAceptadosEnSesion =
        false;

    if (cuentaTexto) {

        cuentaTexto.innerHTML = `
            <strong>
                ${escaparHTML(
                    texto("iniciarFindMe")
                )}
            </strong>

            <span>
                ${escaparHTML(
                    texto("guardaInformacion")
                )}
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

    const placeholder =
        btnPerfil?.querySelector(
            ".perfil-placeholder"
        );

    if (placeholder) {

        placeholder.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                ></circle>

                <path
                    d="M5 21c.8-4.2 3.1-6.5 7-6.5s6.2 2.3 7 6.5"
                ></path>
            </svg>
        `;

    }

}


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        () => {

            cerrarSesion();

            abrirTerminos(true);

        }
    );

}


const cuentaInicial =
    obtenerCuenta();

if (cuentaInicial) {

    mostrarCuentaConectada(
        cuentaInicial
    );

}


/* =========================================================
   CAMBIAR IDIOMA DESDE CONFIGURACIÓN
   ========================================================= */

const btnCambiarIdioma =
    obtenerElemento(
        "btnCambiarIdioma"
    );

if (btnCambiarIdioma) {

    btnCambiarIdioma.addEventListener(
        "click",
        () => {

            abrirSelectorIdioma(
                false
            );

        }
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
        obtenerElemento(
            inputId
        );

    const preview =
        obtenerElemento(
            previewId
        );

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
                    texto("sinImagen");

                return;

            }

            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {

                input.value =
                    "";

                preview.textContent =
                    "Selecciona un archivo de imagen válido.";

                return;

            }

            if (
                archivo.size >
                MAX_IMAGEN_BYTES
            ) {

                input.value =
                    "";

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

            if (!navigator.onLine) {
                actualizarEstadoInternet();
                return;
            }

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
                    "Faltan elementos del formulario."
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
                            texto("sinFoto");

                    }

                    alert(
                        texto(
                            "alertaPublicada"
                        )
                    );

                    cambiarPantalla(
                        "pantalla-inicio"
                    );

                };

            lector.onerror =
                () => {

                    alert(
                        "No fue posible leer la imagen."
                    );

                };

            lector.readAsDataURL(
                archivo
            );

        }
    );

}


/* =========================================================
   ZONAS — CIUDADES / SECTORES / PERSONAS
   ========================================================= */

function obtenerCasosCiudad(
    ciudad
) {

    const objetivo =
        normalizarTexto(
            ciudad
        );

    return dbPersonas.filter(
        persona =>
            normalizarTexto(
                persona.ciudad
            ) === objetivo
    );

}


function obtenerCasosSector(
    ciudad,
    sector
) {

    const ciudadNormalizada =
        normalizarTexto(
            ciudad
        );

    const sectorNormalizado =
        normalizarTexto(
            sector
        );

    return dbPersonas.filter(
        persona =>
            normalizarTexto(
                persona.ciudad
            ) === ciudadNormalizada &&
            normalizarTexto(
                persona.zona
            ) === sectorNormalizado
    );

}


function obtenerCantidadCiudad(
    ciudad
) {

    return obtenerCasosCiudad(
        ciudad
    ).length;

}


function obtenerSectoresCiudad(
    ciudad
) {

    const casos =
        obtenerCasosCiudad(
            ciudad
        );

    const mapa =
        new Map();

    casos.forEach(
        persona => {

            const nombre =
                String(
                    persona.zona ||
                    "Sin sector"
                ).trim();

            const clave =
                normalizarTexto(
                    nombre
                );

            if (!mapa.has(clave)) {

                mapa.set(
                    clave,
                    {
                        nombre:
                            nombre,

                        casos:
                            0
                    }
                );

            }

            mapa.get(
                clave
            ).casos += 1;

        }
    );

    return Array.from(
        mapa.values()
    ).sort(
        (a, b) =>
            a.nombre.localeCompare(
                b.nombre
            )
    );

}


async function obtenerCiudadesDelPais(
    pais
) {

    if (!pais) {
        return [];
    }

    if (!navigator.onLine) {
        return [];
    }

    try {

        const respuesta =
            await fetch(
                COUNTRIES_API,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            country:
                                pais
                        })
                }
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las ciudades."
            );

        }

        const datos =
            await respuesta.json();

        if (
            !datos ||
            !Array.isArray(
                datos.data
            )
        ) {
            return [];
        }

        const ciudades =
            datos.data
                .map(
                    ciudad =>
                        String(
                            ciudad || ""
                        ).trim()
                )
                .filter(
                    Boolean
                );

        const mapa =
            new Map();

        ciudades.forEach(
            ciudad => {

                const clave =
                    normalizarTexto(
                        ciudad
                    );

                if (
                    clave &&
                    !mapa.has(
                        clave
                    )
                ) {

                    mapa.set(
                        clave,
                        ciudad
                    );

                }

            }
        );

        return Array.from(
            mapa.values()
        ).sort(
            (a, b) =>
                a.localeCompare(
                    b
                )
        );

    } catch (error) {

        console.error(
            "Error obteniendo ciudades:",
            error
        );

        return [];

    }

}


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

    if (
        vistaZonas === "ciudades"
    ) {

        cargarVistaCiudades(
            lista,
            filtro
        );

        return;

    }

    if (
        vistaZonas === "sectores"
    ) {

        cargarVistaSectores(
            lista,
            filtro
        );

        return;

    }

    cargarVistaPersonas(
        lista,
        filtro
    );

}


function crearBotonVolver(
    destino
) {

    const boton =
        document.createElement(
            "button"
        );

    boton.type =
        "button";

    boton.className =
        "btn-volver-zonas";

    boton.textContent =
        `← ${texto("volver")}`;

    boton.addEventListener(
        "click",
        () => {

            if (
                destino ===
                "ciudades"
            ) {

                vistaZonas =
                    "ciudades";

                ciudadSeleccionada =
                    null;

                sectorSeleccionado =
                    null;

            } else {

                vistaZonas =
                    "sectores";

                sectorSeleccionado =
                    null;

            }

            if (inputBuscarZona) {
                inputBuscarZona.value =
                    "";
            }

            cargarZonas();

        }
    );

    return boton;

}


function cargarVistaCiudades(
    lista,
    filtro
) {

    lista.innerHTML =
        "";

    const titulo =
        document.createElement(
            "div"
        );

    titulo.className =
        "zonas-contexto";

    titulo.innerHTML = `
        <strong>
            ${escaparHTML(
                paisDetectado ||
                texto("cobertura")
            )}
        </strong>

        <span>
            ${escaparHTML(
                texto("personasRegistradas")
            )}
        </span>
    `;

    lista.appendChild(
        titulo
    );

    if (
        ciudadesDelPais.length === 0
    ) {

        const cargando =
            document.createElement(
                "div"
            );

        cargando.className =
            "item-zona";

        cargando.textContent =
            texto(
                "cargandoCiudades"
            );

        lista.appendChild(
            cargando
        );

        return;

    }

    const filtroNormalizado =
        normalizarTexto(
            filtro
        );

    const ciudadesFiltradas =
        ciudadesDelPais.filter(
            ciudad =>
                normalizarTexto(
                    ciudad
                ).includes(
                    filtroNormalizado
                )
        );

    if (
        ciudadesFiltradas.length ===
        0
    ) {

        lista.innerHTML += `
            <div class="item-zona">
                ${escaparHTML(
                    texto("noCiudades")
                )}
            </div>
        `;

        return;

    }

    const ciudadesOrdenadas =
        [...ciudadesFiltradas]
            .sort(
                (a, b) => {

                    const casosA =
                        obtenerCantidadCiudad(
                            a
                        );

                    const casosB =
                        obtenerCantidadCiudad(
                            b
                        );

                    if (
                        casosA !==
                        casosB
                    ) {

                        return casosB -
                            casosA;

                    }

                    return a.localeCompare(
                        b
                    );

                }
            );

    ciudadesOrdenadas.forEach(
        ciudad => {

            const cantidad =
                obtenerCantidadCiudad(
                    ciudad
                );

            const item =
                document.createElement(
                    "button"
                );

            item.type =
                "button";

            item.className =
                "item-zona item-ciudad";

            item.innerHTML = `

                <div>

                    <strong>
                        ${escaparHTML(
                            ciudad
                        )}
                    </strong>

                    <div class="zona-descripcion">
                        ${cantidad}
                        ${
                            cantidad === 1
                                ? escaparHTML(
                                    texto("caso")
                                )
                                : escaparHTML(
                                    texto("casos")
                                )
                        }
                    </div>

                </div>

                <span class="badge-casos">
                    ${cantidad}
                </span>

            `;

            item.addEventListener(
                "click",
                () => {

                    ciudadSeleccionada =
                        ciudad;

                    vistaZonas =
                        "sectores";

                    if (inputBuscarZona) {
                        inputBuscarZona.value =
                            "";
                    }

                    cargarZonas();

                }
            );

            lista.appendChild(
                item
            );

        }
    );

}


function cargarVistaSectores(
    lista,
    filtro
) {

    lista.innerHTML =
        "";

    lista.appendChild(
        crearBotonVolver(
            "ciudades"
        )
    );

    const encabezado =
        document.createElement(
            "div"
        );

    encabezado.className =
        "zonas-contexto";

    encabezado.innerHTML = `
        <strong>
            ${escaparHTML(
                ciudadSeleccionada ||
                ""
            )}
        </strong>

        <span>
            ${escaparHTML(
                texto("zonas")
            )}
        </span>
    `;

    lista.appendChild(
        encabezado
    );

    const sectores =
        obtenerSectoresCiudad(
            ciudadSeleccionada
        );

    const filtroNormalizado =
        normalizarTexto(
            filtro
        );

    const filtrados =
        sectores.filter(
            sector =>
                normalizarTexto(
                    sector.nombre
                ).includes(
                    filtroNormalizado
                )
        );

    if (
        filtrados.length === 0
    ) {

        lista.innerHTML += `
            <div class="item-zona">
                ${escaparHTML(
                    texto("noSectores")
                )}
            </div>
        `;

        return;

    }

    filtrados.forEach(
        sector => {

            const item =
                document.createElement(
                    "button"
                );

            item.type =
                "button";

            item.className =
                "item-zona item-sector";

            item.innerHTML = `

                <div>

                    <strong>
                        ${escaparHTML(
                            sector.nombre
                        )}
                    </strong>

                    <div class="zona-descripcion">
                        ${sector.casos}
                        ${
                            sector.casos === 1
                                ? escaparHTML(
                                    texto("caso")
                                )
                                : escaparHTML(
                                    texto("casos")
                                )
                        }
                    </div>

                </div>

                <span class="badge-casos">
                    ${sector.casos}
                </span>

            `;

            item.addEventListener(
                "click",
                () => {

                    sectorSeleccionado =
                        sector.nombre;

                    vistaZonas =
                        "personas";

                    if (inputBuscarZona) {
                        inputBuscarZona.value =
                            "";
                    }

                    cargarZonas();

                }
            );

            lista.appendChild(
                item
            );

        }
    );

}


function cargarVistaPersonas(
    lista,
    filtro
) {

    lista.innerHTML =
        "";

    lista.appendChild(
        crearBotonVolver(
            "sectores"
        )
    );

    const encabezado =
        document.createElement(
            "div"
        );

    encabezado.className =
        "zonas-contexto";

    encabezado.innerHTML = `
        <strong>
            ${escaparHTML(
                sectorSeleccionado ||
                ""
            )}
        </strong>

        <span>
            ${escaparHTML(
                ciudadSeleccionada ||
                ""
            )}
        </span>
    `;

    lista.appendChild(
        encabezado
    );

    const personas =
        obtenerCasosSector(
            ciudadSeleccionada,
            sectorSeleccionado
        );

    const filtroNormalizado =
        normalizarTexto(
            filtro
        );

    const personasFiltradas =
        personas.filter(
            persona => {

                const textoPersona =
                    `
                    ${persona.nombre}
                    ${persona.ciudad}
                    ${persona.zona}
                    ${persona.edad}
                    ${persona.ropa || ""}
                    `;

                return normalizarTexto(
                    textoPersona
                ).includes(
                    filtroNormalizado
                );

            }
        );

    if (
        personasFiltradas.length === 0
    ) {

        lista.innerHTML += `
            <div class="item-zona">
                ${escaparHTML(
                    texto("noPersonas")
                )}
            </div>
        `;

        return;

    }

    personasFiltradas.forEach(
        persona => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "persona-zona-detalle";

            item.innerHTML = `

                ${
                    persona.foto
                        ? `
                            <img
                                src="${escaparHTML(
                                    persona.foto
                                )}"
                                alt="${escaparHTML(
                                    persona.nombre
                                )}"
                            >
                        `
                        : ""
                }

                <div class="persona-zona-info">

                    <h3>
                        ${escaparHTML(
                            persona.nombre
                        )}
                    </h3>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("edad")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.edad
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("ciudad")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.ciudad
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("sector")
                            )}:
                        </strong>
                        ${escaparHTML(
                            persona.zona
                        )}
                    </p>

                    <p>
                        <strong>
                            ${escaparHTML(
                                texto("desaparecio")
                            )}:
                        </strong>
                        ${escaparHTML(
                            formatearFechaDesaparicion(
                                persona.fechaDesaparicion,
                                persona.horaDesaparicion
                            )
                        )}
                    </p>

                    ${
                        persona.ropa
                            ? `
                                <p>
                                    <strong>
                                        ${escaparHTML(
                                            texto("ropa")
                                        )}:
                                    </strong>
                                    ${escaparHTML(
                                        persona.ropa
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>
            `;

            lista.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   GEOLOCALIZACIÓN + REVERSE GEOCODING
   ========================================================= */

async function obtenerPaisPorCoordenadas(
    latitud,
    longitud
) {

    if (!navigator.onLine) {
        throw new Error(
            "Sin conexión"
        );
    }

    const url =
        `${REVERSE_GEOCODING_API}?latitude=${encodeURIComponent(
            latitud
        )}&longitude=${encodeURIComponent(
            longitud
        )}&localityLanguage=en`;

    const respuesta =
        await fetch(
            url,
            {
                cache:
                    "no-store"
            }
        );

    if (!respuesta.ok) {

        throw new Error(
            "Reverse geocoding no disponible"
        );

    }

    const datos =
        await respuesta.json();

    return {

        pais:
            datos.countryName ||
            "",

        ciudad:
            datos.city ||
            datos.locality ||
            datos.principalSubdivision ||
            ""

    };

}


async function procesarUbicacion(
    posicion
) {

    const ubicacion =
        obtenerElemento(
            "ubicacion-dispositivo"
        );

    const lat =
        posicion.coords.latitude;

    const lon =
        posicion.coords.longitude;

    if (ubicacion) {

        ubicacion.textContent =
            `${texto(
                "ubicacionDetectada"
            )} · ${lat.toFixed(
                3
            )}, ${lon.toFixed(
                3
            )}`;

    }

    try {

        const resultado =
            await obtenerPaisPorCoordenadas(
                lat,
                lon
            );

        paisDetectado =
            resultado.pais ||
            paisDetectado;

        ciudadDetectada =
            resultado.ciudad ||
            ciudadDetectada;

        if (paisDetectado) {

            localStorage.setItem(
                STORAGE_PAIS,
                paisDetectado
            );

        }

        if (ciudadDetectada) {

            localStorage.setItem(
                STORAGE_CIUDAD,
                ciudadDetectada
            );

        }

        if (ubicacion) {

            ubicacion.textContent =
                ciudadDetectada
                    ? `${ciudadDetectada}, ${paisDetectado}`
                    : paisDetectado ||
                      texto(
                          "ubicacionDetectada"
                      );

        }

        ciudadesDelPais =
            await obtenerCiudadesDelPais(
                paisDetectado
            );

        if (
            ciudadesDelPais.length ===
            0
        ) {

            const ciudadesDeReportes =
                dbPersonas
                    .filter(
                        persona =>
                            persona.ciudad
                    )
                    .map(
                        persona =>
                            persona.ciudad
                    );

            ciudadesDelPais =
                Array.from(
                    new Map(
                        ciudadesDeReportes.map(
                            ciudad => [
                                normalizarTexto(
                                    ciudad
                                ),
                                ciudad
                            ]
                        )
                    ).values()
                ).sort(
                    (a, b) =>
                        a.localeCompare(
                            b
                        )
                );

        }

        if (
            vistaZonas ===
            "ciudades"
        ) {
            cargarZonas();
        }

    } catch (error) {

        console.error(
            "Error obteniendo país:",
            error
        );

        if (ubicacion) {

            ubicacion.textContent =
                paisDetectado ||
                texto("sinPais");

        }

        if (
            ciudadesDelPais.length ===
            0
        ) {

            ciudadesDelPais =
                dbPersonas
                    .filter(
                        persona =>
                            persona.ciudad
                    )
                    .map(
                        persona =>
                            persona.ciudad
                    );

        }

        cargarZonas();

    }

}


function inicializarGeolocalizacionYZonas() {

    if (
        geolocalizacionInicializada
    ) {
        return;
    }

    if (!terminosAceptados()) {
        return;
    }

    if (!navigator.onLine) {
        actualizarEstadoInternet();
        return;
    }

    geolocalizacionInicializada =
        true;

    cargarZonas();

    const ubicacion =
        obtenerElemento(
            "ubicacion-dispositivo"
        );

    if (
        !navigator.geolocation
    ) {

        if (ubicacion) {

            ubicacion.textContent =
                texto(
                    "geolocalizacionNoDisponible"
                );

        }

        return;

    }

    navigator.geolocation.getCurrentPosition(

        posicion => {

            procesarUbicacion(
                posicion
            );

        },

        error => {

            console.warn(
                "No fue posible obtener la ubicación:",
                error
            );

            if (ubicacion) {

                ubicacion.textContent =
                    texto(
                        "ubicacionNoDetectada"
                    );

            }

            if (
                dbPersonas.length > 0
            ) {

                ciudadesDelPais =
                    Array.from(
                        new Map(
                            dbPersonas
                                .filter(
                                    p =>
                                        p.ciudad
                                )
                                .map(
                                    p => [
                                        normalizarTexto(
                                            p.ciudad
                                        ),
                                        p.ciudad
                                    ]
                                )
                        ).values()
                    );

                cargarZonas();

            }

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
   ESCÁNER FACIAL
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


async function cargarModelosFaciales() {

    if (
        modelosFacialesCargados
    ) {
        return true;
    }

    if (
        cargandoModelosFaciales
    ) {
        return cargandoModelosFaciales;
    }

    if (
        typeof faceapi ===
        "undefined"
    ) {

        throw new Error(
            "face-api no está disponible"
        );

    }

    cargandoModelosFaciales =
        (async () => {

            await faceapi.nets.tinyFaceDetector.loadFromUri(
                MODEL_URL
            );

            await faceapi.nets.faceLandmark68Net.loadFromUri(
                MODEL_URL
            );

            await faceapi.nets.faceRecognitionNet.loadFromUri(
                MODEL_URL
            );

            modelosFacialesCargados =
                true;

            return true;

        })();

    try {

        return await cargandoModelosFaciales;

    } catch (error) {

        cargandoModelosFaciales =
            null;

        modelosFacialesCargados =
            false;

        throw error;

    }

}


function cargarImagenParaFaceAPI(
    archivo
) {

    return new Promise(
        (resolve, reject) => {

            const lector =
                new FileReader();

            lector.onload =
                () => {

                    const imagen =
                        new Image();

                    imagen.onload =
                        () =>
                            resolve(
                                imagen
                            );

                    imagen.onerror =
                        () =>
                            reject(
                                new Error(
                                    "No se pudo cargar la imagen."
                                )
                            );

                    imagen.src =
                        lector.result;

                };

            lector.onerror =
                () =>
                    reject(
                        new Error(
                            "No se pudo leer la imagen."
                        )
                    );

            lector.readAsDataURL(
                archivo
            );

        }
    );

}


async function detectarCara(
    archivo
) {

    const imagen =
        await cargarImagenParaFaceAPI(
            archivo
        );

    const opciones =
        new faceapi.TinyFaceDetectorOptions(
            {
                inputSize:
                    416,

                scoreThreshold:
                    0.5
            }
        );

    const detecciones =
        await faceapi
            .detectAllFaces(
                imagen,
                opciones
            )
            .withFaceLandmarks()
            .withFaceDescriptors();

    return detecciones;

}


function mostrarErrorEscaner(
    mensaje
) {

    if (radarEscaner) {

        radarEscaner.classList.add(
            "oculto"
        );

    }

    if (resultadoAnalisis) {

        resultadoAnalisis.classList.remove(
            "oculto"
        );

        resultadoAnalisis.classList.add(
            "resultado-error"
        );

    }

    if (barraLlenado) {

        barraLlenado.style.width =
            "0%";

    }

    if (textoCoincidencia) {

        textoCoincidencia.textContent =
            mensaje;

    }

    if (detallesBiometricos) {

        detallesBiometricos.textContent =
            texto(
                "escanerApoyo"
            );

    }

}


function mostrarResultadoFacial(
    distancia
) {

    const porcentaje =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    (1 -
                        distancia /
                            0.6) *
                        100
                )
            )
        );

    let nivel;

    if (
        porcentaje >= 80
    ) {

        nivel =
            texto(
                "altaSimilitud"
            );

    } else if (
        porcentaje >= 60
    ) {

        nivel =
            texto(
                "similitudModerada"
            );

    } else {

        nivel =
            texto(
                "bajaSimilitud"
            );

    }

    if (resultadoAnalisis) {

        resultadoAnalisis.classList.remove(
            "oculto",
            "resultado-error"
        );

    }

    if (barraLlenado) {

        barraLlenado.style.width =
            `${porcentaje}%`;

    }

    if (textoCoincidencia) {

        textoCoincidencia.textContent =
            `${texto(
                "similitud"
            )}: ${porcentaje}% · ${nivel}`;

    }

    if (detallesBiometricos) {

        detallesBiometricos.textContent =
            texto(
                "escanerApoyo"
            );

    }

}


if (btnIniciarEscaneo) {

    btnIniciarEscaneo.addEventListener(
        "click",
        async () => {

            if (!navigator.onLine) {

                actualizarEstadoInternet();

                return;

            }

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
                !foto2 ||
                !foto1.files?.[0] ||
                !foto2.files?.[0]
            ) {

                alert(
                    texto(
                        "seleccionaDos"
                    )
                );

                return;

            }

            const archivo1 =
                foto1.files[0];

            const archivo2 =
                foto2.files[0];

            if (
                archivo1.size >
                MAX_IMAGEN_BYTES ||
                archivo2.size >
                MAX_IMAGEN_BYTES
            ) {

                alert(
                    `Las imágenes no pueden superar ${MAX_IMAGEN_MB} MB.`
                );

                return;

            }

            btnIniciarEscaneo.disabled =
                true;

            if (resultadoAnalisis) {

                resultadoAnalisis.classList.add(
                    "oculto"
                );

                resultadoAnalisis.classList.remove(
                    "resultado-error"
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

            try {

                await cargarModelosFaciales();

                const [
                    detecciones1,
                    detecciones2
                ] =
                    await Promise.all(
                        [
                            detectarCara(
                                archivo1
                            ),
                            detectarCara(
                                archivo2
                            )
                        ]
                    );

                if (
                    detecciones1.length ===
                    0
                ) {

                    mostrarErrorEscaner(
                        texto(
                            "noPersona"
                        )
                    );

                    return;

                }

                if (
                    detecciones2.length ===
                    0
                ) {

                    mostrarErrorEscaner(
                        texto(
                            "noPersona"
                        )
                    );

                    return;

                }

                if (
                    detecciones1.length >
                    1 ||
                    detecciones2.length >
                    1
                ) {

                    mostrarErrorEscaner(
                        texto(
                            "variasPersonas"
                        )
                    );

                    return;

                }

                const descriptor1 =
                    detecciones1[0]
                        .descriptor;

                const descriptor2 =
                    detecciones2[0]
                        .descriptor;

                const distancia =
                    faceapi.euclideanDistance(
                        descriptor1,
                        descriptor2
                    );

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            800
                        )
                );

                mostrarResultadoFacial(
                    distancia
                );

            } catch (error) {

                console.error(
                    "Error en el análisis facial:",
                    error
                );

                mostrarErrorEscaner(
                    texto(
                        "errorModelo"
                    )
                );

            } finally {

                if (radarEscaner) {

                    radarEscaner.classList.add(
                        "oculto"
                    );

                }

                btnIniciarEscaneo.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   BOTÓN PERFIL
   ========================================================= */

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
   NOTIFICACIONES
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
                    texto(
                        "noNotificaciones"
                    )
                );

                return;

            }

            alert(
                `${total} ${
                    total === 1
                        ? texto(
                            "notificacion"
                        )
                        : texto(
                            "notificaciones"
                        )
                }`
            );

            limpiarNotificaciones();

        }
    );

}


/* =========================================================
   BÚSQUEDA DE ZONAS
   ========================================================= */

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
   ESCAPE PARA MODALES
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        if (
            modalCuenta &&
            !modalCuenta.classList.contains(
                "oculto"
            )
        ) {

            cerrarModalCuenta();

            return;

        }

        if (
            modalEditar &&
            !modalEditar.classList.contains(
                "oculto"
            )
        ) {

            cerrarModalEditar();

            return;

        }

        if (
            modalTerminos &&
            !modalTerminos.classList.contains(
                "oculto"
            ) &&
            modalTerminos.dataset.obligatorio !==
                "true"
        ) {

            cerrarTerminos();

        }

    }
);


/* =========================================================
   INICIO
   ========================================================= */

configurarSelectorIdioma();

actualizarEstadoInternet();

actualizarContadorNotificaciones(
    obtenerNotificaciones()
);

cargarAlertasInicio();

aplicarIdioma();
aplicarIdiomaTerminos();

if (!idiomaActual) {

    abrirSelectorIdioma(
        true
    );

} else {

    iniciarFlujoInicial();

}


/* =========================================================
   FLUJO INICIAL
   ========================================================= */

function iniciarFlujoInicial() {

    if (!idiomaActual) {
        return;
    }

    aplicarIdioma();

    actualizarEstadoInternet();

    if (!navigator.onLine) {
        return;
    }

    if (
        terminosAceptados()
    ) {

        inicializarGeolocalizacionYZonas();

    } else {

        abrirTerminos(
            true
        );

    }

}


/* =========================================================
   FIN
   ========================================================= */