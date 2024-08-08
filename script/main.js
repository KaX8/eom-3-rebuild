let scoreEl = document.getElementById("score");
let livesEl = document.getElementById("lives");
let score = 0;
let lives = 10;
let countCorrectAnswered = 0;
let countAnswered = 0;

let questionsBtn;

let popUpContent = document.getElementById("popup_content");
let popUpWindow = document.getElementById("popup_window");
let popUpClose = document.getElementById("popup_close");
let popUpBottom;

let dragNdropObject;
let dropTarget;
let dragFrom;

let currentQuestionId = -1;   
let currentQuestionType = 0;
let currentQuestionButton;

// Массив путей для состояния вопроса
const questionsStates = [
    "./content/incorrect.svg",
    "./content/correct.svg"
    ];

// Главный скрипт. Запускается как только полностью загрузится страница
document.addEventListener('DOMContentLoaded', function(){ 

    lives = allQuestions.length;

    // Сообщение о загрузке скрипта
    console.log('Script is loaded');

    // Каждой кнопке присваиваем обработчик события handleQuestionClick, 
    // который будет открывать соответствующее модальное окно
    questionsBtn = document.getElementsByClassName('question');
    for (question of questionsBtn){
        question.addEventListener('click', handleQuestionClick);
    }
    // DEBUGGING
    
    
    
});

// Обработчик события - клик на кнопку вопроса на главной странице
function handleQuestionClick(e){
    currentQuestionButton = e.srcElement;
    currentQuestionId = this.className.split(" ")[1].replace("id", "");
    popUpQuestionOpen();
}

// Обработчик события, если нажали на кнопку "Ответить". Собираем ответы, проверяем их, записываем
function submitHandler(e){
    e.preventDefault();

    let answers = getUserAnswers(e);

    if (userHasAnswers(answers)){
        console.log("USER ANSWERS: " + `${answers}`);
        userAnswersHandler(answers);
        popUpQuestionOpen();
    }else{
        showErrors(e);
    }
    
}

// Получаем ответы пользователя, в нужном нам формате
function getUserAnswers(el){
    let arr = [];
    let textAnsw = [];
    let trueAnsw = allQuestions[currentQuestionId].answers;

    if (currentQuestionType == 5){
        let rawAnsw = document.getElementsByClassName("custom-dropdown-input-placeholder");
        for (el of rawAnsw){
            textAnsw.push(el.innerHTML);
            if (el.innerHTML == "Выберите ответ") textAnsw.push(-1);
        }

        for (let i = 0; i < textAnsw.length; i++) arr.push(trueAnsw.indexOf(textAnsw[i]));
        
    }else if (currentQuestionType == 3 || currentQuestionType == 4) {
        let dropZones = el.target.getElementsByClassName(`question_type_${currentQuestionType}_answer_drop_zone`);
        
        for (el of dropZones){
            for (drop of el.children) textAnsw.push(drop.innerHTML);
        }
        
        for (let i = 0; i < textAnsw.length; i++) arr.push(trueAnsw.indexOf(textAnsw[i]));

        if (currentQuestionType == 4){
            let countItemDropZone = dropZones[0].children.length;
            let leftSide = arr.splice(0,countItemDropZone);
            arr = [leftSide.sort((a, b) => a - b), arr.sort((a, b) => a - b)]; 
        }

        console.log(arr);

    }else if (currentQuestionType == 2){

        for (el of el.target.getElementsByClassName("custom-dropdown-input-placeholder")) 
            textAnsw.push(el.innerHTML);

        for (let i = 0; i < trueAnsw.length; i++){
            for (let j = 0; j < trueAnsw[i].length; j++){
                if (textAnsw[i] == trueAnsw[i][j]) arr.push(j);
            }
        }
        
    }else {
        for (el of el.target) if(el.checked) arr.push(parseInt(el.value));
    }

    return arr;
}

// Проверка, ответил ли пользователь НА САМОМ ДЕЛЕ
function userHasAnswers(answers){
    //return allQuestions[currentQuestionId].correctAnswer.length === answers.length;

    if (currentQuestionType == 0 || currentQuestionType == 1 ) {
        return answers.length > 0;
    }else if (currentQuestionType == 2 || currentQuestionType == 3 ||currentQuestionType == 5 ){
        return allQuestions[currentQuestionId].correctAnswer.length === answers.length;
    }else if(currentQuestionType == 4){
        let sumOfCorrect = 0;
        let sumOfUsers = 0;
        for (let i = 0; i < allQuestions[currentQuestionId].correctAnswer.length; i++)
            for (let j = 0; j < allQuestions[currentQuestionId].correctAnswer[i].length; j++)
                sumOfCorrect++;

        for (let i = 0; i < answers.length; i++)
            for (let j = 0; j < answers[i].length; j++)
                sumOfUsers++;
        console.log(sumOfCorrect);
        console.log(sumOfUsers);
        return sumOfCorrect === sumOfUsers;
    }
}

