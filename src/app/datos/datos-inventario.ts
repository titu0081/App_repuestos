export interface DatosInventario {
  fila: number;
  sku: string;
  nombreRepuesto: string;
  cantidad: number;
  descripcion: string;
}

export const datosInventario: DatosInventario[] = [
  {
    fila: 1,
    sku: 'SKU-1001',
    nombreRepuesto: 'Pantalla iPhone 13',
    cantidad: 12,
    descripcion: 'Pantalla OLED original para reemplazo',
  },
  {
    fila: 2,
    sku: 'SKU-1002',
    nombreRepuesto: 'Batería Samsung S22',
    cantidad: 18,
    descripcion: 'Batería de alta capacidad',
  },
  {
    fila: 3,
    sku: 'SKU-1003',
    nombreRepuesto: 'Puerto de carga Xiaomi 11',
    cantidad: 25,
    descripcion: 'Módulo de carga USB-C',
  },
  {
    fila: 4,
    sku: 'SKU-1004',
    nombreRepuesto: 'Cámara trasera Motorola G9',
    cantidad: 9,
    descripcion: 'Módulo de cámara principal',
  },
  {
    fila: 5,
    sku: 'SKU-1005',
    nombreRepuesto: 'Flex de encendido Huawei P40',
    cantidad: 14,
    descripcion: 'Flex con botón de encendido y volumen',
  },
  {
    fila: 6,
    sku: 'SKU-1006',
    nombreRepuesto: 'Altavoz iPhone 12',
    cantidad: 20,
    descripcion: 'Altavoz inferior para audio y llamadas',
  },
  {
    fila: 7,
    sku: 'SKU-1007',
    nombreRepuesto: 'Carcasa trasera Samsung S21',
    cantidad: 7,
    descripcion: 'Carcasa de vidrio para reemplazo',
  },
  {
    fila: 8,
    sku: 'SKU-1008',
    nombreRepuesto: 'Micrófono Xiaomi Redmi Note 10',
    cantidad: 11,
    descripcion: 'Módulo de micrófono para llamadas',
  },
  {
    fila: 9,
    sku: 'SKU-1009',
    nombreRepuesto: 'Vibrador Motorola E7',
    cantidad: 5,
    descripcion: 'Módulo de vibración para notificaciones',
  },
  {
    fila: 10,
    sku: 'SKU-1010',
    nombreRepuesto: 'Sensor de proximidad Huawei P30',
    cantidad: 8,
    descripcion: 'Sensor para detección de proximidad',
  },
  {
    fila: 11,
    sku: 'SKU-1011',
    nombreRepuesto: 'Pantalla Samsung S20',
    cantidad: 10,
    descripcion: 'Pantalla AMOLED original para reemplazo',
  },
  {
    fila: 12,
    sku: 'SKU-1012',
    nombreRepuesto: 'Batería iPhone 11',
    cantidad: 15,
    descripcion: 'Batería de alta capacidad para iPhone 11',
  },
  {
    fila: 13,
    sku: 'SKU-1013',
    nombreRepuesto: 'Puerto de carga Huawei P30',
    cantidad: 20,
    descripcion: 'Módulo de carga USB-C para Huawei P30',
  },
  {
    fila: 14,
    sku: 'SKU-1014',
    nombreRepuesto: 'Cámara frontal Samsung S10',
    cantidad: 8,
    descripcion: 'Cámara frontal para selfies y videollamadas',
  },
  {
    fila: 15,
    sku: 'SKU-1015',
    nombreRepuesto: 'Flex de volumen Xiaomi Mi 10',
    cantidad: 12,
    descripcion: 'Flex con botones de volumen para Xiaomi',
  },
];
