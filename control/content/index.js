let exerciseList = {
    exercises: []
};

function addExercise() {
    var exercise = {};
    exercise["name"] = txtExerciseName.value;
    exercise["description"] = txtExerciseDesc.value;
    exercise["quantity"] = txtExerciseQuantity.value;
    exercise["measure"] = txtExerciseMeasure.value;
    exerciseList.exercises.push(exercise);

    save(err => {
        if (err)
            return console.error(err);
        else {
            addExerciseToList(exercise);
            txtExerciseName.value = '';
            txtExerciseDesc.value = '';
            txtExerciseQuantity.value = '';
            txtExerciseMeasure.value = '';
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
                exerciseList.exercises.forEach(addExerciseToList);
            }
        }
    });
}

function addExerciseToList(exercise) {
    let li = ui('li', ulTasks, exercise.name + ' ' + exercise.description + ' ' + exercise.quantity + ' ' + exercise.measure);
    let delBtn = ui('button', li, 'X', ['delButton']);
    delBtn.onclick = () => {

        let i = exerciseList.exercises.findIndex(t => t == exercise);
        if (i >= 0) {
            exerciseList.exercises.splice(i, 1);
            save();
            ulTasks.removeChild(li);
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