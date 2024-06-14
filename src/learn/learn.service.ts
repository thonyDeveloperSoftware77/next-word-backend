/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LearningHistory } from "./entity/learnHistory.entity";
import { Repository, In } from "typeorm";
import { Card } from "src/card/entity/card.entity";
import { StudentCourse } from "src/student/entities/courseStudent.entity";
import { LearnCardInput } from "./entity/learnCardInput.entity";
import { Course } from "src/course/entities/course.entity";
import { Student } from "src/student/entities/student.entity";

@Injectable()
export class LearnService {
    constructor(
        @InjectRepository(LearningHistory)
        private learnHistoryRepository: Repository<LearningHistory>,
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
        @InjectRepository(StudentCourse)
        private studentCourseRepository: Repository<StudentCourse>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }


    async getCardsPreparedForLearning(student_uid: string, course_id: number): Promise<Card[]> {
        //Verifica que el curso este en course_student
        const studentCourse = await this.studentCourseRepository.findOne({ where: { uid: student_uid, course_id } });
        if (!studentCourse) {
            throw new Error('El estudiante no esta inscrito en el curso');
        }
        //Primero verifica si existen registros en learning_history
        const learningHistory = await this.learnHistoryRepository.find({ where: { student_uid } });
        //Si no hay registros, devuelve 10 cards random de las cards de ese curso
        if (learningHistory.length === 0) {
            return this.cardRepository.createQueryBuilder('card')
                .innerJoin('card.course', 'course', 'course.id = :course_id', { course_id })
                .orderBy('RANDOM()')
                .limit(10)
                .getMany();
        } else {
            //Devuelve 10 cards random de las cards de ese curso que no esten en learning_history
            return this.cardRepository.createQueryBuilder('card')
                .innerJoin('card.course', 'course', 'course.id = :course_id', { course_id })
                .where('card.id NOT IN (:...ids)', { ids: learningHistory.map(lh => lh.card_id) })
                .orderBy('RANDOM()')
                .limit(10)
                .getMany();
        }
    }

    async createCardsHistory(student_uid: string, course_id: number, cards: LearnCardInput[]): Promise<LearningHistory[]> {
        //Verificar que el estudiante este inscrito en el curso
        const studentCourse = await this.studentCourseRepository.findOne({ where: { uid: student_uid, course_id } });
        if (!studentCourse) {
            throw new Error('El estudiante no esta inscrito en el curso');
        }
        //cards contiene un array de objetos con la estructura {id: number} que es el id de la card
        //Primero verifica que las cards existan
        const cardsIds = cards.map(card => card.id);
        const cardsFound = await this.cardRepository.findByIds(cardsIds);
        if (cardsFound.length !== cards.length) {
            throw new Error('Alguna de las cards no existe');
        }

        //verica que las cards pertenezcan al curso
        const cardsInCourse = cardsFound.filter(card => card.course_id === course_id);
        if (cardsInCourse.length !== cards.length) {
            throw new Error('Alguna de las cards no pertenece al curso');
        }

        //Verifica el session_id de las cards y al mayor session_id le suma 1
        const learningHistory = await this.learnHistoryRepository.find({ where: { student_uid } });
        let session_id = 1;
        if (learningHistory.length > 0) {
            session_id = Math.max(...learningHistory.map(lh => lh.session_id)) + 1;
        }

        //Crea los registros en learning_history
        const learnHistory = cards.map(card => {
            const learnHistory = new LearningHistory();
            learnHistory.student_uid = student_uid;
            learnHistory.card_id = card.id;
            learnHistory.session_id = session_id;
            learnHistory.revision_date = new Date();
            return learnHistory;
        });
        return this.learnHistoryRepository.save(learnHistory);
    }


    /**
     * COMPARACIONES
     */

    // Función para obtener cursos del profesor
    async obtenerCursos(uid_profesor: string): Promise<any[]> {
        return this.courseRepository.find({ where: { teacher_uid: uid_profesor } });
    }


    async obtenerEstudiantesEnCursos(cursos: any[]): Promise<any[]> {
        const idsCursos = cursos.map(curso => curso.id);
        return this.studentCourseRepository.find({ where: { course_id: In(idsCursos) } });
    }

