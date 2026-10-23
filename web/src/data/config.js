// Textos y datos del concurso que el cliente puede cambiar. Centralizados aquí a propósito.

export const CONCURSO = {
  nombre: 'Ruta del Coffee Show Supermaxi',
  inicio: '16 de octubre',
  cierre: '22 de noviembre',
  ganadores: 'ocho',
  // TODO: el wireframe corta el texto ("participa por una ..."). Confirmar premio con el cliente.
  llamado: 'Vota por tu Café de Especialidad Favorito y participa por una cafetera',
};

export const EVENTO = {
  nombre: 'Coffee Show Supermaxi',
  fechas: '27 - 28 Febrero',
  lugar: 'CCI - Arena',
  // Poner en true para mostrar el botón "Comprar Entradas" y el logo de Buen Plan.
  mostrarEntradas: false,
  // TODO: link real de venta de entradas.
  urlEntradas: 'https://www.buenplan.com.ec/event/coffee-show-supermaxi',
};

export const REDES = [
  { id: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com/coffeeshowec/' },
  { id: 'tiktok', nombre: 'TikTok', url: 'https://www.tiktok.com/@coffeeshowec' },
  { id: 'facebook', nombre: 'Facebook', url: 'https://www.facebook.com/CoffeeShowEc/' },
];

export const COPYRIGHT = 'Todos los derechos reservados Coffee Show 2027';