function showErrors(e){

    let elToErrors = [];

    if (currentQuestionType == 0 || currentQuestionType == 1 ) {
        for (let i = 0; i < allQuestions[currentQuestionId].answers.length; i++)
                elToErrors.push(document.getElementById(`question_type_${currentQuestionType}_answer_${i}`));
    }else if (currentQuestionType == 2 || currentQuestionType == 5){
        for (let i = 0; i < allQuestions[currentQuestionId].answers.length; i++){
            txtAnswer = document.getElementById(`question_type_${currentQuestionType}_answer_${i}`).childNodes[0].innerHTML
            if (txtAnswer == "Выберите ответ")
                elToErrors.push(document.getElementById(`question_type_${currentQuestionType}_answer_${i}`));
        }
    } else if(currentQuestionType == 3){
        let dragZones = e.target.getElementsByClassName(`question_type_${currentQuestionType}_answer_drop_zone`);
        for (el of dragZones) {
            if (el.children.length == 0) elToErrors.push(el);
        }
    } else if(currentQuestionType == 4){
        console.log(e.target);
        let dragItems = e.target.getElementsByClassName(`question_type_4_answers`)[0].children;
        for (el of dragItems) elToErrors.push(el);
    }

    for (el of elToErrors){
        el.setAttribute("class",`${el.className} un_answered`);
    }

    document.getElementById("question_text").innerHTML = 
        allQuestions[currentQuestionId].text +" Выберите ответ!";
}

// Функция установки состояния вопроса: Пройден(1), Не пройден(0).
function setStateToQuestion(el, state) {

    let stateImgDiv = document.createElement("div");
    stateImgDiv.setAttribute("class", "state_marker")

    let stateImg = document.createElement("img");
    stateImg.setAttribute("src", questionsStates[state]);
    stateImgDiv.appendChild(stateImg);

    el.appendChild(stateImgDiv);
}

// Функция открытия модального окна
function popUpQuestionOpen(result = false){

    // Подготовка к созданию окна. Удаляем тело прошлого модального окна, если есть
    deletePopUpMain()

    currentQuestionType = allQuestions[currentQuestionId].type;

    constuctPopUp(result);

    popUpWindow.setAttribute("class", "popup unclosed");
}

// Функция закрытия модального окна
function popUpQuestionClose(){
    popUpWindow.setAttribute("class", "popup closed");  
}

// Функция конструирования блока с вопросом/результатом
function constuctPopUp(result){
    let question = allQuestions[currentQuestionId];

    console.log(`CONSTRUCT QUESTION TYPE ${question.type} AND ID ${currentQuestionId}`);

    // Создаем тело модального окна
    if (!result) popUpWindow.appendChild(createPopUpMain(question));
        else popUpWindow.appendChild(createResult());

    popUpBottom = document.getElementById("popup_bottom");

    if (question.answered == null) createDragNDropHandlers(question);
}

// Функция, указывающая пройден ли конкретный вопрос
function questionIsPassed(question){

    if(question.answered != null) return true;
    return false;
    
}

// Функция, обрабатывающая ответ пользователя
function userAnswersHandler(userAnswers){
    let currentQuestion = allQuestions[currentQuestionId];

    // Записываем ответ пользователя в соответствующее поле объекта вопроса
    currentQuestion.answered = userAnswers;
    // Проверяем, верный ли был ответ, ставим соответсвующее изображение на кнопку
    isCorrect = answerIsCorrect(currentQuestion, userAnswers);
    console.log(`IS CORRECT? ${isCorrect}`);

    if (isCorrect) {
        setStateToQuestion(currentQuestionButton, 1);
        score += currentQuestion.price;
        countCorrectAnswered++;
    }
    else {
        setStateToQuestion(currentQuestionButton, 0);
    }

    scoreEl.innerHTML = `${score}`;
    lives--;
    livesEl.innerHTML = `${lives}`;
    countAnswered++;

    // Если кончились жизни ИЛИ на все вопросы ответили
    if (lives <= 0 || countAnswered == allQuestions.length){
        // Отключаем клик на неотвеченных вопросах
        // Создаем кнопку результатов
        setTestCompleted();
    }
}

// Функция, возвращающее, верный ли был ответ
function answerIsCorrect(question, userAnswers){
    corrects = question.correctAnswer;
    userAnswers = userAnswers;
    if (currentQuestionType == 4){
        for (let i = 0; i < corrects.length; i++)
            if (corrects[i].toString() != userAnswers[i].toString())
                return false;
        return true;
    }
    else if (corrects.toString() === userAnswers.toString()) 
        return true;

    return false;
}

