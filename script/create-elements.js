let imgPath;
let device = "pc";
if (/iPad/i.test(navigator.userAgent)) device = "iPad";

function createButtonsBox(boxes_counter, items_counter){
    items = []
    current_box_id = 0
    
    for (var i = 0; i < boxes_counter; i++) {

        let buttons_box = document.createElement("div");
        buttons_box.setAttribute("class", "buttons_box");

        let questions_btns = document.createElement("div");
        questions_btns.setAttribute("class", "questions_btns");

        for (var j = 0; j < 5; j++) {
            console.log(boxes_counter)
            if(current_box_id < items_counter){
                questions_btns.appendChild(createQuestionButton(current_box_id));
                current_box_id++;
            }
        }

        buttons_box.appendChild(questions_btns)
        items.push(buttons_box)
    }

    return items
}

function createQuestionButton(id){
    let question = document.createElement("div")
    question.setAttribute("class", `question id${id}`)
    let btn = document.createElement("button")
    let btn_text = document.createTextNode(id+1)

    btn.appendChild(btn_text)
    question.appendChild(btn)

    return question
}

function createPopUpMain(question){
    if (question.image) imgPath = `content/quiz-images/type${question.type}`; 

    let el = document.createElement("div");
    el.setAttribute("class", "popup_main");
    el.setAttribute("id", "popup_main");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "popup_content");
    elChB.setAttribute("id", "popup_content");
    el.appendChild(elChB);

    elChB.appendChild(createHeaderPopUp(question));

    switch(question.type) {
        case 0:
            
            elChB.appendChild(createBodyPopUp_Type0(question));
            break;

        case 1:;
            elChB.appendChild(createBodyPopUp_Type1(question));
            break;

        case 2:
            elChB.appendChild(createBodyPopUp_Type2(question));
            break;

        case 3:
            elChB.appendChild(createBodyPopUp_Type3(question));
            break;

        case 4:
            elChB.appendChild(createBodyPopUp_Type4(question));
            break;

        case 5:
            elChB.appendChild(createBodyPopUp_Type5(question));
            break;
    
        default:
            break
    }

    el.addEventListener('submit', (e) => submitHandler(e));

    return el;
}

function createHeaderPopUp(question){
    let el = document.createElement("div");
    el.setAttribute("class", "header_popup");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "popup_question");
    let elChBChB = document.createElement("p");
    elChBChB.setAttribute("id", "question_text");
    let elChBChBChA = document.createTextNode(question.text);
    elChBChB.appendChild(elChBChBChA);
    elChB.appendChild(elChBChB);
    el.appendChild(elChB);
    let elChD = document.createElement("div");
    elChD.setAttribute("id", "popup_close");
    elChD.setAttribute("class", "header_popup_close");
    elChD.addEventListener('click', () => popUpQuestionClose());
    let elChDChB = document.createElement("img");
    elChDChB.setAttribute("src", "./content/close.svg");
    elChDChB.setAttribute("alt", "header_popup");
    elChD.appendChild(elChDChB);
    if (questionIsPassed(question)) el.appendChild(elChD);
        
    return el;
}

function createBottomPopUp(question){
    let el = document.createElement("div");
    el.setAttribute("class", "popup_bottom");
    el.setAttribute("id", "popup_bottom");
    let elChB = document.createElement("input");
    elChB.setAttribute("id", "post_answ");
    elChB.setAttribute("type", "submit");
    elChB.setAttribute("value", "Ответить");
    el.appendChild(elChB);
    let elChD = document.createElement("p");
    elChD.setAttribute("id", "question_price");
    // let elChDChA = document.createTextNode(`Правильный ответ даст ${question.price} очков`);
    // elChD.appendChild(elChDChA);
    el.appendChild(elChD);

    return el;
}

function createImgLoupe(addClasses = "") {
    let el = document.createElement("div")
    el.setAttribute("class", `resize_btn ${addClasses}`)
    return el
}

function deletePopUpMain(){
    if(document.getElementById("popup_main") != null)
        document.getElementById("popup_main").remove();
}




