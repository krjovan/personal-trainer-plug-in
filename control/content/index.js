let exerciseList = {
    exercises: []
};

function addExercise() {
    var exercise = {};
    exercise.name = document.getElementById('txtExerciseName').value;
    exercise.description = document.getElementById('txtExerciseDesc').value;
    exercise.quantity = document.getElementById('txtExerciseQuantity').value;
    exercise.measure = document.getElementById('txtExerciseMeasure').value;
    exerciseList.exercises.push(exercise);

    save(err => {
        if (err)
            return console.error(err);
        else {
            addExerciseToList(txtExerciseName.value, txtExerciseDesc.value, txtExerciseQuantity.value, txtExerciseMeasure.value);
            txtExerciseName.value = '';
            txtExerciseDesc.value = '';
            txtExerciseQuantity.value = '';
            txtExerciseMeasure.value = 'reps';
        }
    });
}

function save(callback) {
    buildfire.datastore.save(exerciseList, "exerciseCol", callback);
}

function load() {
    buildfire.datastore.get("exerciseCol", (err, response) => {

        if (err) return console.error(err);

        if (response && response.data && response.data.exercises) {
            exerciseList = response.data;
            ulTasks.innerHTML = '';

            if (exerciseList && exerciseList.exercises && exerciseList.exercises.length) {
                exerciseList.exercises.forEach(el => {
                    addExerciseToList(el.name, el.description, el.quantity, el.measure);
                });
            }
        }
    });
}

function addExerciseToList(txtExerciseName, txtExerciseDesc, txtExerciseQuantity, txtExerciseMeasure) {
    let li = ui('li', ulTasks, txtExerciseName + ' - ' + txtExerciseDesc + ' - ' + txtExerciseQuantity + ' ' + txtExerciseMeasure);
    let delBtn = ui('button', li, 'X', ['delButton']);
    delBtn.onclick = () => {

        for (var i = exerciseList.exercises.length - 1; i >= 0; --i) {
            if (exerciseList.exercises[i].name == txtExerciseName) {
                exerciseList.exercises.splice(i,1);
                save();
                ulTasks.removeChild(li);
            }
        }
    };
}

function ui(elementType, appendTo, innerHTML, classNameArray) {
    let e = document.createElement(elementType);
    if (innerHTML) e.innerHTML = innerHTML;
    if (Array.isArray(classNameArray))
        classNameArray.forEach(c => e.classList.add(c));
    if (appendTo) appendTo.appendChild(e);
    return e;
}

load();

function registerEvents() {
    buildfire.analytics.registerEvent({
        title: "Exercise Completed",
        key: "EXERCISE_COMPLETED",
        description: "Occurs when a user marks an exercise as complete"
    }, { silentNotification: false });
}
registerEvents();