    async obtenerUidsEstudiantes(cursos: any[]): Promise<string[]> {
        const estudiantesEnCursos = await this.obtenerEstudiantesEnCursos(cursos);
        return estudiantesEnCursos.map(ec => ec.uid);
    }

    async obtenerNombresEstudiantes(uidsEstudiantes: string[]): Promise<{ [key: string]: string }> {
        const estudiantes = await this.studentRepository.find({ where: { uid: In(uidsEstudiantes) } });
        const nombresEstudiantes: { [key: string]: string } = {};
        estudiantes.forEach(estudiante => {
            nombresEstudiantes[estudiante.uid] = estudiante.name;
        });
        return nombresEstudiantes;
    }


    // Función para obtener todas las tarjetas de los cursos del profesor
    async obtenerTodasTarjetas(cursos: any[]): Promise<any[]> {
        const idsCursos = cursos.map(curso => curso.id);
        return this.cardRepository.find({ where: { course_id: In(idsCursos) } });
    }

    // Función para obtener todo el historial de revisiones de tarjetas
    async obtenerTodosHistorialesRevisiones(todasTarjetas: any[]): Promise<any[]> {
        return this.learnHistoryRepository.find({ where: { card_id: In(todasTarjetas.map(tarjeta => tarjeta.id)) } });
    }




    // Función para calcular los promedios del curso
    calcularPromediosCurso(cursos: any[], progresoEstudiantes: { [key: string]: any }): { [key: number]: any } {
        // Inicializar un objeto para almacenar los promedios por curso
        const promediosCurso: { [key: number]: any } = {};

        // Iterar sobre cada curso
        cursos.forEach(curso => {
            // Filtrar los estudiantes que pertenecen al curso actual
            const estudiantesCurso = Object.values(progresoEstudiantes).filter(estudiante => estudiante.course_id === curso.id);

            // Calcular el total de revisiones del curso usando reduce
            const totalRevisionesCurso = estudiantesCurso.reduce((acc, estudiante) => acc + estudiante.totalRevisiones, 0);
            // Calcular el total de éxitos del curso usando reduce
            const totalExitosCurso = estudiantesCurso.reduce((acc, estudiante) => acc + estudiante.revisionesExitosas, 0);
            // Calcular el total de fallos del curso usando reduce
            const totalFallosCurso = estudiantesCurso.reduce((acc, estudiante) => acc + estudiante.revisionesFallidas, 0);
            // Calcular el total de tiempo de revisión del curso usando reduce
            const totalTiempoCurso = estudiantesCurso.reduce((acc, estudiante) => acc + estudiante.totalTiempo, 0);
            // Obtener la cantidad de estudiantes en el curso
            const cantidadEstudiantesCurso = estudiantesCurso.length;

            // Calcular los promedios y almacenarlos en el objeto promediosCurso
            promediosCurso[curso.id] = {
                promedioRevisiones: cantidadEstudiantesCurso ? totalRevisionesCurso / cantidadEstudiantesCurso : 0,
                promedioExitos: cantidadEstudiantesCurso ? totalExitosCurso / cantidadEstudiantesCurso : 0,
                promedioFallos: cantidadEstudiantesCurso ? totalFallosCurso / cantidadEstudiantesCurso : 0,
                promedioTiempo: cantidadEstudiantesCurso ? totalTiempoCurso / cantidadEstudiantesCurso : 0
            };
        });

        // Retornar el objeto con los promedios por curso
        return promediosCurso;
    }




