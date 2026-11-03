const levels = document.querySelectorAll(".level"); //получили ссылки на каждый квадратик уровня
const curs = document.getElementById("cursor-circle"); //получили ссылку на див с курсором который пока не виден
let i = 1; //счетчик уровней

levels.forEach(level => {//для каждого квадратика задаем цикл 
    
    level.style.color = 'transparent'; //текст квадратика не видно

    //для каждого квадратка событие - наведение курсора
    level.addEventListener('mouseenter', (e) => {
        curs.style.display = 'block'; //у курсора появялется форма 
        const target = e.target; //получаем ссылку того на что навели а не дальше по дереву - т.е квадрат сам

        if (target.textContent === "") { //если пустой квадратик 
            target.textContent = `${i}`; //у него есть свой номер теперь 
            i++;//увеличиваем счетчик глобально
        }

        if (target.textContent === "1") {//если это первый уровень
            target.dataset.href = "./gamelevel1.html"; // кладем в данные а именно в ссылку значение - ссылка на уровень
            target.style.backgroundColor = 'yellow'; // квадратик теперь желтый
            target.style.boxShadow = '0 0 15px yellow'; //светится
            target.style.color = 'black'; // цвет текста черный
        } else {//даже если не первый но цифра теперь есть у квадрата то цвет текста виден
            target.style.color = 'black'; // тоже черная
        }
    });

    //курсор двигается по квадратику
    level.addEventListener('mousemove', (e) => {
        curs.style.left = `${e.clientX}px`; //центрирование относительно указателя курсора по x
        curs.style.top = `${e.clientY}px`;// по y соответственно 
    });

    //курсор сходит с квадрата
    level.addEventListener('mouseleave', (e) => {
        curs.style.display = 'none'; // курсор без формы
        const target = e.target; // получаем ссылку на квадратик
        
        target.style.color = 'transparent'; // прячем его текст (уровень)
        target.style.backgroundColor = 'aliceblue'; // цвет как заливка квадратика - не видно текст
    });

    //кликаем 
    level.addEventListener('click', (e) => {
        e.preventDefault(); // отменяем стандартное поведение
        
        const clickedLevel = e.target.closest('.level'); //находим то на что кликали (квадратик а не текст)
        
        if (clickedLevel.dataset.href) {//есть ссылка в квадратике
            window.location.href = clickedLevel.dataset.href;//текущая ссылка веб страницы становится новым уровнем 
        } else {
            alert("Этот уровень еще в разработке!"); // уровень только 1 на остальные предупреждение без фантазии
        }
    });
});