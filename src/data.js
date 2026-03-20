// Mock data for NotaríaDoc

export const CONSTRUCTORAS = ['Amarilo', 'Bolívar', 'Constructora Colpatria', 'Pedro Gómez'];

export const PROJECTS_BY_CONSTRUCTORA = {
  'Amarilo':                 ['Ciudad Verde Etapa 3', 'Altos de La Sabana', 'Reserva El Encanto'],
  'Bolívar':                 ['Torre Bolívar 86', 'Cantan Las Flores', 'Parques de Cajicá'],
  'Constructora Colpatria':  ['Quartier Salitre', 'Villeta Green Park', 'Reserva La Colina'],
  'Pedro Gómez':             ['Zuana Beach Resort', 'Ciudadela El Recreo', 'Madelena Reservado'],
};

export const BANCOS = ['Bancolombia', 'Davivienda', 'BBVA', 'Banco de Bogotá', 'Sin hipoteca'];
export const CAJAS  = ['Compensar', 'Colsubsidio', 'Cafam', 'Ninguna'];

export const MOCK_DRAFTS = [
  {
    id: 1,
    constructora: 'Amarilo', proyecto: 'Ciudad Verde Etapa 3',
    banco: 'Bancolombia', caja: 'Compensar',
    nombreComprador: 'María Fernanda Gómez López', cedula: '1020304050',
    email: 'mariafgomez@gmail.com', direccion: 'Cra. 23 No. 45-12 Apto 301, Zipaquirá', ciiu: '4111',
    valorVenta: 285000000, formaPago: 'Hipoteca', valorCredito: 220000000,
    fecha: new Date(Date.now() - 5 * 60 * 1000), status: 'pendiente', escrituraNo: '2847',
  },
  {
    id: 2,
    constructora: 'Bolívar', proyecto: 'Cantan Las Flores',
    banco: 'Davivienda', caja: 'Colsubsidio',
    nombreComprador: 'Carlos Andrés Martínez Ruiz', cedula: '79856234',
    email: 'camartinez@hotmail.com', direccion: 'Calle 12 No. 8-45, Cajicá', ciiu: '',
    valorVenta: 195000000, formaPago: 'Mixto', valorCredito: 150000000,
    fecha: new Date(Date.now() - 22 * 60 * 1000), status: 'en-revision', escrituraNo: '2848',
  },
  {
    id: 3,
    constructora: 'Constructora Colpatria', proyecto: 'Quartier Salitre',
    banco: 'BBVA', caja: 'Cafam',
    nombreComprador: 'Ana Lucía Rodríguez Torres', cedula: '52741085',
    email: 'alrodriguez@empresa.co', direccion: 'Av. El Dorado No. 68C-61 Of. 201, Bogotá', ciiu: '6810',
    valorVenta: 420000000, formaPago: 'Hipoteca', valorCredito: 350000000,
    fecha: new Date(Date.now() - 2 * 3600 * 1000), status: 'aprobado', escrituraNo: '2849',
  },
  {
    id: 4,
    constructora: 'Pedro Gómez', proyecto: 'Ciudadela El Recreo',
    banco: 'Banco de Bogotá', caja: 'Ninguna',
    nombreComprador: 'Jhon Édison Vargas Bejarano', cedula: '1073519280',
    email: 'jedvargas@gmail.com', direccion: 'Calle 80 No. 91-10 Apt. 5B, Bogotá', ciiu: '',
    valorVenta: 158000000, formaPago: 'Contado', valorCredito: 0,
    fecha: new Date(Date.now() - 3 * 3600 * 1000), status: 'pendiente', escrituraNo: '2850',
  },
  {
    id: 5,
    constructora: 'Amarilo', proyecto: 'Altos de La Sabana',
    banco: 'Sin hipoteca', caja: 'Compensar',
    nombreComprador: 'Paola Andrea Suárez Niño', cedula: '1014285963',
    email: 'pasuarez@outlook.com', direccion: 'Trans. 93 No. 47A-55 Casa 12, Zipaquirá', ciiu: '7490',
    valorVenta: 320000000, formaPago: 'Contado', valorCredito: 0,
    fecha: new Date(Date.now() - 5 * 3600 * 1000), status: 'en-revision', escrituraNo: '2851',
  },
  {
    id: 6,
    constructora: 'Bolívar', proyecto: 'Torre Bolívar 86',
    banco: 'Bancolombia', caja: 'Colsubsidio',
    nombreComprador: 'Diego Felipe Hernández Castro', cedula: '1032456789',
    email: 'dfhernandez@company.com', direccion: 'Cra. 7 No. 32-16 Piso 4, Bogotá', ciiu: '4659',
    valorVenta: 512000000, formaPago: 'Hipoteca', valorCredito: 400000000,
    fecha: new Date(Date.now() - 8 * 3600 * 1000), status: 'pendiente', escrituraNo: '2852',
  },
  {
    id: 7,
    constructora: 'Constructora Colpatria', proyecto: 'Villeta Green Park',
    banco: 'Davivienda', caja: 'Cafam',
    nombreComprador: 'Luz Marina Pedraza Fonseca', cedula: '46452100',
    email: 'lmpedraza@notaria.gov.co', direccion: 'Calle 5 No. 3-22, Villeta', ciiu: '6820',
    valorVenta: 185000000, formaPago: 'Hipoteca', valorCredito: 140000000,
    fecha: new Date(Date.now() - 1 * 3600 * 1000), status: 'pendiente', escrituraNo: '2853',
  },
];