function createBodyPopUp_Type0(question){

    let el = document.createElement("div");
    el.setAttribute("class", "question_type_0_body");
    el.setAttribute("id", "question_type_0");
    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");
    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "question_type_0_radio");
    elChB.appendChild(elChBChB);
    el.appendChild(elChB);

    if (question.image) elChBChB.appendChild(createImgDiv_Type0(question));

    elChBChB.appendChild(createAnswers_Type0(question));

    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));

    return el;
}
function createAnswer_Type0(question, i){
    
    let el = document.createElement("div");
    el.setAttribute("id", `question_type_0_answer_${i}`)
    let elChB = document.createElement("input");
    elChB.setAttribute("type", "radio");
    elChB.setAttribute("name", "answ");
    elChB.setAttribute("value", `${i}`);
    el.appendChild(elChB);
    let elChD = document.createElement("p");
    elChD.setAttribute("id", `question_type_0_answer_text_${i}`);
    let elChDChA = document.createTextNode(question.answers[i]);
    elChD.appendChild(elChDChA);
    el.appendChild(elChD);

    if (questionIsPassed(question)){
        elChB.setAttribute("class", "disabled_input");
        if(question.answered.includes(i, 0)) {
            elChB.checked = true;

            if (question.correctAnswer.includes(i)){
                el.style = "background-color: #bdffbd;";
            }else el.style = "background-color: #ffb9b9;";
        }
    }else{
        el.addEventListener('click', () => {
            elChB.checked = !elChB.checked;
        });
    }
    
    return el;
}
function createAnswers_Type0(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_0_answers");
    el.setAttribute("id", "question_type_0_answers");

    for (let i = 0; i < question.answers.length; i++) {
        el.appendChild(createAnswer_Type0(question, i));
    }

    return el;
}
function createImgDiv_Type0(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_0_img");
    el.setAttribute("id", "question_type_0_img");
    
    let img = document.createElement("img");
    img.setAttribute("src", `${imgPath}/${allQuestions.indexOf(question)}.png`);
    el.appendChild(img);

    el.appendChild(createImgLoupe())

    return el;
}

function createBodyPopUp_Type1(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_1_body");
    el.setAttribute("id", "question_type_1");
    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");
    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "question_type_1_radio");
    elChB.appendChild(elChBChB);
    el.appendChild(elChB);

    elChBChB.appendChild(createAnswers_Type1(question));

    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));

    return el;
}
function createAnswer_Type1(question, i){
    let el = document.createElement("div");
    el.setAttribute("id", `question_type_1_answer_${i}`);
    let elChB = document.createElement("input");
    elChB.setAttribute("type", "checkbox");
    elChB.setAttribute("value", `${i}`);
    el.appendChild(elChB);
    let elChD = document.createElement("p");
    elChD.setAttribute("id", `question_type_1_answer_text_${i}`);
    let elChDChA = document.createTextNode(`${question.answers[i]}`);
    elChD.appendChild(elChDChA);
    el.appendChild(elChD);

    if (questionIsPassed(question)){
        elChB.setAttribute("class", "disabled_input");
        if(question.answered.includes(i, 0)) {
            elChB.checked = true;

            if (question.correctAnswer.includes(i)){
                el.style = "background-color: #bdffbd;";
            }else el.style = "background-color: #ffb9b9;";
        }
    }else{
        el.addEventListener('click', () => {
            console.log("click!");
            elChB.checked = !elChB.checked;
        });
    }

    return el;
}
function createAnswers_Type1(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_1_answers");
    el.setAttribute("id", "question_type_1_answers");

    for (let i = 0; i < question.answers.length; i++) {
        el.appendChild(createAnswer_Type1(question, i));
    }

    return el;
}