    /**
     * Funcion para generar recomendaciones
     * @param uidsEstudiantes 
     * @param progresoEstudiantes 
     * @param cursos 
     * @param promediosCurso 
     * @returns Promise<any[]>
     */
    async generarRecomendaciones(
        uidsEstudiantes: string[],
        progresoEstudiantes: { [key: string]: any },
        cursos: any[],
        promediosCurso: { [key: number]: any }
    ): Promise<any[]> {
        // Paso 1: Procesar cada estudiante utilizando Promise.all para manejar operaciones asíncronas
        const recomendaciones = await Promise.all(
            uidsEstudiantes.map(async (uidEstudiante) => {
                // Paso 2: Obtener el curso asociado al estudiante
                const idCurso = progresoEstudiantes[uidEstudiante]?.course_id;
                if (!idCurso) return null;

                const datosEstudiante = progresoEstudiantes[uidEstudiante];
                const datosCurso = promediosCurso[idCurso] || {}; // Asegurarse de manejar casos donde datosCurso podría ser indefinido
                let recomendacion = '';
                let palabrasFallidasRecomendacion: any[] = [];
                let palabrasSinonimoRecomendacion: any[] = [];

                // Paso 3: Calcular tasas de éxito y fallo del estudiante
                const tasaExito =
                    datosEstudiante.revisionesExitosas /
                    (datosEstudiante.revisionesExitosas + datosEstudiante.revisionesFallidas);
                const tasaFallo =
                    datosEstudiante.revisionesFallidas /
                    (datosEstudiante.revisionesExitosas + datosEstudiante.revisionesFallidas);

                // Paso 4: Determinar la recomendación basada en las tasas de éxito y fallo
                if (tasaExito > 0.9) {
                    recomendacion = '✅Merecía estar en un curso más alto';
                } else if (
                    tasaExito >
                    (datosCurso.promedioExitos / datosCurso.promedioRevisiones) * 1.2
                ) {
                    recomendacion = '✔️Recomendado para el siguiente nivel';
                } else if (
                    tasaFallo >
                    (datosCurso.promedioFallos / datosCurso.promedioRevisiones) * 1.2
                ) {
                    recomendacion = '❌Necesita refuerzo adicional';
                    // Paso 5: Identificar palabras fallidas y obtener sinónimos
                    palabrasFallidasRecomendacion = Object.keys(
                        datosEstudiante.palabrasFallidas
                    )
                        .filter((palabra) => datosEstudiante.palabrasFallidas[palabra] > 2)
                        .map((palabra) => ({
                            palabra,
                            intentos: datosEstudiante.palabrasFallidas[palabra],
                        }));
                    palabrasSinonimoRecomendacion = await Promise.all(
                        palabrasFallidasRecomendacion.map(async (palabra) => {
                            const sinonimos = await this.obtenerSinonimos(palabra.palabra);
                            return {
                                palabra: palabra.palabra,
                                sinonimos,
                            };
                        })
                    );
                }


                // Paso 6: Retornar el objeto de recomendación para el estudiante
                return {
                    nombreEstudiante: datosEstudiante.nombre,
                    recomendacion,
                    palabrasFallidas:
                        palabrasFallidasRecomendacion.length > 0
                            ? palabrasFallidasRecomendacion
                            : undefined,
                    palabrasSinonimo:
                        palabrasSinonimoRecomendacion.length > 0
                            ? palabrasSinonimoRecomendacion
                            : undefined,
                };
            })
        );

        // Paso 7: Filtrar las recomendaciones nulas y retornarlas
        return recomendaciones.filter((recomendacion) => recomendacion !== null);
    }




    // Función para agrupar resultados por curso
    agruparResultadosPorCurso(cursos: any[], progresoEstudiantes: { [key: string]: any }, recomendaciones: any[], promediosCurso: { [key: number]: any }): any[] {
        return cursos.map(curso => {
            const estudiantesCurso = Object.values(progresoEstudiantes).filter(estudiante => estudiante.course_id === curso.id);
            const recomendacionesCurso = recomendaciones.filter(rec => estudiantesCurso.map(ec => ec.nombre).includes(rec.nombreEstudiante));

            return {
                curso: curso.name,
                estudiantes: estudiantesCurso.map(estudiante => ({
                    nombre: estudiante.nombre,
                    totalRevisiones: estudiante.totalRevisiones,
                    revisionesExitosas: estudiante.revisionesExitosas,
                    revisionesFallidas: estudiante.revisionesFallidas,
                    totalTiempo: estudiante.totalTiempo,
                    progresoPorSilabas: estudiante.progresoPorSilabas, // Incluye el progreso por sílabas
                    potencial: estudiante.potencial // Incluye la evaluación del potencial
                })),
                promedioRevisiones: promediosCurso[curso.id]?.promedioRevisiones || 0,
                promedioExitos: promediosCurso[curso.id]?.promedioExitos || 0,
                promedioFallos: promediosCurso[curso.id]?.promedioFallos || 0,
                promedioTiempo: promediosCurso[curso.id]?.promedioTiempo || 0,
                recomendaciones: recomendacionesCurso
            };
        });
    }