// Функция обработчик события "Взяли объект"
// function dragNdropHandler(e){
//     console.log("DRAG-N-DROP");
//     dragFrom = e.target.parentNode;
//     console.log(`FROM ${dragFrom}`);
    
//     // Создание точной копии объекта
//     dragNdropObject = e.target;
//     // e.target.parentNode.appendChild(clone);
//     // e.target.remove();
    
//     // даём элементу абсолютную позицию, да бы перемещать без нарушения верстки
//     // и перемещаем его на позицию курсора
//     dragNdropObject.style.position = 'absolute';
//     dragMoveAt(e, dragNdropObject);

//     // 3, перемещать по экрану
//     document.onmousemove = function(e) {
//         dragMoveAt(e, dragNdropObject);
//     }

//     // 4. отследить окончание переноса
//     dragNdropObject.onmouseup = function() {
//         document.onmousemove = null;
//         dragNdropObject.onmouseup = null;
//         dragNdropObject.remove();

//         // Отслеживаем, где отпустили объект
//         document.addEventListener('mouseover', (e) => dropObject(e), {once: true});
        
//     }
// }

// // Функция перемещения объекта и позиционирования его по центру
// function dragMoveAt(e, el) {
//     el.style.left = e.clientX - el.offsetWidth / 2 + 'px';
//     el.style.top = e.clientY - el.offsetHeight / 2 + 'px';
// }

// // Функция обработчик, отслеживаем где отпустили объект и добавляем его в соотв. drop_zone
// function dropObject(e){
//     console.log("Функция обработчик, отслеживаем где отпустили объект и добавляем его в соотв. drop_zone");
    
//     let dropTarget = defineDropTarget(e);

//     console.log(dropTarget);
//     console.log(dropTarget.children.length > 0);



//     switch(currentQuestionType){
//         case 3:
//             // В 3 типе вопросов: 
//             // Если в таргете, куда перетаскиваем объект, уже что то есть, 
//             // перемещаем содержимое на место, откуда взяли текущий объект
//             if (dropTarget.children.length > 0) dragFrom.appendChild(dropTarget.children[0]);
//             break;
//         case 4:
//             // В 3 типе вопросов: ничего не делаем
//             break;
//     }
    
//     dragNdropObject.classList.remove("un_answered");
//     dropTarget.classList.remove("un_answered");
//     dragNdropObject.addEventListener('mousedown', (e) => dragNdropHandler(e));
//     dragNdropObject.style = null;
//     dropTarget.appendChild(dragNdropObject);

// }

// function defineDropTarget(e){
//     let dropTarget;
//     console.log(currentQuestionType);
//     console.log(e.target.className);
//     switch(currentQuestionType){
//         case 3:

//             console.log(e.target.tagName);
//             if (e.target.tagName == "IMG"){
//                 console.log("ITS IMG");
//                 let parents = e.target.parentNode.parentNode;
//                 dropTarget = parents.getElementsByClassName(`question_type_3_answer_drop_zone`)[0];

//             }else if (e.target.tagName == "DIV" && e.target.className == `question_type_3_answer`) {
//                 console.log("ITS WHITE SPACE");
//                 dropTarget = e.target.getElementsByClassName(`question_type_3_answer_drop_zone`)[0]; 
//             }else if (e.target.className.indexOf(`drop_zone`) != -1){
//                 console.log("ITS DROP SPACE");
//                 dropTarget = e.target;

//             }else if (e.target.tagName == "DIV" && e.target.className == `question_type_3_drag`){
//                 console.log("ITS ANOTHER DROP");
//                 dropTarget = e.target.parentNode;
//             }else{
                
//                 console.log("ITS SOMETHERE");
//                 // console.log(e.target);
//                 // console.log(dragFrom);
//                 dropTarget = dragFrom;
//             }
//             break;
//         case 4:
//             if (e.target.className.indexOf("drop_zone") != -1){
//                 console.log("ITS DROP SPACE");
//                 dropTarget = e.target;
//             }else if(e.target.parentNode.className.indexOf("drop_zone") != -1){
                
//                 console.log("ITS ANOTHER DRAG IN DROP SPACE");
//                 dropTarget = e.target.parentNode;
//             }else{
//                 console.log("ITS SOMETHERE");
//                 dropTarget = dragFrom;
//             }
            
            
//             break;
//     }

//     return dropTarget;
// }

function setTestCompleted(){
    for (question of questionsBtn){
        console.log(question.children[0].children.length);
        if(question.children[0].children.length != 1){
            question.removeEventListener('click', handleQuestionClick);
        }

    }
    let btn_res = document.getElementById("button_results");
    btn_res.classList.toggle("btn_closed");
    btn_res.addEventListener('click', function (e) {
        popUpQuestionOpen(true);
    });
}




