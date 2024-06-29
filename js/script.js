const preguntas = [
    "¿Requiere el sistema copias de seguridad y recuperación fiables?",
    "¿Se requiere comunicación de datos?",
    "¿Existen funciones de procesamiento distribuido?",
    "¿Es crítico el rendimiento?",
    "¿Será ejecutado el sistema en un entorno operativo existente y frecuentemente utilizado?",
    "¿Requiere el sistema entrada de datos interactivo?",
    "¿Requiere la entrada de datos interactivo que las transiciones de entrada se lleven a cabo sobre múltiples o variadas operaciones?",
    "¿Se actualizan los archivos maestros en forma interactiva?",
    "¿Son complejas las entradas, las salidas, los archivos o peticiones?",
    "¿Es complejo el procesamiento interno?",
    "¿Se ha diseñado el código para ser reutilizable?",
    "¿Están incluidos en el diseño la conversión y la instalación?",
    "¿Se ha diseñado el sistema para soportar múltiples instalaciones en diferentes organizaciones?",
    "¿Se ha diseñado la aplicación para facilitar los cambios y para ser fácilmente utilizada por el usuario?"
];

// Generar tabla FAV
const favTable = document.getElementById('favTable');
preguntas.forEach((pregunta, index) => {
    const row = favTable.insertRow();
    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = pregunta;
    const inputCell = row.insertCell(2);
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 5;
    input.oninput = function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 5) this.value = 5;
    };
    inputCell.appendChild(input);
});

function calcularPF() {
    const inputs = document.querySelectorAll('#pfTable input[type="number"]');
    const totals = document.querySelectorAll('#pfTable .result');
    const pfSinAjustar = document.getElementById('pfSinAjustar');
    const complejidad = document.getElementById('complejidad').value;
    let total = 0;

    inputs.forEach((input, index) => {
        const value = Math.max(0, parseInt(input.value) || 0);
        input.value = value; // Actualizar el valor en el input
        const simple = parseInt(input.parentElement.nextElementSibling.textContent);
        const medio = parseInt(input.parentElement.nextElementSibling.nextElementSibling.textContent);
        const complejo = parseInt(input.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.textContent);
        
        let factor;
        switch(complejidad) {
            case 'simple': factor = simple; break;
            case 'medio': factor = medio; break;
            case 'complejo': factor = complejo; break;
        }

        const subtotal = value * factor;
        totals[index].textContent = subtotal;
        total += subtotal;
    });

    pfSinAjustar.textContent = total;
    document.getElementById('totalPFSinAjustar').textContent = total;
}

function calcularPFA() {
    calcularPF(); // Asegurarse de que los PF sin ajustar estén actualizados
    const favInputs = document.querySelectorAll('#favTable input[type="number"]');
    let sumFAV = 0;

    favInputs.forEach(input => {
        const value = Math.min(5, Math.max(0, parseInt(input.value) || 0));
        input.value = value; // Actualizar el valor en el input
        sumFAV += value;
    });

    console.log("Suma total FAV:", sumFAV); // Para verificación

    const factorAjuste = (0.65 + 0.01) * sumFAV;
    const pfSinAjustar = parseInt(document.getElementById('pfSinAjustar').textContent);

    const pfAjustados = (pfSinAjustar * factorAjuste);

    const pfAjustados1 = Math.round(pfSinAjustar * factorAjuste);


    document.getElementById('totalPFAjustados').textContent = pfAjustados+" ("+pfAjustados1+")";
    document.getElementById('sumaFAV').textContent = sumFAV; // Mostrar la suma FAV

    // Nuevos cálculos de estimación
    const diasTrabajoMes = parseInt(document.getElementById('dias_trabajo_mes').value);
    const salarioDesarrollador = parseFloat(document.getElementById('salario_desarrollador').value);
    const programadores = parseInt(document.getElementById('programadores').value);

    const calesfNom = pfAjustados / (1 / 8);
    const hrsDev = calesfNom / programadores;
    const durxmes = Math.round(hrsDev / (100 / diasTrabajoMes));

    const costotal = calesfNom / (diasTrabajoMes / salarioDesarrollador);
    const costomodulo = costotal / pfAjustados;

    // Actualizar la tabla de estimaciones
    document.getElementById('calesfNom').textContent = calesfNom.toFixed(2);
    document.getElementById('hrsDev').textContent = hrsDev.toFixed(2);
    document.getElementById('durxmes').textContent = durxmes.toFixed(2);
    document.getElementById('costotal').textContent = costotal.toFixed(2)+" ("+"Bs"+")";
    document.getElementById('costomodulo').textContent = costomodulo.toFixed(2)+" ("+"Bs"+")";

    // Añadir la complejidad seleccionada a la tabla de resultados
    const complejidadSeleccionada = document.getElementById('complejidad').value;
    document.getElementById('complejidadSeleccionada').textContent = complejidadSeleccionada.charAt(0).toUpperCase() + complejidadSeleccionada.slice(1);
}