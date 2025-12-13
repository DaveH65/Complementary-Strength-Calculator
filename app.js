// Global Conversion Constant (1 kg = 2.20462 lbs)
const KG_TO_LBS = 2.20462;

// A. Strength Standards Data (ALL VALUES ARE IN LBS)
const strengthStandards = {
    'male': {
        'Barbell Bench Press': { 'Novice': 150, 'Intermediate': 225, 'Advanced': 315, 'Elite': 405 },
        'Back Squat': { 'Novice': 185, 'Intermediate': 275, 'Advanced': 385, 'Elite': 495 },
        'Standing Barbell Shoulder Press': { 'Novice': 95, 'Intermediate': 145, 'Advanced': 200, 'Elite': 260 },
        'Front Squat': { 'Novice': 150, 'Intermediate': 220, 'Advanced': 300, 'Elite': 380 },
        'Barbell Overhead Press (Strict)': { 'Novice': 90, 'Intermediate': 135, 'Advanced': 185, 'Elite': 235 },
        'Pull-up': { 'Novice': 180, 'Intermediate': 225, 'Advanced': 275, 'Elite': 330 }, 
    },
    'female': {
        'Barbell Bench Press': { 'Novice': 85, 'Intermediate': 135, 'Advanced': 185, 'Elite': 235 },
        'Back Squat': { 'Novice': 105, 'Intermediate': 165, 'Advanced': 225, 'Elite': 285 },
        'Standing Barbell Shoulder Press': { 'Novice': 55, 'Intermediate': 85, 'Advanced': 115, 'Elite': 150 },
        'Front Squat': { 'Novice': 80, 'Intermediate': 125, 'Advanced': 170, 'Elite': 215 },
        'Barbell Overhead Press (Strict)': { 'Novice': 50, 'Intermediate': 75, 'Advanced': 100, 'Elite': 130 },
        'Pull-up': { 'Novice': 130, 'Intermediate': 155, 'Advanced': 180, 'Elite': 210 }, 
    }
};