    // Método para clasificar palabras por número de sílabas
    clasificarPorSilabas(palabra: string): number {
        console.log(palabra);

        if (!palabra) return 0; // Asegura que la palabra no sea undefined
        console.log(palabra.split(/[aeiouáéíóúü]/i).length - 1);
        return palabra.split(/[aeiouáéíóúü]/i).length - 1;
    }



    /**
     * Calcular el progreso de un estudiante por número de sílabas
     * @param historialesEstudiante 
     * @param todasTarjetas 
     * @returns 
     */
    calcularProgresoPorSilabas(historialesEstudiante: any[], todasTarjetas: any[]): any {
        // Inicializar el objeto para almacenar el progreso por sílabas
        const progreso = {
            monosilabas: { exitosas: 0, fallidas: 0 },
            bisilabas: { exitosas: 0, fallidas: 0 },
            trisilabas: { exitosas: 0, fallidas: 0 },
            polisilabas: { exitosas: 0, fallidas: 0 }
        };

        // Iterar sobre cada historial de revisión del estudiante
        historialesEstudiante.forEach(historial => {
            // Encontrar la tarjeta correspondiente al historial actual
            const tarjeta = todasTarjetas.find(t => t.id === historial.card_id);
            // Clasificar la palabra por número de sílabas
            const numSilabas = this.clasificarPorSilabas(tarjeta ? tarjeta.word_english : "");
            const categoria = numSilabas === 1 ? 'monosilabas' : numSilabas === 2 ? 'bisilabas' : numSilabas === 3 ? 'trisilabas' : 'polisilabas';

            // Filtrar los historiales para la misma tarjeta
            const historialesTarjeta = historialesEstudiante.filter(h => h.card_id === historial.card_id);
            const conteoSesiones: { [key: number]: number } = {};

            // Contar las sesiones únicas y los intentos fallidos para la tarjeta
            historialesTarjeta.forEach(h => {
                if (!conteoSesiones[h.session_id]) {
                    conteoSesiones[h.session_id] = 0;
                }
                conteoSesiones[h.session_id]++;
            });

            const sesionesUnicas = Object.keys(conteoSesiones).length;
            const intentosFallidos = Object.values(conteoSesiones).filter(count => count > 1).length;

            // Determinar si la revisión fue exitosa o fallida
            if (sesionesUnicas === 4 && intentosFallidos === 0) {
                progreso[categoria].exitosas++;
            } else {
                progreso[categoria].fallidas++;
            }
        });

        // Retornar el progreso calculado por número de sílabas
        return progreso;
    }


    async obtenerSinonimos(palabra: string): Promise<string[]> {
        try {
            const response = await fetch(`https://api.datamuse.com/words?rel_syn=${palabra}`);
            const data = await response.json();
            return data.slice(0, 3).map((item: any) => item.word); // Tomar las 3 primeras palabras
        } catch (error) {
            console.error(`Error al obtener sinónimos para la palabra "${palabra}":`, error);
            return [];
        }
    }


