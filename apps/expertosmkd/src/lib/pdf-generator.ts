import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PDFDocument } from 'pdf-lib'

/**
 * Convierte un elemento DOM a PDF y fuerza su descarga.
 * Ideal para el generador de Cartas Comerciales.
 */
export async function downloadElementAsPdf(element: HTMLElement, filename: string = 'Propuesta.pdf') {
  try {
    // 1. Tomar "foto" al contenedor DOM (Escala 2 para alta resolución)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff' // Fondo blanco obligatorio para cartas
    })

    const imgData = canvas.toDataURL('image/png')
    
    // 2. Crear documento jsPDF (Tamaño Carta / Letter)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    // 3. Insertar imagen
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    // 4. Descargar
    pdf.save(filename)
    
    return true
  } catch (error) {
    console.error('Error generando PDF:', error)
    return false
  }
}

/**
 * Función avanzada (Opcional): Genera el PDF base, descarga un Brochure anexo (desde una URL) 
 * y los fusiona en un solo archivo PDF usando pdf-lib.
 */
export async function generateAndMergeProposal(element: HTMLElement, brochureUrl: string | null, filename: string = 'Propuesta.pdf') {
  try {
    // 1. Generar Base
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')
    
    const basePdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
    const pdfWidth = basePdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    basePdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    // Obtener buffer del PDF base
    const basePdfBytes = basePdf.output('arraybuffer')

    if (!brochureUrl) {
      // Si no hay anexo, descargar directamente
      basePdf.save(filename)
      return true
    }

    // 2. Cargar PDF base en pdf-lib
    const finalDoc = await PDFDocument.load(basePdfBytes)

    // 3. Descargar y procesar Brochure
    const res = await fetch(brochureUrl)
    if (!res.ok) throw new Error('No se pudo descargar el Brochure anexo.')
    const brochureBytes = await res.arrayBuffer()
    const brochureDoc = await PDFDocument.load(brochureBytes)

    // 4. Unir páginas
    const copiedPages = await finalDoc.copyPages(brochureDoc, brochureDoc.getPageIndices())
    copiedPages.forEach((page) => {
      finalDoc.addPage(page)
    })

    // 5. Descargar Documento fusionado
    const pdfBytes = await finalDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()

    return true
  } catch (error) {
    console.error('Error fusionando PDF:', error)
    return false
  }
}
