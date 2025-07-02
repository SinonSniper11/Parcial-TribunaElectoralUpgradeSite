import { Factura } from '../types';

export const generatePDF = (factura: Factura) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0066cc; padding-bottom: 20px; }
          .logo { color: #0066cc; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .title { color: #333; font-size: 18px; margin-bottom: 5px; }
          .subtitle { color: #666; font-size: 14px; }
          .logo-img { 
            max-width: 28rem; 
            height: auto; 
            margin-bottom: 0px; 
          }
          .factura-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .info-section { margin: 20px 0; }
          .factura-info { flex: 1; }
          .pago-info { text-align: right; flex: 1; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .info-title { font-weight: bold; color: #0066cc; margin-bottom: 10px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { margin: 5px 0; }
          .total-final { font-size: 18px; font-weight: bold; color: #0066cc; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .status { padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }
          .status-pendiente { background-color: #fff3cd; color: #856404; }
          .status-pagado { background-color: #d4edda; color: #155724; }
          .status-cancelado { background-color: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/tepanama-logo.png" alt="Tribunal Electoral" class="logo-img" />
          <div class="title">DIRECCIÓN NACIONAL DE CEDULACIÓN</div>
          <div class="subtitle">República de Panamá</div>
        </div>

        <div class="info-section">
          <h2 style="color: #0066cc;">FACTURA N° ${factura.numeroFactura}</h2>
        </div>

        <div class="factura-header">
          <div class="factura-info">
            <p><strong>Fecha:</strong> ${new Date(
              factura.createdAt,
            ).toLocaleDateString('es-PA')}</p>
            <p><strong>Estado:</strong> <span class="status status-${
              factura.estadoPago
            }">${factura.estadoPago.toUpperCase()}</span></p>
          </div>

          ${
            factura.metodoPago
              ? `
            <div class="pago-info">
              <p><strong>Método de Pago:</strong> ${factura.metodoPago}</p>
              ${
                factura.fechaPago
                  ? `<p><strong>Fecha de Pago:</strong> ${new Date(
                      factura.fechaPago,
                    ).toLocaleDateString('es-PA')}</p>`
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-title">👤 DATOS DEL SOLICITANTE</div>
            <p><strong>Nombre:</strong> ${factura.cedulacion.nombreCompleto}</p>
            <p><strong>Cédula:</strong> ${
              factura.cedulacion.cedulaOriginal || 'N/A'
            }</p>
            <p><strong>Fecha Nacimiento:</strong> ${new Date(
              factura.cedulacion.fechaNacimiento,
            ).toLocaleDateString('es-PA')}</p>
            <p><strong>Lugar Nacimiento:</strong> ${
              factura.cedulacion.lugarNacimiento
            }</p>
            <p><strong>Género:</strong> ${factura.cedulacion.genero}</p>
          </div>
          
          <div class="info-box">
            <div class="info-title">🏛️ TRIBUNAL ASIGNADO</div>
            <p><strong>Nombre:</strong> ${
              factura.cedulacion.tribunal.nombre
            }</p>
            <p><strong>Provincia:</strong> ${
              factura.cedulacion.tribunal.provincia
            }</p>
            <p><strong>Dirección:</strong> ${
              factura.cedulacion.tribunal.direccion || 'N/A'
            }</p>
            <p><strong>Teléfono:</strong> ${
              factura.cedulacion.tribunal.telefono || 'N/A'
            }</p>
          </div>
        </div>

        <div class="info-section">
          <h3 style="color: #0066cc;">DETALLE DE SERVICIOS</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${factura.facturaDetalles
                .map(
                  detalle => `
                <tr>
                  <td>${detalle.servicio.nombre}</td>
                  <td>${detalle.servicio.tipoServicio}</td>
                  <td>${detalle.cantidad}</td>
                  <td>B/. ${parseFloat(
                    detalle.precioUnitario.toString(),
                  ).toFixed(2)}</td>
                  <td>B/. ${parseFloat(detalle.subtotal.toString()).toFixed(
                    2,
                  )}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="total-row">
            <strong>Subtotal: B/. ${parseFloat(
              factura.subtotal.toString(),
            ).toFixed(2)}</strong>
          </div>
          <div class="total-row">
            <strong>Impuestos: B/. ${parseFloat(
              factura.impuestos.toString(),
            ).toFixed(2)}</strong>
          </div>
          <div class="total-row total-final">
            <strong>TOTAL: B/. ${parseFloat(factura.total.toString()).toFixed(
              2,
            )}</strong>
          </div>
        </div>

        

        <div class="footer">
          <p><strong>Tribunal Electoral de la República de Panamá</strong></p>
          <p>Dirección Nacional de Cedulación</p>
          <p>www.tribunal-electoral.gob.pa</p>
          <p>Esta factura es un documento oficial del Tribunal Electoral</p>
        </div>
      </body>
      </html>
    `;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
  printWindow.print();

  // Esperar a que se cargue la imagen antes de imprimir
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};
