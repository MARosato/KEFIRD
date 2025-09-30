document.getElementById('kefirForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    const gramsInput = document.getElementById('kefir-grams').value;
    const grams = parseFloat(gramsInput);

    if (!isValidInput(grams)) {
        displayError('Por favor, ingrese una cantidad válida de nódulos. No puede quedar el campo vacío.');
        return;
    }

    const liters = calculateLiters(grams);
    const glasses = calculateGlasses(liters);

    displayResult(grams, liters, glasses);
}

function isValidInput(value) {
    return !isNaN(value) && value > 0;
}

function calculateLiters(grams) {
    return grams / 100;
}

function calculateGlasses(liters) {
    const GLASS_CAPACITY = 0.25; // 250ml por vaso
    return Math.floor(liters / GLASS_CAPACITY);
}

function displayError(message) {
    document.getElementById('results').innerHTML = `
        <div class="alert alert-danger">
            ${message}
        </div>
    `;
}

function displayResult(grams, liters, glasses) {
    document.getElementById('results').innerHTML = `
        <h3 class="mb-3 mt-4 text-center">Resultados:</h3>
        <p>
            Con <strong>${grams} gramos</strong> de gránulos de kéfir, se pueden fermentar
            <strong>${liters.toFixed(2)} litros</strong>,
            lo que equivale a <strong>${glasses} vasos</strong>.
        </p>
    `;
}
