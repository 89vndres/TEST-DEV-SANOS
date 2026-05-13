/**
 * Tests unitarios para el Builder Pattern (ReporteBuilder)
 */

import { ReporteBuilder, ReporteDirector } from '../builders/ReporteBuilder';

describe('ReporteBuilder', () => {
  describe('build', () => {
    it('debe construir un reporte válido', () => {
      const reporte = new ReporteBuilder()
        .setDescripcion('Se perdió un perro labrador')
        .setUbicacion('Av. Providencia 1234')
        .setTipoReporte('perdido')
        .setMascotaId(1)
        .setUsuarioId(1)
        .build();

      expect(reporte.descripcion).toBe('Se perdió un perro labrador');
      expect(reporte.ubicacion_aproximada).toBe('Av. Providencia 1234');
      expect(reporte.tipo_reporte).toBe('perdido');
      expect(reporte.mascota_id).toBe(1);
      expect(reporte.fecha_reporte).toBeDefined();
    });

    it('debe lanzar error sin descripción', () => {
      expect(() => new ReporteBuilder()
        .setUbicacion('Santiago')
        .setTipoReporte('perdido')
        .build()
      ).toThrow('La descripción del reporte es obligatoria');
    });

    it('debe lanzar error sin tipo de reporte', () => {
      expect(() => new ReporteBuilder()
        .setDescripcion('Descripción')
        .setUbicacion('Santiago')
        .build()
      ).toThrow('El tipo de reporte es obligatorio');
    });

    it('debe lanzar error con tipo inválido', () => {
      expect(() => new ReporteBuilder()
        .setDescripcion('Descripción')
        .setUbicacion('Santiago')
        .setTipoReporte('invalido')
        .build()
      ).toThrow('Tipo de reporte inválido');
    });

    it('debe lanzar error sin ubicación', () => {
      expect(() => new ReporteBuilder()
        .setDescripcion('Descripción')
        .setTipoReporte('perdido')
        .build()
      ).toThrow('La ubicación aproximada es obligatoria');
    });
  });

  describe('tipos válidos', () => {
    const tiposValidos = ['perdido', 'encontrado', 'avistamiento', 'maltrato', 'emergencia'];

    tiposValidos.forEach((tipo) => {
      it(`debe aceptar tipo "${tipo}"`, () => {
        const reporte = new ReporteBuilder()
          .setDescripcion('Descripción de prueba')
          .setUbicacion('Ubicación de prueba')
          .setTipoReporte(tipo)
          .build();

        expect(reporte.tipo_reporte).toBe(tipo);
      });
    });
  });
});

describe('ReporteDirector', () => {
  it('debe crear un reporte de mascota perdida', () => {
    const reporte = ReporteDirector.crearReportePerdido(
      'Se perdió un gato siamés',
      'Las Condes',
      1,
      1
    );

    expect(reporte.tipo_reporte).toBe('perdido');
    expect(reporte.mascota_id).toBe(1);
    expect(reporte.usuario_id).toBe(1);
  });

  it('debe crear un reporte de mascota encontrada', () => {
    const reporte = ReporteDirector.crearReporteEncontrado(
      'Se encontró un perro sin collar',
      'Ñuñoa',
      2
    );

    expect(reporte.tipo_reporte).toBe('encontrado');
    expect(reporte.usuario_id).toBe(2);
  });

  it('debe crear un reporte de emergencia', () => {
    const reporte = ReporteDirector.crearReporteEmergencia(
      'Animal herido en la calle',
      'Maipú',
      3
    );

    expect(reporte.tipo_reporte).toBe('emergencia');
  });
});
