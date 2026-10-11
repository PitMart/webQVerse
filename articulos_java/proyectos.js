const proyectosArticles = {

    'quantumschool': {
        title: 'Quantum Computing School',
        category: 'Formación Académica',
        author: 'División de Computación Avanzada',
        date: 'En curso',
        lead: 'Aprende a programar ordenadores cuánticos reales con Qiskit. Un programa de formación que impulsamos desde la asociación siguiendo los currículos oficiales de IBM y Quantum Rings.',
        body: `
            <h2>¿Qué es 'Quantum Computing School'?</h2><br>
            <p>Quantum Computing School es un programa de formación en computación cuántica que impulsamos desde la asociación. En un campo que avanza tan rápido, contar con una ruta de aprendizaje clara y estructurada hace la diferencia entre quedarse en la superficie o desarrollar un dominio real de las herramientas y conceptos que definen esta tecnología.</p><br>
            <p>El programa está diseñado para estudiantes de ingeniería física y carreras afines que quieran adentrarse en el mundo cuántico, tanto si es su primera vez como si ya tienen una base y buscan ampliarla con una formación más rigurosa.</p><br>
            
            <img src="img/proyectos/quantum/quant_vector.svg" alt="Circuito cuántico" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>

            <br><h2>Estructura del programa</h2><br>
            <p>La formación se estructura en torno a Qiskit, el framework de código abierto desarrollado por IBM que se ha convertido en el estándar de la industria. A través de él se aprende a construir circuitos cuánticos, manipular qubits, implementar puertas lógicas cuánticas y ejecutar algoritmos tanto en simuladores como en hardware cuántico real mediante la nube de IBM.</p><br>
            <p>El programa comienza desde los fundamentos matemáticos como álgebra lineal, números complejos y notación de Dirac, y avanza hacia los algoritmos más relevantes del campo: el algoritmo de Deutsch-Jozsa, la transformada cuántica de Fourier, el algoritmo de Grover para búsqueda o el de Shor para factorización, prestando especial atención a su impacto en criptografía.</p><br>

            <br><h2>Certificaciones y currículo oficial</h2><br>
            <p>Uno de los aspectos clave del programa es su alineación con los currículos oficiales de IBM Quantum y Quantum Rings. Esto garantiza que los conocimientos adquiridos sean reconocibles en el mercado laboral y que los participantes puedan optar a certificaciones oficiales que acrediten su formación.</p><br>
            <p>El currículo cubre desde los fundamentos del álgebra lineal aplicada a la mecánica cuántica hasta algoritmos avanzados como VQE (Variational Quantum Eigensolver) y QAOA (Quantum Approximate Optimization Algorithm), considerados entre los más prometedores para aplicaciones en química cuántica y optimización combinatoria.</p><br>

            <br><h2>Trabajo con hardware real</h2><br>
            <p>A lo largo del programa se desarrollan habilidades prácticas en la creación y simulación de circuitos cuánticos, la manipulación de estados de qubits y la implementación de técnicas de mitigación de errores. Este último aspecto es especialmente relevante dado que los ordenadores cuánticos actuales operan en el régimen NISQ (Noisy Intermediate-Scale Quantum), donde el ruido y la decoherencia son limitaciones reales.</p><br>
            <p>El entorno de trabajo combina la ejecución local en simuladores con el acceso a procesadores cuánticos reales mediante IBM Quantum Network. Esta exposición al hardware real permite experimentar de primera mano las diferencias entre la simulación ideal y el comportamiento real de los sistemas cuánticos.</p><br>
            
            <img src="img/proyectos/quantum/IBMQChip.webp" alt="Procesador cuántico de IBM" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>

            <br><h2>¿A quién va dirigido?</h2><br>
            <p>El programa está abierto a todos los miembros de la asociación, independientemente de su nivel previo. Se organizan grupos según la experiencia, para que tanto quienes se acercan por primera vez a la computación cuántica como quienes ya tienen nociones previas puedan avanzar a un ritmo adecuado.</p><br>
            <p>Si te interesa participar o quieres más información sobre el próximo ciclo, contacta con nosotros a través de nuestros canales habituales. La computación cuántica ya no es el futuro, es el presente.</p><br>
        `
    },

    'fluidos': {

        oculto: true, // sin enlace en la web: no aparece en «Sigue leyendo»
        title: 'Simulación de Fluidos Computacional',
        category: 'Proyecto Activo',
        author: 'Grupo de Simulación',
        date: 'Actualmente en desarrollo',
        lead: 'Desarrollo de un solver CFM (Computational Fluid Dynamics) propio escrito en C++ y Python para el análisis detallado de dinámicas de vórtices y turbulencia.',
        body: `
            <h2>¿Por qué un solver propio?</h2><br>
            <p>Aunque existen herramientas comerciales, desarrollar nuestro propio código nos permite entender a fondo las ecuaciones de Navier-Stokes y optimizar los algoritmos para casos de uso específicos de investigación.</p><br>

            <br><h2>Metodología</h2><br>
            <p>Implementamos métodos de volúmenes finitos para discretizar el dominio y utilizamos esquemas temporales de alto orden para garantizar la estabilidad numérica.</p><br>
        `
    },

    'niebla': {
        title: 'Cámara de niebla',
        category: 'Proyecto Finalizado',
        author: 'Grupo de Ingeniería Física',
        date: 'Febrero 2025',
        lead: 'Hacer visible lo invisible: una cámara de niebla en la UC3M',
        body: `
            <h2>Origen e importancia histórica de la cámara de niebla</h2><br>
            <p>La cámara de niebla surgió a finales del siglo XIX a partir de los estudios de Charles Thomson Rees Wilson sobre la condensación del vapor en presencia de partículas cargadas, convirtiéndose en un instrumento clave para visualizar fenómenos invisibles. A lo largo del siglo XX desempeñó un papel fundamental en el desarrollo de la física de partículas, al posibilitar descubrimientos como el positrón, el muón y el pión, y aunque hoy ha sido reemplazada por detectores más avanzados, mantiene un destacado valor científico y pedagógico al permitir observar directamente las huellas de la radiación cósmica</p>
            
            <img src="img/proyectos/niebla/camara_antigua.webp" alt="Cámara de niebla antigua" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>
            
            <h2>Diseño y construcción en la UC3M</h2><br>
            <p>La construcción de la cámara de niebla se llevó a cabo mediante un procedimiento artesanal, prestando especial atención al aislamiento térmico, al cierre hermético y a las condiciones necesarias para la condensación del vapor.</p>

            <p>En primer lugar, se recortó material aislante para preparar una bandeja destinada a alojar el hielo seco, elemento fundamental para generar la baja temperatura requerida. A continuación, se cubrió una placa metálica con autoadhesivo negro con el fin de mejorar el contraste visual de las trayectorias de las partículas. En los bordes se añadió un burlete de goma para asegurar un cierre hermético del sistema.</p>

            <p>En el interior de la pecera se fijó una tira de fieltro en la parte superior. Esta se impregnó con alcohol isopropílico, cuyo vapor, al descender hacia la base muy fría, permitiría posteriormente la formación de la niebla donde se hacen visibles las trazas.</p>
            <img src="img/proyectos/niebla/echar_alc.webp" alt="Cámara de niebla en funcionamiento" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin: 20px auto; display: block;">

            <p>Una vez montada la estructura, se manipuló el hielo seco con guantes de protección y se distribuyó cuidadosamente en la bandeja, rodeándolo de corcho para conservar la temperatura. Sobre este lecho se colocó la placa metálica y se cerró la pecera con cuidado, asegurándola mediante libros y pesas en la parte superior. La presión ejercida, junto con la flexibilidad del burlete, permitió sellar completamente la cámara.</p>
            <img src="img/proyectos/niebla/pesas.webp" alt="Cámara de niebla en funcionamiento" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>

            <h2>Observación de partículas cósmicas</h2><br>
            <p>Una vez en completa oscuridad, se aplicó iluminación lateral mediante una linterna de alta intensidad, generando las condiciones óptimas para que la niebla hiciera visibles las trayectorias de las partículas que atravesaban la pecera. En un primer momento no se observó ningún fenómeno, únicamente la cámara fría y en silencio. Durante varios minutos surgió la duda de si el montaje funcionaba correctamente. Sin embargo, tras aproximadamente diez o quince minutos, comenzaron a distinguirse finas líneas blancas que cruzaban brevemente el interior.</p>

            <p>Las trazas observadas corresponden principalmente a muones, partículas que alcanzan la superficie terrestre tras originarse en colisiones de rayos cósmicos con la atmósfera. Algunas marcas aparecen más gruesas y de menor longitud, rasgo propio de partículas alfa, mientras que otras se muestran más delgadas e irregulares, asociadas a la radiación beta. Aunque cada estela es efímera, su presencia evidencia que estas partículas nos atraviesan de manera constante, aun cuando pasan inadvertidas en condiciones normales.</p>
            <video width="100%" max-width="600px" height="auto" style="max-width: 600px; border-radius: 8px; margin: 20px auto; display: block;" controls muted>
                <source src="videos/silvia_niebla.mp4" type="video/mp4">
                Tu navegador no soporta la etiqueta de video.
            </video><br>

            <h2>Conclusiones y agradecimientos</h2><br>
            <p>Para nosotros, la cámara de niebla no es solo un homenaje a la historia de la física, sino también una herramienta divulgativa que acerca la ciencia a cualquiera con curiosidad. Porque lo más fascinante de este experimento no es su sencillez ni su valor pedagógico, sino la sensación de descubrir que, incluso en un laboratorio universitario, podemos asomarnos a un universo invisible que nos atraviesa continuamente.</p>
            <p>Queremos expresar nuestro agradecimiento a José Ramón Martín Solís, a José Miguel Reynolds Barredo, a Domingo de la Rosa Muñoz y a Silvia Noemí Santalla Arribas. Los profesores que nos acompañaron en todo el proceso, tanto facilitando los materiales necesarios como ofreciéndonos su apoyo y orientación en los aspectos teóricos y prácticos. También agradecer a la UNED, por darnos la oportunidad de compartir esta experiencia en su blog dedicado a la física, al que podeis acceder en este enlace: <a href="https://blogs.uned.es/hablandodefisicauned/2025/10/13/hacer-visible-lo-invisible-una-camara-de-niebla-en-la-uc3m/" target="_blank" style="color: inherit; text-decoration: underline;">Artículo en el blog de Física de la UNED</a>.</p>
        `
    },

    'levitador': {

        oculto: true, // sin enlace en la web: no aparece en «Sigue leyendo»
        title: 'Levitador Electrostático',
        category: 'Proyecto Finalizado',
        author: 'Grupo de Ingeniería Física',
        date: 'Junio 2025',
        lead: 'Desafiando la gravedad con electricidad: construcción de un levitador electrostático en colaboración con el Departamento de Física de la UC3M.',
        body: `
            <h2>¿Qué es un levitador electrostático?</h2><br>
            <p>Un levitador electrostático es un dispositivo capaz de mantener un objeto en suspensión en el aire utilizando únicamente fuerzas eléctricas. A diferencia de la levitación magnética, este fenómeno aprovecha la interacción entre cargas eléctricas para contrarrestar la gravedad, convirtiendo un principio fundamental de la física en un experimento visualmente fascinante.</p><br>
            <p>Aunque el principio puede parecer sencillo, su implementación requiere un control preciso del campo eléctrico generado, lo que lo convierte en un reto tanto teórico como práctico. Este tipo de dispositivos tiene aplicaciones en investigación de materiales, microgravedad simulada y espectroscopía de partículas.</p><br>

            <img src="img/levitador_portada.png" alt="Levitador electrostático" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>

            <br><h2>Proceso de montaje</h2><br>
            <p>El proyecto se llevó a cabo en las instalaciones del Departamento de Física de la UC3M durante el mes de junio de 2025. El montaje comenzó con el diseño y construcción de los electrodos, piezas clave para generar el campo eléctrico necesario. Se prestó especial atención a la geometría de los mismos, ya que esta determina directamente la distribución del campo y, por tanto, la estabilidad de la levitación.</p><br>
            <p>A continuación se realizó el conexionado eléctrico y la configuración de la fuente de alta tensión, siempre bajo estrictas medidas de seguridad. Una vez montado el sistema, se procedió a las pruebas iniciales con distintos objetos de pequeña masa y baja densidad, ajustando progresivamente los parámetros hasta lograr una levitación estable y reproducible.</p><br>

            <img src="img/levitador_montaje1.png" alt="Proceso de montaje del levitador" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px auto; display: block;"><br>

            <br><h2>El montaje en imágenes y vídeo</h2><br>
            <p>A continuación podéis ver un resumen en vídeo del proceso de construcción y puesta en marcha del levitador electrostático:</p><br>
            <video width="100%" height="auto" style="max-width: 600px; border-radius: 8px; margin: 20px auto; display: block;" controls muted>
                <source src="videos/levitador_montaje.mp4" type="video/mp4">
                Tu navegador no soporta la etiqueta de video.
            </video><br>

            <br><h2>Resultado final</h2><br>
            <p>Tras varios ajustes, el levitador logró mantener objetos en suspensión de forma estable, demostrando de manera directa y visual los principios de la electrostática. El resultado fue especialmente llamativo: ver un objeto flotando en el aire gracias únicamente a fuerzas eléctricas genera el mismo impacto que la primera vez que se ven las trazas en una cámara de niebla. La física invisible, hecha visible.</p><br>

            <video width="100%" height="auto" style="max-width: 600px; border-radius: 8px; margin: 20px auto; display: block;" controls muted>
                <source src="videos/levitador_resultado.mp4" type="video/mp4">
                Tu navegador no soporta la etiqueta de video.
            </video><br>

            <br><h2>Conclusiones y agradecimientos</h2><br>
            <p>Este proyecto nos ha permitido explorar de forma práctica uno de los fenómenos más elegantes de la física clásica: la acción a distancia de las fuerzas eléctricas. Más allá del resultado experimental, el proceso de montaje y ajuste nos ha enseñado la importancia del rigor y la paciencia en el trabajo de laboratorio.</p><br>
            <p>Queremos expresar nuestro más sincero agradecimiento al Departamento de Física de la UC3M por brindarnos las instalaciones y los medios necesarios para llevar a cabo este proyecto. En especial, queremos dar las gracias al profesor José Miguel Reynolds, quien se puso en contacto con nosotros y fue el impulsor de esta colaboración, acompañándonos en todo momento con su orientación y entusiasmo.</p><br>
        `
    },

};