function createBodyPopUp_Type2(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_2_body");
    el.setAttribute("id", "question_type_2");
    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");
    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "question_type_2_dropdown");
    let elChBChBChB = document.createElement("div");
    elChBChBChB.setAttribute("class", "question_type_2_answers");
    elChBChBChB.setAttribute("id", "question_type_2_answers");
    let elChBChBChBChB = document.createElement("div");
    elChBChBChBChB.setAttribute("class", "place_of_custom_dropdown");

    let text = question.textDd.split('|');
    createDivsForText(text[0], elChBChBChBChB);

    for (let i = 0; i < question.answers.length; i++) {
        elChBChBChBChB.appendChild(createDropdown_Type2(question, i));
        createDivsForText(text[i+1], elChBChBChBChB);
    }
    

    elChBChBChB.appendChild(elChBChBChBChB);
    elChBChB.appendChild(elChBChBChB);
    elChB.appendChild(elChBChB);
    el.appendChild(elChB);

    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));

    return el;
}
function createDivsForText(text, target) {
    var words = text.split(" ");
    
    for (var i = 0; i < words.length; i++) {
        var div = document.createElement("div");
        div.textContent = words[i];
        target.appendChild(div);
    }
}
function createDropdown_Type2(question, i){
    let passed = questionIsPassed(question);
    let el = document.createElement("div");
    el.setAttribute("class", "custom-dropdown");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "custom-dropdown-input");
    elChB.setAttribute("id", `question_type_2_answer_${i}`);
    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "custom-dropdown-input-placeholder");

    let elChBChBChA = ":)";
    if (!passed){
        elChBChBChA = document.createTextNode("Выберите ответ");
    }else{
        elChBChBChA = document.createTextNode(`${question.answers[i][question.answered[i]]}`);
        
        if (question.correctAnswer[i] == question.answered[i]){
            elChB.style = "background-color: #bdffbd;";
        }else elChB.style = "background-color: #ffb9b9;";
    }

    elChBChB.appendChild(elChBChBChA);
    elChB.appendChild(elChBChB);
    if (!passed){
        let elChBChD = document.createElement("div");
        elChBChD.setAttribute("class", "custom-dropdown-input-icon");
        let elChBChDChB = document.createElement("img");
        elChBChDChB.setAttribute("src", "content/check-mark.png");
        elChBChDChB.setAttribute("alt", "");
        elChBChD.appendChild(elChBChDChB);
        elChB.appendChild(elChBChD);
    }

    el.appendChild(elChB);

    let elChD = document.createElement("div");
    elChD.setAttribute("class", "custom-dropdown-select closed");
    elChD.setAttribute("id", `custom-dropdown-select-${i}`);

    if (!passed){

        for (let j = 0; j < question.answers[i].length; j++) {
            elChD.appendChild(createDropdownSelect_Type2(question.answers[i], j));
        }

        el.addEventListener('click', function(e){
            elChD.classList.toggle("closed");
        });

        elChD.addEventListener('mouseup', function(e){
            text = e.target.innerHTML;
            elChBChB.innerHTML = text;
        });

    }

    el.appendChild(elChD);

    return el;
}
function createDropdownSelect_Type2(answers, j){
    let elChDChB = document.createElement("div");
    let elChDChBChA = document.createTextNode(`${answers[j]}`);
    elChDChB.appendChild(elChDChBChA);
    return elChDChB;
}