// B. Conversion Ratios Data (14 Total Pairings)
const conversionRatios = [
    {id: 'bb_db_bench', inputExercise: 'Barbell Bench Press', complementaryExercise: 'Dumbbell Bench Press', inputUnit: 'Bar Total Weight', outputUnit: 'Total Dumbbell Weight', ratioRange: { low: 0.70, high: 0.85 }, requiresBodyWeight: false, notes: 'Barbell to Dumbbell: Lower max due to increased stability demand and bilateral deficit.'},
    {id: 'db_bb_bench', inputExercise: 'Dumbbell Bench Press', complementaryExercise: 'Barbell Bench Press', inputUnit: 'Total Dumbbell Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 1.18, high: 1.43 }, requiresBodyWeight: false, notes: 'Dumbbell to Barbell: Higher max due to fixed bar path and use of both limbs together.'},
    {id: 'pullup_pulldown', inputExercise: 'Pull-up', complementaryExercise: 'Lat Pulldown', inputUnit: 'Effective Weight (BW + Added W)', outputUnit: 'Machine Stack Weight', ratioRange: { low: 1.15, high: 1.30 }, requiresBodyWeight: true, notes: 'Pull-up to Pulldown: Machine stability and leverage allows for a substantially heavier load.'},
    {id: 'pulldown_pullup', inputExercise: 'Lat Pulldown', complementaryExercise: 'Pull-up', inputUnit: 'Machine Stack Weight', outputUnit: 'Effective Weight (BW + Added W)', ratioRange: { low: 0.77, high: 0.87 }, requiresBodyWeight: true, notes: 'Pulldown to Pull-up: Free-hanging stability significantly reduces the maximum load capacity.'},
    {id: 'bb_db_ohp', inputExercise: 'Standing Barbell Shoulder Press', complementaryExercise: 'Standing Dumbbell Shoulder Press', inputUnit: 'Bar Total Weight', outputUnit: 'Total Dumbbell Weight', ratioRange: { low: 0.70, high: 0.82 }, requiresBodyWeight: false, notes: 'Barbell to Dumbbell: High demand for core and shoulder stability when standing results in a lower max.'},
    {id: 'db_bb_ohp', inputExercise: 'Standing Dumbbell Shoulder Press', complementaryExercise: 'Standing Barbell Shoulder Press', inputUnit: 'Total Dumbbell Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 1.22, high: 1.43 }, requiresBodyWeight: false, notes: 'Dumbbell to Barbell: Fixed bar allows for maximal pressing force with minimal stabilization needed.'},
    {id: 'back_front_squat', inputExercise: 'Back Squat', complementaryExercise: 'Front Squat', inputUnit: 'Bar Total Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 0.80, high: 0.90 }, requiresBodyWeight: false, notes: 'Back to Front Squat: Requires significant core rigidity and mobility; strength transfer is limited by these factors.'},
    {id: 'front_back_squat', inputExercise: 'Front Squat', complementaryExercise: 'Back Squat', inputUnit: 'Bar Total Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 1.11, high: 1.25 }, requiresBodyWeight: false, notes: 'Front to Back Squat: Leverage shift allows for much greater weight.'},
    {id: 'bench_ohp', inputExercise: 'Barbell Bench Press', complementaryExercise: 'Barbell Overhead Press (Strict)', inputUnit: 'Bar Total Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 0.60, high: 0.75 }, requiresBodyWeight: false, notes: 'Bench to OHP: Expected ratio; OHP uses smaller muscle groups and requires more systemic stability.'},
    {id: 'ohp_bench', inputExercise: 'Barbell Overhead Press (Strict)', complementaryExercise: 'Barbell Bench Press', inputUnit: 'Bar Total Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 1.33, high: 1.67 }, requiresBodyWeight: false, notes: 'OHP to Bench: Expected ratio; Bench Press uses larger muscle mass (pecs) and is mechanically easier.'},
    {id: 'leg_press_squat', inputExercise: 'Leg Press', complementaryExercise: 'Back Squat', inputUnit: 'Sled Total Weight', outputUnit: 'Bar Total Weight', ratioRange: { low: 0.50, high: 0.65 }, requiresBodyWeight: false, notes: 'Leg Press to Squat: Loss of stability and reliance on core/torso strength significantly reduces the max load.'},
    {id: 'squat_leg_press', inputExercise: 'Back Squat', complementaryExercise: 'Leg Press', inputUnit: 'Bar Total Weight', outputUnit: 'Sled Total Weight', ratioRange: { low: 1.54, high: 2.00 }, requiresBodyWeight: false, notes: 'Squat to Leg Press: Removal of core/spinal stability limits allows for a massive increase in weight.'},
    {id: 'squat_lunge', inputExercise: 'Back Squat', complementaryExercise: 'Walking Lunge', inputUnit: 'Bar Total Weight', outputUnit: 'Total Lunge Load (BW + Weight)', requiresBodyWeight: true, ratioRange: { low: 0.50, high: 0.60 }, notes: 'Squat to Lunge: Unilateral stability and balance requirements significantly cut the total load.'},
    {id: 'lunge_squat', inputExercise: 'Walking Lunge', complementaryExercise: 'Back Squat', inputUnit: 'Total Lunge Load (BW + Weight)', outputUnit: 'Bar Total Weight', ratioRange: { low: 1.67, high: 2.00 }, requiresBodyWeight: true, notes: 'Lunge to Squat: Moving from high instability to stability greatly increases the possible 1RM.'}
];


// C. Unit Conversion Helpers

/** Converts a value to LBS if KG is selected. Assumes input is in user's unit. */
function toLbs(value, unit) {
    return unit === 'kg' ? value * KG_TO_LBS : value;
}

/** Converts a value from LBS to the user's selected unit. */
function fromLbs(value, unit) {
    return unit === 'kg' ? value / KG_TO_LBS : value;
}


// D. Core Calculation Functions 

function calculate1RM(weight, reps) {
    if (weight <= 0 || reps <= 0) return 0;
    let estimated1RM = weight * (1 + reps / 30);
    return parseFloat(estimated1RM.toFixed(1)); 
}

function getStrengthRating(ie1RM, gender, exerciseName) {
    if (!gender || !strengthStandards[gender] || !strengthStandards[gender][exerciseName]) {
        return { level: 'N/A', description: 'Standards not available for this lift.', color: '#555' };
    }

    const standards = strengthStandards[gender][exerciseName];
    let level = 'Beginner';
    let percentile = 'Less than 10% (Trained)';
    let color = '#777';

    if (ie1RM >= standards.Elite) {
        level = 'Elite 🌟';
        percentile = 'Stronger than 95%';
        color = '#ffd700';
    } else if (ie1RM >= standards.Advanced) {
        level = 'Advanced 🚀';
        percentile = 'Stronger than 80%';
        color = '#ff8c00';
    } else if (ie1RM >= standards.Intermediate) {
        level = 'Intermediate 💪';
        percentile = 'Stronger than 50%';
        color = '#4CAF50';
    } else if (ie1RM >= standards.Novice) {
        level = 'Novice 🏋️';
        percentile = 'Stronger than 20%';
        color = '#2196F3';
    } 

    return { level, description: percentile, color };
}

function getRatingSource(results, gender) {
    const standards = strengthStandards[gender];

    // Case 1: Standard exists for the Input Exercise
    if (standards && standards[results.inputExercise]) {
        return { rating1RM: results.ie1RM, ratingExerciseName: results.inputExercise };
    }
    
    // Case 2: Standard exists for the Complementary Exercise (use max prediction)
    if (standards && standards[results.complementaryExercise]) {
        return { rating1RM: results.ce1RMHigh, ratingExerciseName: results.complementaryExercise };
    }
    
    // Case 3: No standard available
    return { rating1RM: 0, ratingExerciseName: results.inputExercise };
}

function analyzeImbalance(actualCE1RM_Lbs, results) {
    const low = results.ce1RMLow;
    const high = results.ce1RMHigh;
    const midPoint = (low + high) / 2;
    const percentageDifference = ((actualCE1RM_Lbs - midPoint) / midPoint) * 100; 

    let analysis = '';

    if (actualCE1RM_Lbs >= high) {
        analysis = `✅ **High Carryover!** Your max is **${Math.round(percentageDifference)}%** above the predicted midpoint. Your ${results.complementaryExercise} is excellent, indicating highly efficient stabilizer muscles and strength transfer.`;
    } else if (actualCE1RM_Lbs < low) {
        analysis = `⚠️ **Potential Imbalance.** Your max is **${Math.round(Math.abs(percentageDifference))}%** below the predicted midpoint. For the ${results.complementaryExercise}, you may be limited by factors like stability, grip, or core strength, not pure prime-mover strength. Focus on unilateral/stability work.`;
    } else {
        analysis = `👍 **Solid Carryover.** Your max falls within the predicted range. This suggests balanced strength transfer from your ${results.inputExercise} to your ${results.complementaryExercise}. Keep pushing!`;
    }

    analysis += `<br><br><small>(${results.notes})</small>`;
    return analysis;
}


// E. Translation Logic (Inputs are converted to LBS first)

function translateMax(exerciseID, weight, reps, bodyWeight, unit) {
    const pairing = conversionRatios.find(p => p.id === exerciseID);
    if (!pairing) return null;

    // Convert ALL inputs to LBS for calculation consistency
    const weightLbs = toLbs(weight, unit);
    const bodyWeightLbs = toLbs(bodyWeight, unit);

    let input1RM;
    if (pairing.requiresBodyWeight) {
        const effectiveWeight = weightLbs + bodyWeightLbs; 
        input1RM = calculate1RM(effectiveWeight, reps);
    } else {
        input1RM = calculate1RM(weightLbs, reps);
    }
    
    if (input1RM === 0) return null;

    const { low: lowRatio, high: highRatio } = pairing.ratioRange;

    let ce1RMLow = input1RM * lowRatio;
    let ce1RMHigh = input1RM * highRatio;

    return {
        inputExercise: pairing.inputExercise,
        complementaryExercise: pairing.complementaryExercise,
        // Store results in LBS
        ie1RM: input1RM,
        ce1RMLow: ce1RMLow,
        ce1RMHigh: ce1RMHigh,
        outputUnit: pairing.outputUnit,
        notes: pairing.notes
    };
}


// F. Display and Event Handlers (Outputs are converted from LBS)

function displayResults(results, rating, ratingSource, unit) { 
    
    // Convert LBS results to user's unit for display
    const ie1RM_display = fromLbs(results.ie1RM, unit).toFixed(1);
    const low_display = fromLbs(results.ce1RMLow, unit).toFixed(1);
    const high_display = fromLbs(results.ce1RMHigh, unit).toFixed(1);
    const unitText = unit.toUpperCase();
    
    // --- RATING DISPLAY ---
    document.getElementById('ratingLevel').textContent = rating.level;
    document.getElementById('ratingLevel').style.color = rating.color;
    document.getElementById('ratingPercentile').innerHTML = rating.description;

    if (ratingSource.ratingExerciseName !== results.inputExercise) {
        document.getElementById('ratingPercentile').innerHTML += 
            `<br><small style="color: #8b949e;">(Rating based on your **predicted ${ratingSource.ratingExerciseName}** max.)</small>`;
    }

    // --- MAX DISPLAY ---
    document.getElementById('inputExerciseName').textContent = results.inputExercise;
    document.getElementById('complementaryExerciseName').textContent = results.complementaryExercise;
    document.getElementById('ie1RMDisplay').textContent = `${ie1RM_display} ${unitText}`;
    document.getElementById('ce1RMDisplay').textContent = `${low_display} ${unitText} - ${high_display} ${unitText}`;
    document.getElementById('outputUnitDetail').textContent = `(${results.outputUnit})`;

    // Special logic for dumbbell conversions
    if (results.outputUnit === 'Total Dumbbell Weight') {
        const perDumbbellLow = fromLbs(results.ce1RMLow / 2, unit).toFixed(1);
        const perDumbbellHigh = fromLbs(results.ce1RMHigh / 2, unit).toFixed(1);
        document.getElementById('outputUnitDetail').textContent += ` / (${perDumbbellLow} - ${perDumbbellHigh} ${unitText} per dumbbell)`;
    }
    
    // Initialize Imbalance Insight prompt
    document.getElementById('imbalanceInsight').innerHTML = 
        `<em>Enter your actual 1RM below in **${unitText}** and click 'ANALYZE IMBALANCE' to receive your personalized diagnosis.</em>`;
    
    // Clear previous input/value and show the analysis field
    document.getElementById('actualCE1RM').value = ''; 
    document.getElementById('ceActualName').textContent = results.complementaryExercise;
    document.getElementById('actualMaxInputContainer').style.display = 'block';
    document.getElementById('resultsPanel').style.display = 'block';
}


function handleCalculation() {
    // 1. Get Input Values
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const gender = document.getElementById('genderSelect').value;
    const exerciseID = document.getElementById('exerciseSelect').value;
    const weight = parseFloat(document.getElementById('weightInput').value);
    const reps = parseInt(document.getElementById('repsInput').value);
    const bodyWeight = parseFloat(document.getElementById('bodyWeightInput').value); 
    
    const resultsPanel = document.getElementById('resultsPanel');

    // 2. Input Validation 
    if (!gender || !exerciseID || isNaN(weight) || weight <= 0 || isNaN(reps) || reps <= 0 || isNaN(bodyWeight) || bodyWeight <= 0) {
        alert("Please select gender, enter body weight, and input valid lift data.");
        resultsPanel.style.display = 'none';
        return;
    }

    // 3. Run the Core Logic (Calculations are performed internally in LBS)
    const results = translateMax(exerciseID, weight, reps, bodyWeight, unit);

    if (results) {
        // Get rating source (in LBS)
        const ratingSource = getRatingSource(results, gender);

        // Get the Strength Rating (uses LBS standard)
        const rating = getStrengthRating(ratingSource.rating1RM, gender, ratingSource.ratingExerciseName);

        // 4. Display the Results (Pass unit for correct output formatting)
        displayResults(results, rating, ratingSource, unit);
    } else {
        alert("An error occurred during calculation. Check the selected exercise.");
    }
}

// RESTORED: Manual Analysis Logic (triggered by button click)
function handleAnalysis() {
    // Check if the prediction has been run first
    if (document.getElementById('resultsPanel').style.display === 'none') return;
    
    const actualCE1RM_userUnit = parseFloat(document.getElementById('actualCE1RM').value);

    // Require valid input for analysis
    if (isNaN(actualCE1RM_userUnit) || actualCE1RM_userUnit <= 0) {
        alert("Please enter a valid actual 1RM to perform the imbalance analysis.");
        return;
    }
    
    // Get unit and convert actualCE1RM to LBS for calculation
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const actualCE1RM_Lbs = toLbs(actualCE1RM_userUnit, unit);

    // Re-run core logic to get necessary predicted range (in LBS)
    const exerciseID = document.getElementById('exerciseSelect').value;
    const weight = parseFloat(document.getElementById('weightInput').value);
    const reps = parseInt(document.getElementById('repsInput').value);
    const bodyWeight = parseFloat(document.getElementById('bodyWeightInput').value);
    
    // Note: We MUST re-run translateMax to get the 'results' object for comparison
    const results = translateMax(exerciseID, weight, reps, bodyWeight, unit); 

    if (results) {
        // Run the core analysis logic (using LBS values)
        const analysisText = analyzeImbalance(actualCE1RM_Lbs, results);
        document.getElementById('imbalanceInsight').innerHTML = analysisText;
    }
}


// G. Setup and Listeners 

document.addEventListener('DOMContentLoaded', () => {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const calculateButton = document.getElementById('calculateButton');
    // --- RESTORED: Define the Analyze Button ---
    const analyzeButton = document.getElementById('analyzeButton'); 

    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const weightInputLabel = document.querySelector('label[for="weightInput"]');
    const weightInput = document.getElementById('weightInput');
    
    // Populate the Dropdown Menu
    conversionRatios.forEach(pairing => {
        const option = document.createElement('option');
        option.value = pairing.id;
        option.textContent = `${pairing.inputExercise} → ${pairing.complementaryExercise}`;
        exerciseSelect.appendChild(option);
    });

    // Helper function to update all dynamic UI text (labels, placeholders)
    function updateUIText() {
        const unit = document.querySelector('input[name="unit"]:checked').value;
        const unitDisplay = unit === 'lbs' ? '(LBS)' : '(KG)';
        
        // Update generic bodyweight label
        document.querySelector('label[for="bodyWeightInput"]').textContent = `Your Body Weight ${unitDisplay}:`;

        const selectedId = exerciseSelect.value;
        const pairing = conversionRatios.find(p => p.id === selectedId);

        let inputLabelText = `Weight Lifted ${unitDisplay}:`;
        
        if (pairing) {
            const inputName = pairing.inputExercise;
            
            // Logic for updating the Weight Lifted label and placeholder
            if (inputName.includes('Barbell') || inputName.includes('Squat') || inputName.includes('Leg Press') || inputName.includes('Deadlift')) {
                 inputLabelText = `Weight Lifted (${inputName} Total Weight) ${unitDisplay}:`;
                 weightInput.placeholder = unit === 'lbs' ? 'e.g., 315 (Barbell/Sled)' : 'e.g., 142 (Barbell/Sled)';
            } else if (inputName.includes('Dumbbell')) {
                inputLabelText = `Weight Lifted (Total Dumbbell Weight) ${unitDisplay}:`;
                weightInput.placeholder = unit === 'lbs' ? 'e.g., 200 (Total)' : 'e.g., 90 (Total)';
            } else if (inputName.includes('Pull-up')) {
                inputLabelText = `Added Weight Lifted (if weighted) ${unitDisplay}:`;
                weightInput.placeholder = unit === 'lbs' ? 'e.g., 45 (Added Plate)' : 'e.g., 20 (Added Plate)';
            } else if (inputName.includes('Lunge')) {
                inputLabelText = `Added Lunge Weight (Dumbbell/Barbell) ${unitDisplay}:`;
                weightInput.placeholder = unit === 'lbs' ? 'e.g., 135 (Added Load Only)' : 'e.g., 61 (Added Load Only)';
            } else if (inputName.includes('Pulldown')) {
                inputLabelText = `Machine Weight Lifted ${unitDisplay}:`;
                weightInput.placeholder = unit === 'lbs' ? 'e.g., 250 (Machine Stack)' : 'e.g., 113 (Machine Stack)';
            }
        }
        
        weightInputLabel.textContent = inputLabelText;

        // If results are already showing, re-run calculation to update display units
        if (document.getElementById('resultsPanel').style.display !== 'none') {
            handleCalculation();
        }
    }

    // Attach listeners
    calculateButton.addEventListener('click', handleCalculation);
    // --- CRITICAL FIX: Attach the click listener for the analysis button ---
    analyzeButton.addEventListener('click', handleAnalysis); 
    
    exerciseSelect.addEventListener('change', updateUIText); // Update on pairing change
    
    // Update on unit change (LBS/KG)
    unitRadios.forEach(radio => {
        radio.addEventListener('change', updateUIText);
    });

    // Trigger initial setup
    updateUIText(); 
});
