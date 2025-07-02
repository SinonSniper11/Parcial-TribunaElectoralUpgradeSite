import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        cedulacion: {
          include: {
            tribunal: true
          }
        },
        facturaDetalles: {
          include: {
            servicio: true
          }
        }
      }
    });
    return NextResponse.json(facturas);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch facturas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validation
    const {
      cedulacionId,
      servicios,
      estadoPago = 'pendiente',
      metodoPago,
      fechaPago,
      impuestos = 0
    } = body;

    // Validate required fields
    if (!cedulacionId) {
      return NextResponse.json(
        { error: 'cedulacionId es requerido' }, 
        { status: 400 }
      );
    }

    if (!servicios || !Array.isArray(servicios) || servicios.length === 0) {
      return NextResponse.json(
        { error: 'servicios es requerido y debe ser un array no vacío' }, 
        { status: 400 }
      );
    }

    // Validate servicios array
    for (const servicio of servicios) {
      if (!servicio.servicioId || !servicio.cantidad || !servicio.precioUnitario) {
        return NextResponse.json(
          { error: 'Cada servicio debe tener servicioId, cantidad y precioUnitario' }, 
          { status: 400 }
        );
      }
    }

    // Check if cedulacion exists
    const cedulacionExists = await prisma.cedulacion.findUnique({
      where: { id: parseInt(cedulacionId) }
    });

    if (!cedulacionExists) {
      return NextResponse.json(
        { error: 'Cedulación no encontrada' }, 
        { status: 404 }
      );
    }

    // Verify all servicios exist
    const servicioIds = servicios.map(s => parseInt(s.servicioId));
    const existingServicios = await prisma.servicio.findMany({
      where: { id: { in: servicioIds } }
    });

    if (existingServicios.length !== servicioIds.length) {
      return NextResponse.json(
        { error: 'Uno o más servicios no existen' }, 
        { status: 404 }
      );
    }

    // Generate unique invoice number
    const timestamp = Date.now();
    const numeroFactura = `FAC-${timestamp}`;

    // Calculate totals with better error handling
    let subtotal = 0;
    try {
      servicios.forEach((servicio: any) => {
        const precio = parseFloat(servicio.precioUnitario);
        const cantidad = parseInt(servicio.cantidad);
        
        if (isNaN(precio) || isNaN(cantidad)) {
          throw new Error('Precio unitario y cantidad deben ser números válidos');
        }
        
        subtotal += precio * cantidad;
      });
    } catch (calcError) {
      return NextResponse.json(
        { error: 'Error en el cálculo de totales: ' + calcError.message }, 
        { status: 400 }
      );
    }

    const impuestosAmount = parseFloat(impuestos) || 0;
    const total = subtotal + impuestosAmount;

    // Calculate payment date (1 month after creation)
    const fechaCreacion = new Date();
    const fechaPagoCalculada = new Date(fechaCreacion);
    fechaPagoCalculada.setMonth(fechaPagoCalculada.getMonth() + 1);

    // Create invoice with transaction
    const factura = await prisma.$transaction(async (tx) => {
      // Create main invoice
      const newFactura = await tx.factura.create({
        data: {
          cedulacionId: parseInt(cedulacionId),
          numeroFactura,
          subtotal,
          impuestos: impuestosAmount,
          total,
          estadoPago,
          metodoPago: metodoPago || null,
          fechaPago: fechaPago ? new Date(fechaPago) : fechaPagoCalculada
        }
      });

      // Create invoice details
      const facturaDetalles = [];
      for (const servicio of servicios) {
        const cantidad = parseInt(servicio.cantidad);
        const precioUnitario = parseFloat(servicio.precioUnitario);
        const subtotalDetalle = precioUnitario * cantidad;

        const detalle = await tx.facturaDetalle.create({
          data: {
            facturaId: newFactura.id,
            servicioId: parseInt(servicio.servicioId),
            cantidad,
            precioUnitario,
            subtotal: subtotalDetalle
          }
        });
        
        facturaDetalles.push(detalle);
      }

      // Return complete invoice with relations
      return tx.factura.findUnique({
        where: { id: newFactura.id },
        include: {
          cedulacion: {
            include: {
              tribunal: true
            }
          },
          facturaDetalles: {
            include: {
              servicio: true
            }
          }
        }
      });
    });

    return NextResponse.json(factura, { status: 201 });

  } catch (error) {
    console.error('Error creando factura:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una factura con este número' }, 
        { status: 409 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Error de relación en la base de datos' }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor al crear la factura' }, 
      { status: 500 }
    );
  }
}