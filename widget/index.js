let myProfile = {
    completedExercises: []
};

function load() {
    buildfire.datastore.get("exerciseCol", (err, response) => {

        if (err)
            console.error(err);
        else if (response.data.exercises)
            renderExercises(response.data.exercises);
    });


    buildfire.datastore.onUpdate(obj => {
        renderExercises(obj.data.exercises);
    });

    authManager.getCurrentUser((err, user) => {
        if (err)
            return console.error(err);
        else
            loadUserExercises(user);
    });

    authManager.enforceLogin();

}

function renderExercises(exercises) {
    ulTasks.innerHTML = '';
    if (exercises && exercises.length)
        exercises.forEach(addExercisesToList);

}

function loadUserExercises(user) {
    buildfire.userData.get("myCompletedExercises", (err, response) => {
        if (response && response.data && response.data.completedExercises) {
            myProfile = response.data;
            myProfile.completedExercises.forEach(t => {
                document.querySelectorAll("#ulTasks > li").forEach(li => {
                    if (li.innerHTML == t)
                        li.classList.add("completed");
                })
            });
        }
    });
}


function addExercisesToList(exercise) {
    let li = ui('li', ulTasks, exercise.name + ' ' + exercise.description + ' ' + exercise.quantity + ' ' + exercise.measure);
    li.onclick = () => {


        if (li.classList.contains("completed")) {
            li.classList.remove("completed");
            let i = myProfile.completedExercises.findIndex(t => t == exercise);
            if (i >= 0) {
                myProfile.completedExercises.splice(i, 1);
                saveUserExercise();
            }
        }
        else {
            li.classList.add("completed");
            myProfile.completedExercises.push(exercise);
            saveUserExercise();
            buildfire.analytics.trackAction("EXERCISE_COMPLETED");
        }
    }

}

function saveUserExercise() {
    buildfire.userData.save(myProfile, "myCompletedExercises", err => {
        if (err) return console.error(err)
    });
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