function createBodyPopUp_Type3(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_3_body");
    el.setAttribute("id", "question_type_3");

    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");

    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "question_type_3_drag_n_drop_images");

    elChBChB.appendChild(createAnswers_Type3(question));
    if (!questionIsPassed(question)) elChBChB.appendChild(createDrags_Type3(question));

    elChB.appendChild(elChBChB);
    el.appendChild(elChB);

    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));  

    return el;
}
function createAnswers_Type3(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_3_answers");
    el.setAttribute("id", "question_type_3_answers");

    for (let i = 0; i < question.answers.length ; i++){
        el.appendChild(createAnswer_Type3(question, i));
    }

    return el;
}
function createAnswer_Type3(question, i){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_3_answer");
    el.setAttribute("id", `question_type_3_answer_${i}`);
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "question_type_3_answer_img");
    let elChBChB = document.createElement("img");
    elChBChB.setAttribute("src", `${imgPath}/${allQuestions.indexOf(question)}/${[i]}.png`);
    elChBChB.setAttribute("alt", "");
    elChB.appendChild(elChBChB);
    elChB.appendChild(createImgLoupe("resize_btn_type_3"))
    el.appendChild(elChB);
    let elChD = document.createElement("div");
    elChD.setAttribute("class", "question_type_3_answer_drop_zone");
    elChD.setAttribute("id", `question_type_3_answer_drop_zone_${i}`);

    if(questionIsPassed(question)){
        elChD.setAttribute("class", "question_type_3_answer_drop_zone question_type_3_dropped");
        let text = document.createTextNode(`${question.answers[question.answered[i]]}`);
        elChD.appendChild(text);
        if (question.correctAnswer[i] == question.answered[i]){
            elChD.style = "background-color: #bdffbd;";
        }else elChD.style = "background-color: #ffb9b9;";
    }

    el.appendChild(elChD);

    return el;
}
function createDrags_Type3(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_3_drags");

    for (let i = 0; i < question.answers.length ; i++){
        el.appendChild(createDrag_Type3(question, i));
    }

    return el;
}
function createDrag_Type3(question, i){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_3_drag");
    el.setAttribute("id", `question_type_3_drag_${i}`);
    let elChA = document.createTextNode(`${question.answers[i]}`);
    el.appendChild(elChA);

    // el.addEventListener('mousedown', (e) => dragNdropHandler(e));

    return el;
}

function createBodyPopUp_Type4(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_body");
    el.setAttribute("id", "question_type_4");

    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");

    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "question_type_4_drag_n_drop_tables");

    elChBChB.appendChild(createTables_Type4(question));
    if (!questionIsPassed(question)) elChBChB.appendChild(createAnswers_Type4(question));

    elChB.appendChild(elChBChB);
    el.appendChild(elChB);

    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));

    return el;
}
function createTables_Type4(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_tables");

    
    for (let i = 0; i < question.tables.length; i++){
        el.appendChild(createTable_Type4(question, i));
        if (i != question.tables.length - 1) el.appendChild(createTableSplit_Type4());
    }
    

    return el;
}
function createTable_Type4(question, i){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_table");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "question_type_4_table_name");
    let elChBChB = document.createElement("div");
    let elChBChBChA = document.createTextNode(`${question.tables[i]}`);
    elChBChB.appendChild(elChBChBChA);
    elChB.appendChild(elChBChB);
    el.appendChild(elChB);
    let elChD = document.createElement("div");
    elChD.setAttribute("class", "question_type_4_answer_drop_zone");

    if(questionIsPassed(question)){
        for (let j = 0; j < question.answered[i].length; j++){
            
            let text = question.answers[question.answered[i][j]];
            console.log(text);

            let answ = createAnswer_Type4(text, true);

            if (question.correctAnswer[i].indexOf(question.answers.indexOf(text)) != -1){
                answ.style = "background-color: #bdffbd;";
            }else answ.style = "background-color: #ffb9b9;";

            elChD.appendChild(answ);
        }
    }

    el.appendChild(elChD);

    return el;
}
function createTableSplit_Type4(){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_table_split");
    return el;
}
function createAnswers_Type4(question) {
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_answers");

    for (let i = 0; i < question.answers.length; i++){
        el.appendChild(createAnswer_Type4(question.answers[i]));
    } 

    return el;
}
function createAnswer_Type4(text, flag = false) {
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_4_answer");
    let elChA = document.createTextNode(`${text}`);
    el.appendChild(elChA);

    // if (!flag) el.addEventListener('mousedown', (e) => dragNdropHandler(e));

    

    return el;
}


