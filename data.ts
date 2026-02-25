import { Guide } from './types';

export const guides: Guide[] = [
  {
    id: 'g1',
    title: 'La Creación y los Orígenes',
    description: 'El comienzo de todo: El universo, la tierra y la humanidad.',
    order: 1,
    content: [
      {
        title: 'En el principio',
        body: 'La Biblia comienza con el libro de Génesis, que significa "origen". En los primeros capítulos, se narra cómo Dios creó el universo, la tierra y todo lo que habita en ella en un proceso ordenado. No es solo un relato científico, sino teológico: establece que Dios es el autor de la vida y que todo lo creado era "bueno en gran manera".'
      },
      {
        title: 'La Humanidad',
        body: 'El punto culminante de la creación fue el ser humano, hecho a "imagen y semejanza" de Dios. Esto implica capacidad de razonar, amar, decidir y tener una relación espiritual con el Creador. Adán y Eva fueron colocados en el Jardín del Edén con el propósito de cuidar la creación y expandir el orden divino.'
      },
      {
        title: 'La Caída',
        body: 'Sin embargo, la humanidad decidió desobedecer a Dios, buscando definir el bien y el mal por su propia cuenta. Este evento, conocido como "La Caída", rompió la armonía entre Dios y el hombre, introduciendo el pecado y la muerte en el mundo. Pero inmediatamente, Dios prometió un plan de redención.'
      }
    ],
    questions: [
      {
        id: 'q1-1',
        text: '¿Qué significa la palabra "Génesis"?',
        options: ['Final', 'Origen', 'Ley', 'Historia'],
        correctAnswer: 1,
        explanation: 'Génesis viene del griego y significa "origen" o "principio".'
      },
      {
        id: 'q1-2',
        text: '¿Cuál fue la valoración de Dios sobre su creación al terminar?',
        options: ['Era regular', 'Necesitaba mejoras', 'Era bueno en gran manera', 'Era aceptable'],
        correctAnswer: 2,
        explanation: 'Génesis 1:31 dice que Dios vio todo lo que había hecho y era "bueno en gran manera".'
      },
      {
        id: 'q1-3',
        text: '¿Qué implica ser hecho a "imagen y semejanza" de Dios?',
        options: ['Tener poderes mágicos', 'Ser idéntico físicamente a Dios', 'Tener capacidad de razonar y relacionarse', 'Ser inmortal por naturaleza'],
        correctAnswer: 2,
        explanation: 'La imagen de Dios se refiere a atributos comunicables como la razón, la moralidad y la capacidad de relación.'
      },
      {
        id: 'q1-4',
        text: '¿Qué consecuencia trajo "La Caída"?',
        options: ['El hombre se volvió un dios', 'Se rompió la armonía con Dios', 'El mundo mejoró', 'No pasó nada'],
        correctAnswer: 1,
        explanation: 'La desobediencia rompió la relación directa y armónica entre Dios y la humanidad.'
      },
      {
        id: 'q1-5',
        text: '¿Cuál fue la respuesta de Dios ante la desobediencia?',
        options: ['Destruyó todo inmediatamente', 'Abandonó a la humanidad', 'Prometió un plan de redención', 'Creó otro mundo'],
        correctAnswer: 2,
        explanation: 'En Génesis 3:15, Dios promete que de la descendencia de la mujer vendría alguien que vencería al mal.'
      }
    ]
  },
  {
    id: 'g2',
    title: 'Los Patriarcas',
    description: 'El llamado de Abraham y el nacimiento de una nación.',
    order: 2,
    content: [
      {
        title: 'El Llamado de Abraham',
        body: 'Siglos después del diluvio, Dios llamó a un hombre llamado Abram (luego Abraham) en la ciudad de Ur. Le pidió que dejara su tierra y su parentela para ir a una tierra que Él le mostraría. Dios hizo un pacto con él: lo bendeciría, haría de él una gran nación y, a través de su descendencia, serían benditas todas las familias de la tierra.'
      },
      {
        title: 'El Hijo de la Promesa',
        body: 'Abraham y su esposa Sara eran ancianos y estériles, pero Dios les prometió un hijo. Isaac nació como el hijo de la promesa, demostrando que el plan de Dios no depende de la capacidad humana sino de su poder. La fe de Abraham fue probada cuando Dios le pidió sacrificar a Isaac, pero Dios proveyó un carnero sustituto, prefigurando el sacrificio de Cristo.'
      },
      {
        title: 'Jacob y las 12 Tribus',
        body: 'Isaac tuvo dos hijos: Esaú y Jacob. Aunque Jacob tenía muchos defectos, Dios lo eligió para continuar la línea de la promesa. Tras un encuentro con Dios, su nombre fue cambiado a Israel. Jacob tuvo 12 hijos, quienes se convertirían en los patriarcas de las 12 tribus de la nación de Israel.'
      }
    ],
    questions: [
      {
        id: 'q2-1',
        text: '¿Qué le prometió Dios a Abraham?',
        options: ['Riquezas infinitas', 'Hacer de él una gran nación', 'Un palacio en Ur', 'Vida eterna física'],
        correctAnswer: 1,
        explanation: 'Dios prometió hacer de Abraham una gran nación y bendecir a todas las familias de la tierra a través de él.'
      },
      {
        id: 'q2-2',
        text: '¿Quién fue el hijo de la promesa de Abraham y Sara?',
        options: ['Ismael', 'Esaú', 'Isaac', 'Jacob'],
        correctAnswer: 2,
        explanation: 'Isaac fue el hijo que Dios prometió a Abraham y Sara en su vejez.'
      },
      {
        id: 'q2-3',
        text: '¿Qué nombre le puso Dios a Jacob?',
        options: ['Edom', 'Israel', 'Judá', 'Moisés'],
        correctAnswer: 1,
        explanation: 'Dios cambió el nombre de Jacob a Israel, que significa "el que lucha con Dios".'
      },
      {
        id: 'q2-4',
        text: '¿Cuántos hijos tuvo Jacob?',
        options: ['7', '10', '12', '40'],
        correctAnswer: 2,
        explanation: 'Jacob tuvo 12 hijos, que formaron las 12 tribus de Israel.'
      },
      {
        id: 'q2-5',
        text: '¿De dónde salió Abraham cuando Dios lo llamó?',
        options: ['Egipto', 'Ur de los caldeos', 'Canaan', 'Jericó'],
        correctAnswer: 1,
        explanation: 'Abraham vivía en Ur de los caldeos cuando recibió el llamado de Dios.'
      }
    ]
  },
  {
    id: 'g3',
    title: 'El Éxodo y la Ley',
    description: 'De la esclavitud a la libertad y la alianza en el Sinaí.',
    order: 3,
    content: [
      {
        title: 'Esclavitud en Egipto',
        body: 'Los descendientes de Jacob (Israel) terminaron en Egipto debido a una hambruna. Al principio fueron acogidos por José, pero con el tiempo fueron esclavizados por un nuevo Faraón. Clamaron a Dios, y Él levantó a Moisés para liberarlos.'
      },
      {
        title: 'Las Plagas y la Pascua',
        body: 'Dios envió 10 plagas sobre Egipto para demostrar su poder sobre los dioses egipcios y forzar a Faraón a liberar a su pueblo. La última plaga, la muerte de los primogénitos, fue evitada por los israelitas al marcar sus puertas con la sangre de un cordero. Este evento instituyó la Pascua.'
      },
      {
        title: 'El Pacto en el Sinaí',
        body: 'Tras cruzar el Mar Rojo, Dios llevó al pueblo al Monte Sinaí. Allí les dio los Diez Mandamientos y la Ley, no como una forma de ganar la salvación, sino como una guía para vivir como un pueblo santo, separado para Dios. Se construyó el Tabernáculo, un lugar móvil donde la presencia de Dios habitaría en medio de su pueblo.'
      }
    ],
    questions: [
      {
        id: 'q3-1',
        text: '¿Quién fue elegido por Dios para liberar a Israel de Egipto?',
        options: ['Josué', 'Aarón', 'Moisés', 'David'],
        correctAnswer: 2,
        explanation: 'Moisés fue llamado por Dios desde la zarza ardiente para liberar a su pueblo.'
      },
      {
        id: 'q3-2',
        text: '¿Qué evento conmemora la Pascua?',
        options: ['La creación del mundo', 'La liberación de la esclavitud en Egipto', 'La entrada a la tierra prometida', 'El nacimiento de Isaac'],
        correctAnswer: 1,
        explanation: 'La Pascua celebra la protección de Dios sobre los primogénitos de Israel y su liberación de Egipto.'
      },
      {
        id: 'q3-3',
        text: '¿Dónde recibió Moisés los Diez Mandamientos?',
        options: ['Monte de los Olivos', 'Monte Sinaí', 'Monte Carmelo', 'Monte Sión'],
        correctAnswer: 1,
        explanation: 'Dios entregó la Ley y los mandamientos en el Monte Sinaí.'
      },
      {
        id: 'q3-4',
        text: '¿Cuál era el propósito principal del Tabernáculo?',
        options: ['Guardar tesoros', 'Ser la casa del líder', 'Que Dios habitara en medio de su pueblo', 'Un lugar de comercio'],
        correctAnswer: 2,
        explanation: 'El Tabernáculo era el santuario móvil donde la presencia de Dios moraba entre los israelitas.'
      },
      {
        id: 'q3-5',
        text: '¿Cuántas plagas envió Dios sobre Egipto?',
        options: ['3', '7', '10', '12'],
        correctAnswer: 2,
        explanation: 'Dios envió 10 plagas para juzgar a los dioses de Egipto y liberar a su pueblo.'
      }
    ]
  }
];
