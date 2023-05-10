//* Define variables

const category = document.getElementById("category-list");
const start_test = document.getElementById("start");
const main_quiz = document.querySelector(".main-quiz");
const question_form = document.querySelector(".question");
const end_form = document.querySelector(".end_button");
const yourscore = document.getElementById("score");
const question_number = document.getElementById("number");
const result_score = document.getElementById("current_score");
const end_button = document.getElementById("end");
const next_button = document.getElementById("next");
const inputArr = document.querySelectorAll('input[type="radio"]')

let current_score = 0;
let current_question = 1;

let question_list = [];

//* Define Functions

async function getCategories() {
    try {
        const response = await fetch("https://opentdb.com/api_category.php");
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.trivia_categories;
        } else {
            throw new Error('Request Failed!')
        }
    }
    catch (error) {
        console.log(error);
    }
}

const createCategory = async () => {
    const cateArr = await getCategories();
    return cateArr.forEach(element => {
        const option = document.createElement("option");
        option.value = element.name;
        option.innerHTML = element.name;
        category.appendChild(option);
    })
}

async function getQuestionsList() {
    const category_value = document.getElementById("category-list").value;
    const difficult_value = document.getElementById("difficult-list").value;

    const cateArr = await getCategories();
    const category_Id = cateArr.find(item => item.name === category_value)['id'];

    const url = "https://opentdb.com/api.php?amount=10&type=multiple";
    const url_category = `&category=${category_Id}`;
    const url_difficult = `&difficulty=${difficult_value.toLowerCase()}`;
    const urlToFetch = url.concat(url_category, url_difficult);

    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    return jsonResponse.results;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
};

function changeQuestion(param) {
    const answers = [param.correct_answer, ...param.incorrect_answers];
    shuffleArray(answers);
    const text = document.querySelector(".question_text");
    text.innerHTML = param.question;
    const labelArr = document.querySelectorAll('label[for*="item"]');
    for (let i = 0; i < 4; i++) {
        labelArr[i].innerHTML = answers[i];
    };   
    for (let i = 0; i < 4; i++) {
        if (answers[i] == param.correct_answer) {
            inputArr[i].value = answers[i];
            inputArr[i].classList.add('active');
        } else {
            inputArr[i].value = answers[i];
        };
        inputArr[i].checked = false;
    }
};

async function startTest() {
    main_quiz.style.display = "none";
    question_form.style.display = "flex";
    end_form.style.display = "none";
    yourscore.innerHTML = `<b>${current_score}</b>`;
    question_number.innerHTML = current_question;
    question_list = await getQuestionsList();
    changeQuestion(question_list[0]);  
}

function nextQuestion() {
    if (document.querySelector('input[type="radio"]:checked').classList.contains('active')) {
        current_score ++;
        document.getElementById("right").style.display = "block";
        document.getElementById("wrong").style.display = "none";
    } else {
        document.getElementById("right").style.display = "none";
        document.getElementById("wrong").style.display = "block";  
    };
    inputArr.forEach(element => {
        element.classList.remove('active');
    })
    current_question++;
    // const question_list = await getQuestionsList();
    changeQuestion(question_list[(current_question-1)]);
    yourscore.innerHTML = `<b>${current_score}</b>`;
    question_number.innerHTML = current_question;
};

//* Action Functions

createCategory();

start_test.onclick = startTest;

end_button.onclick = () => {
    const thankyou = document.querySelector(".thankyou");
    main_quiz.style.display = "none";
    question_form.style.display = "none";
    end_form.style.display = "flex";
    thankyou.style.display = "none";
    result_score.innerHTML = current_score;
};

next_button.onclick = () => {
    if (current_question < 9) {
        nextQuestion();
    } else if  (current_question === 9) {
        nextQuestion();
        next_button.innerHTML = "Result";
        end_button.style.display = "None";
    } else {
        if (document.querySelector('input[type="radio"]:checked').classList.contains('active')) {
            current_score ++;
        };
        const seeyou = document.querySelector(".seeyou");
        main_quiz.style.display = "none";
        question_form.style.display = "none";
        next_button.style.display = "none";
        end_form.style.display = "flex";
        seeyou.style.display = "none";
        result_score.innerHTML = current_score;
    }
};