function createBodyPopUp_Type5(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_5_body");
    el.setAttribute("id", "question_type_5");
    let elChB = document.createElement("form");
    elChB.setAttribute("style", "width: 100%;");
    el.appendChild(elChB);

    elChB.appendChild(createDropDownImage_Type5(question));
    if (!questionIsPassed(question)) elChB.appendChild(createBottomPopUp(question));


    return el;
}
function createDropDownImage_Type5(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_5_dropdown_image");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "question_type_5_image");
    let elChBChB = document.createElement("img");
    elChBChB.setAttribute("src", `${imgPath}/${allQuestions.indexOf(question)}.png`);
    elChBChB.setAttribute("alt", "");
    elChB.appendChild(elChBChB);
    elChB.appendChild(createImgLoupe("resize_btn_type_5"))
    if (question.image != null) el.appendChild(elChB);

    el.appendChild(createAnswers_Type5(question));

    return el;
}
function createAnswers_Type5(question){
    let el = document.createElement("div");
    el.setAttribute("class", "question_type_5_answers");

    for (let i = 0; i < question.answers.length; i++) {
        el.appendChild(createDropdownBlock_Type5(question, i));
    }
    
    return el;
}
function createDropdownBlock_Type5(question, i){
    let passed = questionIsPassed(question);

    let el = document.createElement("div");
    el.setAttribute("class", "question_type_5_dropdown_block");

    let elChB = document.createElement("div");
    elChB.setAttribute("class", "question_type_5_dropdown_text");
    let elChBChA = document.createTextNode(`${i+1}`);
    elChB.appendChild(elChBChA);
    el.appendChild(elChB);

    let elChD = document.createElement("div");
    elChD.setAttribute("class", "question_type_5_dropdown_answer");
    elChD.setAttribute("id", `question_type_5_answer_${i}`);

    let elChDChB = document.createElement("div");
    elChDChB.setAttribute("class", "custom-dropdown-input-placeholder");
    let elChDChBChA;
    if (!passed) elChDChBChA = document.createTextNode("Выберите ответ");
    else {
        let text = `${question.answers[question.answered[i]]}`;
        elChDChBChA = document.createTextNode(text);
        if (question.correctAnswer[i] == question.answered[i]){
            elChD.style = "background-color: #bdffbd;";
        }else elChD.style = "background-color: #ffb9b9;";
    }

    elChDChB.appendChild(elChDChBChA);

    elChD.appendChild(elChDChB);

    let elChDChD = document.createElement("div");
    elChDChD.setAttribute("class", "custom-dropdown-input-icon");
    let elChDChDChA = document.createElement("img");
    elChDChDChA.setAttribute("src", "content/check-mark.png");
    elChDChDChA.setAttribute("alt", "");
    elChDChD.appendChild(elChDChDChA);
    
    elChD.appendChild(elChDChD);

    let elChDChF = document.createElement("div");
    elChDChF.setAttribute("class", "custom-dropdown-image-select closed");

    for (let j = 0; j < question.answers.length; j++) {
        let elChDChFChB = document.createElement("div");
        let elChDChFChBChA = document.createTextNode(`${question.answers[j]}`);
        
        if (!passed){
            elChDChFChB.addEventListener('mouseup', function(e){
                text = e.target.innerHTML;
                elChDChB.innerHTML = text;
                elChD.classList.remove("un_answered");
            });
        }

        elChDChFChB.appendChild(elChDChFChBChA);
        elChDChF.appendChild(elChDChFChB);
    }

    if (!passed){
        elChD.addEventListener('click', function(e){
            elChDChF.classList.toggle("closed");
        });
    }
    
    
    elChD.appendChild(elChDChF);
    el.appendChild(elChD);

    return el;

}