    async calcularProgresoEstudiantes(uidsEstudiantes: string[], nombresEstudiantes: { [key: string]: string }, todasTarjetas: any[], todosHistorialesRevisiones: any[], estudiantesEnCursos: any[]): Promise<{ [key: string]: any; }> {
        const progresoEstudiantes: { [key: string]: any } = {};

        uidsEstudiantes.forEach(uidEstudiante => {
            const historialesEstudiante = todosHistorialesRevisiones.filter(historial => historial.student_uid === uidEstudiante);
            const tarjetasEstudiante = todasTarjetas.filter(tarjeta => historialesEstudiante.map(historial => historial.card_id).includes(tarjeta.id));

            // Inicializar contadores
            let totalRevisiones = 0;
            let revisionesExitosas = 0;
            let revisionesFallidas = 0;
            const palabrasFallidas: { [key: string]: number } = {};
            const fechasRevisiones = new Set<string>();
            const sinonimosPalabrasFallidas: { [key: string]: string[] } = {};


            tarjetasEstudiante.forEach(async tarjeta => {
                const historialesTarjeta = historialesEstudiante.filter(historial => historial.card_id === tarjeta.id);
                const conteoSesiones: { [key: number]: number } = {};

                historialesTarjeta.forEach(historial => {
                    fechasRevisiones.add(historial.revision_date.toISOString().split('T')[0]); // Guardar fechas únicas
                    if (!conteoSesiones[historial.session_id]) {
                        conteoSesiones[historial.session_id] = 0;
                    }
                    conteoSesiones[historial.session_id]++;
                });

                const sesionesUnicas = Object.keys(conteoSesiones).length;
                const intentosFallidos = Object.values(conteoSesiones).filter(count => count > 1).length;

                if (sesionesUnicas === 4 && intentosFallidos === 0) {
                    revisionesExitosas++;
                } else {
                    revisionesFallidas++;
                    if (intentosFallidos > 0) {
                        palabrasFallidas[tarjeta.word_english] = intentosFallidos;
                    }
                }

                totalRevisiones += historialesTarjeta.length;
            });

            const totalTiempo = fechasRevisiones.size; // Total de días únicos

            const estudianteCurso = estudiantesEnCursos.find(sc => sc.uid === uidEstudiante);
            const course_id = estudianteCurso ? estudianteCurso.course_id : null;

            const progresoPorSilabas = this.calcularProgresoPorSilabas(historialesEstudiante, todasTarjetas); // Añadido el segundo parámetro

            const evaluarPotencialConFrases = (exitosas: number, tipo: string): string[] => {
                const frases: string[] = [];
                if (exitosas > 10) {
                    if (tipo === 'monosílabas') {
                        frases.push('Alta capacidad para memorizar y comprender palabras simples.');
                    } else if (tipo === 'bisílabas') {
                        frases.push('Alta capacidad para procesar y recordar palabras de complejidad moderada.');
                    } else if (tipo === 'trisílabas') {
                        frases.push('Alta capacidad para manejar y retener palabras más complejas.');
                    } else if (tipo === 'polisílabas') {
                        frases.push('Alta capacidad para manejar y retener palabras muy complejas.');
                    }
                } else if (exitosas > 5) {
                    if (tipo === 'monosílabas') {
                        frases.push('Capacidad intermedia para memorizar y comprender palabras simples.');
                    } else if (tipo === 'bisílabas') {
                        frases.push('Capacidad intermedia para procesar y recordar palabras de complejidad moderada.');
                    } else if (tipo === 'trisílabas') {
                        frases.push('Capacidad intermedia para manejar y retener palabras más complejas.');
                    } else if (tipo === 'polisílabas') {
                        frases.push('Capacidad intermedia para manejar y retener palabras muy complejas.');
                    }
                } else if (exitosas > 0) {
                    if (tipo === 'monosílabas') {
                        frases.push('Capacidad básica para memorizar y comprender palabras simples.');
                    } else if (tipo === 'bisílabas') {
                        frases.push('Capacidad básica para procesar y recordar palabras de complejidad moderada.');
                    } else if (tipo === 'trisílabas') {
                        frases.push('Capacidad básica para manejar y retener palabras más complejas.');
                    } else if (tipo === 'polisílabas') {
                        frases.push('Capacidad básica para manejar y retener palabras muy complejas.');
                    }
                }
                return frases;
            };

            progresoEstudiantes[uidEstudiante] = {
                nombre: nombresEstudiantes[uidEstudiante],
                totalRevisiones,
                revisionesExitosas,
                revisionesFallidas,
                totalTiempo,
                palabrasFallidas,
                sinonimosPalabrasFallidas,
                progresoPorSilabas, // Añadir el progreso por sílabas al objeto de progreso del estudiante
                course_id, // Asigna el course_id correcto para cada estudiante
                potencial: {
                    monosilabas: evaluarPotencialConFrases(progresoPorSilabas.monosilabas.exitosas, 'monosílabas'),
                    bisilabas: evaluarPotencialConFrases(progresoPorSilabas.bisilabas.exitosas, 'bisílabas'),
                    trisilabas: evaluarPotencialConFrases(progresoPorSilabas.trisilabas.exitosas, 'trisílabas'),
                    polisilabas: evaluarPotencialConFrases(progresoPorSilabas.polisilabas.exitosas, 'polisílabas'),
                }
            };

            console.log(`Progreso del estudiante ${uidEstudiante}:`, progresoEstudiantes[uidEstudiante]);
        });

        return progresoEstudiantes;
    }




