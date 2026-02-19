pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Estado Global
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
const scaleFactor = 0.90; // REQUIREMENT: 90% del ancho de pantalla

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoMenu = urlParams.get('tipo');

    const viewHome = document.getElementById('view-home');
    const viewVisor = document.getElementById('view-visor');
    const dropdownToggle = document.getElementById('openDropdown');

    if (tipoMenu) {
        // MODO VISOR
        if(viewHome) viewHome.style.display = 'none';
        if(viewVisor) viewVisor.style.display = 'block';
        
        initVisor(tipoMenu);

        // Listeners de Botones
        document.getElementById('prev-page').addEventListener('click', onPrevPage);
        document.getElementById('next-page').addEventListener('click', onNextPage);

        // Auto-cierre del menú al hacer scroll o click fuera
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-container')) {
                if(dropdownToggle) dropdownToggle.checked = false;
            }
        });

    } else {
        // MODO HOME
        if(viewHome) viewHome.style.display = 'block';
        if(viewVisor) viewVisor.style.display = 'none';
    }
});

async function initVisor(tipo) {
    const titulos = {
        'fullmenu1': 'CARTA PRINCIPAL',
        'ejecutivo1': 'MENÚ EJECUTIVO',
        'hh1': 'HAPPY HOUR',
        'whisky1': 'WHISKY COLLECTION'
    };
    
    document.getElementById('pdf_name').textContent = titulos[tipo] || 'MENÚ';

    const versionToken = new Date().getTime();
    const pdfPath = `menus/${tipo}.pdf?v=${versionToken}`;

    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        
        // Actualizar total de páginas
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        
        // Ocultar Loader
        document.getElementById('loader-container').style.display = 'none';

        // Renderizar Página 1
        renderPage(pageNum);

    } catch (error) {
        console.error('Error al cargar PDF:', error);
        document.getElementById('loader-container').innerHTML = "<p style='color:red'>Error de carga.</p>";
    }
}

/**
 * Renderiza la página actual
 */
function renderPage(num) {
    pageRendering = true;
    
    // Fetch de la página
    pdfDoc.getPage(num).then(function(page) {
        const canvas = document.getElementById('the-canvas');
        const ctx = canvas.getContext('2d');

        // 1. CALCULAR ESCALA PARA EL 90% DEL ANCHO
        // Obtenemos el viewport a escala 1.0 primero para saber su ancho real
        const unscaledViewport = page.getViewport({scale: 1.0});
        
        // El ancho deseado es el 90% del ancho de la ventana del dispositivo
        const desiredWidth = window.innerWidth * scaleFactor;
        
        // La escala necesaria es: Ancho Deseado / Ancho Original
        const scale = desiredWidth / unscaledViewport.width;
        
        // Ahora sí, creamos el viewport final con la escala calculada
        const viewport = page.getViewport({scale: scale});

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        // Esperar a que termine de renderizar
        renderTask.promise.then(function() {
            pageRendering = false;
            
            // Si alguien pidió otra página mientras renderizábamos, la procesamos ahora
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }

            // SENIOR FEATURE: PRELOAD
            // Una vez que la página actual está lista, precargamos la siguiente en silencio
            if (pageNum < pdfDoc.numPages) {
                console.log("Preloading page " + (pageNum + 1));
                pdfDoc.getPage(pageNum + 1); // Solo llamarla la mete en caché
            }
        });
    });

    // Actualizar UI de número de página
    document.getElementById('page_num').textContent = num;
}

/**
 * Gestión de Cola de Renderizado (Para evitar crashes si clickean muy rápido)
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Funciones de Navegación
 */
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}