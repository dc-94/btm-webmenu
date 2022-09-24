var pdfDoc = null,
pageNum = 1,
pageRendering = false,
pageNumPending = null,
scale = 1.5,
canvas = document.getElementById('pdf_canvas')
ctx = canvas.getContext('2d')


function renderPage(num){
    pageRendering = true
    pdfDoc.getPage(num).then((page)=>{
        var viewport = page.getViewport({scale: canvas.height / page.getViewport({scale: 1}).height});
        canvas.width = viewport.width
        
        var renderContext ={
            canvasContext: ctx,
            viewport: viewport
        }
        var renderTask = page.render(renderContext)
        renderTask.promise.then(()=>{
            pageRendering = false;
            if (pageNumPending !== null){
                renderPage(pageNumPending)
                pageNumPending = null
            }
        })
    })
    document.getElementById('page_num').textContent = num;
}

function queueRenderPage(num){
    if (pageRendering){
        pageNumPending = num
    }else{
        renderPage(num)
    }
}
function onPrevPage(){
    if (pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum)
}
document.getElementById('prev').addEventListener('click',onPrevPage)

function onNextPage(){
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum)
}
document.getElementById('next').addEventListener('click',onNextPage)

pdfjsLib.getDocument('menus/full-menu.pdf').promise.then((doc) => {
    pdfDoc = doc
    document.getElementById('page_count').textContent = doc.numPages;
    renderPage(pageNum)
})