function createResult(){

    let precentageCorrect = Math.round((countCorrectAnswered / countAnswered) * 100);
    let precentageWrong = Math.round(((countAnswered - countCorrectAnswered) / countAnswered) * 100);
    let countQuestions = allQuestions.length;


    let el = document.createElement("div");
    el.setAttribute("class", "popup_main");
    el.setAttribute("id", "popup_main");
    let elChB = document.createElement("div");
    elChB.setAttribute("class", "popup_content");
    elChB.setAttribute("id", "popup_content");
    let elChBChB = document.createElement("div");
    elChBChB.setAttribute("class", "header_popup");
    let elChBChBChB = document.createElement("div");
    elChBChBChB.setAttribute("class", "popup_result");
    let elChBChBChBChB = document.createElement("p");
    elChBChBChBChB.setAttribute("class", "result_theme");
    let elChBChBChBChBChA = document.createTextNode(`${themeName}`);
    elChBChBChBChB.appendChild(elChBChBChBChBChA);
    elChBChBChB.appendChild(elChBChBChBChB);
    // let elChBChBChBChD = document.createElement("p");
    // elChBChBChBChD.setAttribute("class", "result_theme_short");
    // let elChBChBChBChDChA = document.createTextNode("Краткое название темы");
    // elChBChBChBChD.appendChild(elChBChBChBChDChA);
    // elChBChBChB.appendChild(elChBChBChBChD);
    elChBChB.appendChild(elChBChBChB);
    let elChBChBChD = document.createElement("div");
    elChBChBChD.setAttribute("id", "popup_close");
    elChBChBChD.setAttribute("class", "header_popup_close");

    elChBChBChD.addEventListener('click', () => popUpQuestionClose());

    let elChBChBChDChB = document.createElement("img");
    elChBChBChDChB.setAttribute("src", "./content/close.svg");
    elChBChBChDChB.setAttribute("alt", "header_popup");
    elChBChBChD.appendChild(elChBChBChDChB);
    elChBChB.appendChild(elChBChBChD);
    elChB.appendChild(elChBChB);
    let elChBChD = document.createElement("div");
    elChBChD.setAttribute("class", "questions_result");
    let elChBChDChB = document.createElement("div");
    elChBChDChB.setAttribute("class", "questions_result_all");
    let elChBChDChBChB = document.createElement("div");
    let elChBChDChBChBChA = document.createTextNode("Количество тестовых (оцениваемых) заданий:");
    elChBChDChBChB.appendChild(elChBChDChBChBChA);
    elChBChDChB.appendChild(elChBChDChBChB);
    let elChBChDChBChD = document.createElement("div");
    elChBChDChBChD.setAttribute("id", "result_count_questions");

    let elChBChDChBChDChA = document.createTextNode(`${countAnswered}`);

    elChBChDChBChD.appendChild(elChBChDChBChDChA);
    elChBChDChB.appendChild(elChBChDChBChD);
    elChBChD.appendChild(elChBChDChB);

    // Подсчет очков. Нет надобности в обычных тестах
    let elChBChDChD = document.createElement("div");
    elChBChDChD.setAttribute("class", "questions_result_correct");
    let elChBChDChDChB = document.createElement("div");
    let elChBChDChDChBChA = document.createTextNode("Ваш результат:");
    elChBChDChDChB.appendChild(elChBChDChDChBChA);
    elChBChDChD.appendChild(elChBChDChDChB);
    let elChBChDChDChD = document.createElement("div");
    elChBChDChDChD.setAttribute("id", "result_users_correct_answered");
    let elChBChDChDChDChA = document.createTextNode(`${precentageCorrect} %`);
    elChBChDChDChD.appendChild(elChBChDChDChDChA);
    elChBChDChD.appendChild(elChBChDChDChD);
    elChBChD.appendChild(elChBChDChD);
    
    let elChBChDChF = document.createElement("div");
    elChBChDChF.setAttribute("class", "questions_result_stats");
    let elChBChDChFChB = document.createElement("div");
    elChBChDChFChB.setAttribute("class", "result_correct_wrong");
    let elChBChDChFChBChB = document.createElement("div");
    elChBChDChFChBChB.setAttribute("class", "result_corrects");
    let elChBChDChFChBChBChB = document.createElement("div");
    let elChBChDChFChBChBChBChA = document.createTextNode("Количество правильных ответов:");
    elChBChDChFChBChBChB.appendChild(elChBChDChFChBChBChBChA);
    elChBChDChFChBChB.appendChild(elChBChDChFChBChBChB);
    let elChBChDChFChBChBChD = document.createElement("div");
    elChBChDChFChBChBChD.setAttribute("id", "result_corrects_num");
    let elChBChDChFChBChBChDChA = document.createTextNode(`${countCorrectAnswered}`);
    elChBChDChFChBChBChD.appendChild(elChBChDChFChBChBChDChA);
    elChBChDChFChBChB.appendChild(elChBChDChFChBChBChD);
    elChBChDChFChB.appendChild(elChBChDChFChBChB);
    
    elChBChDChF.appendChild(elChBChDChFChB);
    let elChBChDChFChD = document.createElement("div");
    elChBChDChFChD.setAttribute("class", "result_diagram");

    elChBChDChFChD.setAttribute("style", `--pCorr:${precentageCorrect};--b:10px;;`);
    // elChBChDChFChD.setAttribute("style", `--pCorr:${precentageCorrect};--pUnCorr:${precentageWrong};--b:10px;;`);

    elChBChDChF.appendChild(elChBChDChFChD);
    let elChBChDChFChF = document.createElement("div");
    elChBChDChFChF.setAttribute("class", "result_corrects");
    let elChBChDChFChFChB = document.createElement("div");
    let elChBChDChFChFChBChA = document.createTextNode("Количество неправильных ответов:");
    elChBChDChFChFChB.appendChild(elChBChDChFChFChBChA);
    elChBChDChFChF.appendChild(elChBChDChFChFChB);
    let elChBChDChFChFChD = document.createElement("div");
    elChBChDChFChFChD.setAttribute("id", "result_corrects_num");
    let elChBChDChFChFChDChA = document.createTextNode(`${countAnswered - countCorrectAnswered}`);
    elChBChDChFChFChD.appendChild(elChBChDChFChFChDChA);
    elChBChDChFChF.appendChild(elChBChDChFChFChD);
    elChBChDChF.appendChild(elChBChDChFChF);
    elChBChD.appendChild(elChBChDChF);
    elChB.appendChild(elChBChD);
    el.appendChild(elChB);

    return el;
}

