/**
 * Beatmemo Digital Menu Engine - FIXED VERSION
 */

// 1. Configuración GLOBAL del Worker (Fuera de cualquier función)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

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

        // Auto-cierre del menú al hacer scroll
        window.addEventListener('scroll', () => {
            if (dropdownToggle && dropdownToggle.checked) {
                dropdownToggle.checked = false;
            }
        }, { passive: true });

    } else {
        // MODO HOME
        if(viewHome) viewHome.style.display = 'block';
        if(viewVisor) viewVisor.style.display = 'none';
    }
});

async function initVisor(tipo) {
    const titulos = {
        'fullmenu': 'CARTA PRINCIPAL',
        'mediodia': 'MENÚ EJECUTIVO',
        'hh': 'HAPPY HOUR',
        'whisky': 'WHISKY COLLECTION'
    };

    const label = document.getElementById('pdf_name');
    if (label) label.textContent = titulos[tipo] || 'MENÚ';
    
    // Cache Busting
    const versionToken = new Date().getTime();
    const pdfPath = `menus/${tipo}.pdf?v=${versionToken}`;
    
    // Llamada a la carga
    await loadPDF(pdfPath);
}

async function loadPDF(url) {
    const container = document.getElementById('pdf-viewer-container');
    const loader = document.getElementById('loader-container');
    
    if (!container) return;

    try {
        // Usamos la API de PDF.js correctamente
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        container.innerHTML = '';

        // Renderizado secuencial
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            await renderPage(pdf, pageNum, container);
        }

        if (loader) loader.style.display = 'none';

    } catch (error) {
        console.error('Error cargando PDF:', error);
        const label = document.getElementById('pdf_name');
        if (label) label.textContent = "ARCHIVO NO ENCONTRADO";
        if (loader) {
            loader.innerHTML = `<p style="color:red; padding:20px;">
                Error: No se pudo cargar el archivo en: <br> ${url}
            </p>`;
        }
    }
}

async function renderPage(pdf, num, container) {
    const page = await pdf.getPage(num);
    
    // Escala responsiva basada en el ancho del contenedor
    const windowWidth = window.innerWidth;
    const scale = windowWidth < 600 ? 1.0 : 1.5;
    const viewport = page.getViewport({ scale: scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.className = 'pdf-page';

    container.appendChild(canvas);

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;
}