    // Refactorización final del método principal
    async reporteProgresoEstudiantes(uid_profesor: string): Promise<any> {
        // Obtención de datos
        const cursos = await this.obtenerCursos(uid_profesor);
        if (cursos.length === 0) return [];

        const estudiantesEnCursos = await this.obtenerEstudiantesEnCursos(cursos);
        const uidsEstudiantes = estudiantesEnCursos.map(ec => ec.uid);
        if (uidsEstudiantes.length === 0) return [];

        const nombresEstudiantes = await this.obtenerNombresEstudiantes(uidsEstudiantes);
        const todasTarjetas = await this.obtenerTodasTarjetas(cursos);
        if (todasTarjetas.length === 0) return [];

        const todosHistorialesRevisiones = await this.obtenerTodosHistorialesRevisiones(todasTarjetas);

        // Procesamiento de datos y cálculos de resultados
        const progresoEstudiantes = await this.calcularProgresoEstudiantes(uidsEstudiantes, nombresEstudiantes, todasTarjetas, todosHistorialesRevisiones, estudiantesEnCursos);
        const promediosCurso = this.calcularPromediosCurso(cursos, progresoEstudiantes);

        const recomendaciones = await this.generarRecomendaciones(uidsEstudiantes, progresoEstudiantes, cursos, promediosCurso);

        const resultados = this.agruparResultadosPorCurso(cursos, progresoEstudiantes, await recomendaciones, promediosCurso);

        return { resultados };
    }


    async comparationBetweenDates(uid_profesor: string, date1: string, date2: string): Promise<any> {
        // OBTENCION DE LOS DATOS
    
        // DATA DE CURSOS DEL PROFESOR
        const cursos = await this.obtenerCursos(uid_profesor);
        if (cursos.length === 0) return [];
    
        // DATA DE ESTUDIANTES DE LOS CURSOS
        const estudiantesEnCursos = await this.obtenerEstudiantesEnCursos(cursos);
    
        // UID ESTUDIANTES
        const uidsEstudiantes = estudiantesEnCursos.map(ec => ec.uid);
        if (uidsEstudiantes.length === 0) return [];
    
        // NOMBRES DE LOS ESTUDIANTES
        const nombresEstudiantes = await this.obtenerNombresEstudiantes(uidsEstudiantes);
    
        // TODAS LAS TARJETAS DE LOS CURSOS
        const todasTarjetas = await this.obtenerTodasTarjetas(cursos);
        if (todasTarjetas.length === 0) return [];
    
        // HISTORIALES DE REVISIONES DE TARJETAS
        const todosHistorialesRevisiones = await this.obtenerTodosHistorialesRevisiones(todasTarjetas);
    
        // FILTRAR HISTORIALES DE SESIONES DE ESTUDIO ENTRE LAS FECHAS DADAS
        const historialesFiltrados = todosHistorialesRevisiones.filter(historial =>
            new Date(historial.revision_date) >= new Date(date1) && new Date(historial.revision_date) <= new Date(date2)
        );
        
        const progresoEstudiantes = uidsEstudiantes.map(uidEstudiante => {

            // FILTRAR HISTORIALES DEL ESTUDIANTE
            const historialesEstudiante = historialesFiltrados.filter(historial => historial.student_uid === uidEstudiante);

            // OBTENER FECHAS UNICAS DE REVISIONES
            const fechasRevisiones = new Set(historialesEstudiante.map(historial => historial.revision_date.toISOString()));
    
           // Encontrar el curso del estudiante
            const estudianteCurso = estudiantesEnCursos.find(sc => sc.uid === uidEstudiante);
            const course_name = cursos.find(curso => curso.id === estudianteCurso.course_id)?.name;
    
            return {
                nombre: nombresEstudiantes[uidEstudiante],
                totalFechasRevisiones: fechasRevisiones.size,
                course_name: course_name,
                fechasRevisiones: Array.from(fechasRevisiones).sort()
            };
        });
    
        // Obtener el máximo número de fechas de revisión
        const maxFechasRevisiones = Math.max(...progresoEstudiantes.map(est => est.totalFechasRevisiones));
    
        // Filtrar los estudiantes que tienen el máximo número de fechas de revisión
        const estudiantesMaxRevisiones = progresoEstudiantes.filter(est => est.totalFechasRevisiones === maxFechasRevisiones);
    

    
        return estudiantesMaxRevisiones;
    }
    



}