function createDragNDropHandlers(question) {
    let idq = question.type;
    
    switch (idq){
        case 3:
            DnDHandlers_Type_3();
            break;
        case 4:
            DnDHandlers_Type_4();
            break;
    }
}

function DnDHandlers_Type_3(argument) {
    var row = document.getElementsByClassName('question_type_3_drags')[0];
    var countDrops = row.children.length;
    // console.log(countDrops);

    for (let i = 0; i < countDrops; i++){

        var dropZone = document.getElementById(`question_type_3_answer_drop_zone_${i}`)

        new Sortable(dropZone, {

            group: 'shared',
            animation: 150,
            onAdd: function(e){
                var itemEl = e.item;
                var targetList = e.to;
                if (targetList.children.length > 1) {

                    var existingItem;
                    if (targetList.children[0] === itemEl) {
                        existingItem = targetList.children[1];
                    } else {
                        existingItem = targetList.children[0];
                    }
                    
                    var sourceList = e.from;
                    sourceList.appendChild(existingItem);
                    targetList.appendChild(itemEl);

                    if (targetList.className != "question_type_3_answer_drop_zone") itemEl.style = "";
                    if (sourceList.className == "question_type_3_drags") existingItem.style = "";
                    
                }
            },
            onEnd: function(e) {
                if (e.to.className == "question_type_3_drags") e.item.style = "";
            }

        });
    }

    new Sortable(row, {
            
            group: {
                name: 'shared',
                put: false // Do not allow items to be put into this list
            },
            
            animation: 150,
            onEnd: function(e) {

                if (e.to.className != "question_type_3_drags" ) e.item.style = "background-color: white; color: black";
                
            }
        });
}

function DnDHandlers_Type_4(argument) {
    // body... question_type_4_answer_drop_zone
    var row = document.getElementsByClassName('question_type_4_answers')[0];
    var drops = document.getElementsByClassName('question_type_4_answer_drop_zone');
    

    for (let i = 0; i < drops.length; i++){
        var dropZone = drops[i];
        new Sortable(dropZone, {
            group: 'shared',
            animation: 150,
        });
    }

    new Sortable(row, {
        group: 'shared',
        swap: true,
        swapClass: "highlight",
        animation: 150,
    });
}