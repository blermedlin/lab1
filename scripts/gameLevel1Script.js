const blurWind = document.createElement('div'); //первое окно блюра
blurWind.setAttribute('style', 'backdrop-filter: blur(15px); z-index: 1; width: 100%; height: 100%; position: absolute; top: 0%; background-color: rgba(255, 255, 255, 0.1);');
const blurWindDied = document.createElement('div'); //окно блюра если умер
blurWindDied.setAttribute('style', 'backdrop-filter: blur(15px); z-index: 1; width: 100%; height: 100%; position: absolute; top: 0%; background-color: rgba(18, 4, 31, 0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 40px;');
const blurWindWin = document.createElement('div');//окно блюра если выиграл
blurWindWin.setAttribute('style', 'backdrop-filter: blur(15px); z-index: 1; width: 100%; height: 100%; position: absolute; top: 0%; background-color: rgba(18, 4, 31, 0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 40px;');

const testBtn = document.createElement('div'); //кнопка для активации

testBtn.setAttribute('class', 'test-button'); //устанавливем готовый класс как аттрибут
const activatedAttr = document.createAttribute('data-activated');//создаем ему узел аттрибута 
activatedAttr.value = 'false';//устанавливем значение для кнопки как не активированное по умолчанию для нового свойства
testBtn.setAttributeNode(activatedAttr);//добавляем новый атрибут в кнопку
testBtn.setAttribute('style', 'position: absolute; top: 52%; left: 75%; transform: translateX(-50%); width: 30px; height: 30px; background-color: #00FFCC; border-radius: 50%; box-shadow: 0 0 15px #00FFCC; cursor: pointer; transition: 0.3s;');
//задаем стиль кнопки

let hasReachedTop = false; //флаг достижения верхней платформы (для появления кнопки)

const mapByName = document.getElementsByName('gameMap');//получаем ссылку на коллекцию дивов с именем таким 
const cont = mapByName[0]; //берем первый эелемент коллекции

function showWord(text, container) { //функция показа текста принимает текст и контейнер ждет возвращения промиса
    return new Promise((resolve) => { //конструктор промиса на удачное заверешение 
        const textNode = document.createElement('span'); //создаем текстовый элемент 
        textNode.className = 'text-Start-Animation'; //передаем ему анимацию в атрибут 
        textNode.innerText = text; //текст который будет выводиться конкретно у этого элемента
        
        container.append(textNode);//добавляем в контейнер текст с его приколами

        textNode.addEventListener('animationend', () => { //добавили обработчик на завершение анимации
            textNode.remove(); //удаляем элемент текста 
            resolve(); //успешно заврешаем промис
        })   
    });
}

const circle = document.createElement('div'); //создаем персонажа и его стиль
circle.style.display='block';
circle.style.width='35px';
circle.style.height='35px';
circle.style.backgroundColor='aliceblue';
circle.style.borderRadius='50%';
circle.style.boxShadow='0 0 15px #00FFCC';
circle.style.bottom='10%';
circle.style.position='absolute';
circle.style.top='83%';
circle.style.left='4.7%';

let isGameReady = false; //флаг того что игра идет

window.addEventListener('load', () => {//обработчик события если страница и все элементы дерева загрузилась 
    cont.prepend(blurWind); // устанавливем внутри контейнеар игровой области в самое начало
    showWord('Ready?', blurWind) // вызов функции показа текста которая возвращает промис
    .then(() => showWord('3', blurWind)) //колбек после успешного заврешения предыдущего промиса
    .then(() => showWord('2', blurWind))
    .then(() => showWord('1', blurWind))
    .then(() => { 
        blurWind.remove(); // последний промис удаляет экран из дерева
        cont.append(circle); // добавляем нашего персонажа в конец контейнера
        isGameReady = true; //флаг готовности игры меняем
    });
});
//начальные координаты персонажа
let circleX = 4.7; //по х
let circleY = 83; // по у
let velocity = 0; //скорость вертикального движения
let isJump = false; //флаг прыжка
let isGrounded = false; //флаг земли
const keys = { left: false, right: false }; //создаем объект который содержит свойства которые будут помогать управлять нажатиями клавиш

document.onkeydown = (e) => { //обработчик нажатой клавиши как свойство документа
    e.preventDefault(); //отменяем все события по умолчанию
    if (!isGameReady) return; //если игра не начата - никакого управления нет 
    
    if (e.key === ' ' || e.key === 'ArrowUp') { //для клавиш пробела и стрелки вверх
        if (!e.repeat) {   //клавиша не  срабатывает спамом
            jump(); //функцция прыкжка
        }
    }
    if (e.key === 'ArrowLeft') keys.left = true; // если стрелка влево то свойство клавиши тру  
    if (e.key === 'ArrowRight') keys.right = true;// если стрелка вправо то свойство клавиши тру  
};

document.addEventListener('keyup', (e) => { //если клавиша отжимается добавляем обработчик события 
    if (e.key === 'ArrowLeft') keys.left = false; //движение по левой стрелке остановлено
    if (e.key === 'ArrowRight') keys.right = false;//движение по правой стрелке остановлено
});

document.addEventListener('touchstart', (e) => {
    if (!isGameReady) return;
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const screenW = window.innerWidth;
    
    if (touchX < screenW * 0.3) keys.left = true;       
    else if (touchX > screenW * 0.7) keys.right = true; 
    else jump();                                         
}, { passive: false });

document.addEventListener('touchend', () => {
    keys.left = false;
    keys.right = false;
});

const platHorizont = document.querySelector('.p-float-mid');  //получаем ссылку по имени класса на платформы
const plaplatVertical = document.querySelector('.p-bottom-right');
//коориднаты для вертикальной платформы
let vTop = 62;  
let vDir = 1;  
//кординаты для горизонатальной платформы
let hLeft = 30;   
let hDir = 1;     

//на шипы ссылка
const spikes = document.querySelectorAll('.spikes-trap');
//получаем координаты для высчитывания попадения на них
//на первую группу шипов
const trapCoord1 = spikes[0].getBoundingClientRect();
const trap1bot = trapCoord1.bottom;
const trap1top = trapCoord1.top;
const trap1lf = trapCoord1.left;
const trap1rg = trapCoord1.right;
//на вторую группу шипов
const trapCoord2 = spikes[1].getBoundingClientRect();
const trap2bot = trapCoord2.bottom;
const trap2top = trapCoord2.top;
const trap2lf = trapCoord2.left;
const trap2rg = trapCoord2.right;
//коордианты платформы-батута 
const jumperPlatf = document.querySelector('.jump-platform');
const jumper = jumperPlatf.getBoundingClientRect();
const jumptop = jumper.top;
const jumplf = jumper.left;
const jumprg = jumper.right;
//координаты эелоемнта финиша
const end = document.querySelector('.end');
const windEnd = end.getBoundingClientRect();
const endbot = windEnd.bottom;
const endtop = windEnd.top;
const endlf = windEnd.left;
const endrg = windEnd.right;

setInterval(() => {//устнавливаем интервал повторения для отслеживания постоянного взаимодейсввия 
    if(!isGameReady){return;} //если игра остановлена или не начата - выход
    
    // движение платформ
    vTop += 0.3 * vDir;
    if (vTop >= 85) vDir = -1;
    if (vTop <= 62) vDir = 1;
    plaplatVertical.style.top = vTop + '%'; //движение платформы вертикально

    hLeft += 0.3 * hDir;
    if (hLeft >= 50) hDir = -1;
    if (hLeft <= 40) hDir = 1;
    platHorizont.style.left = hLeft + '%';//движение платформы горизонтальной

    // движение шарика горизонтальное
    if (keys.left && circleX > 1) circleX -= 0.5; //если клавиша левая нажата и не выохдит за край - движение шарика вправо
    if (keys.right && circleX < 95) circleX += 0.5;//аналогинчо для левого движения

    //гравитация
    if (!isGrounded) { //если не не замеле
        velocity += 0.2; //отрыв
        circleY += velocity;//движение по вертикали у персонажа
    } else {
        velocity = 0; //отрыва нет
    }

    // применение шарику движений
    circle.style.top = circleY + '%';
    circle.style.left = circleX + '%';
    isGrounded = false;

    //если находится на нижнй платформе
    if (circleY >= 83) {
        circleY = 83;//постоянная высота
        velocity = 0;//без отрыва
        isJump = false;//не прыгаем
        isGrounded = true;//земля установлена
        circle.style.top = circleY + '%';//применение к шарику
    }
    
    // координаты шарика
    let circleCoord = circle.getBoundingClientRect();

    // шипы
    let dieOnSpikes = false; //пока не умер на шипах
    if ((circleCoord.right > trap1lf) && (circleCoord.left < trap1rg) &&
        (circleCoord.bottom > trap1top) && (circleCoord.top < trap1bot)) {//попал в область группы первого шипа
        dieOnSpikes = true;//умер на шипах
    }
    if ((circleCoord.right > trap2lf) && (circleCoord.left < trap2rg) &&
        (circleCoord.bottom > trap2top) && (circleCoord.top < trap2bot)) {//попал в область группы второго шипа
        dieOnSpikes = true;//умер на шипах
    }
    
    // статические платформы
    const staticPlats = [
        { el: document.querySelector('.p-upper'),     topPercent: 32, isTop: true }, // Добавили флаг isTop
        { el: document.querySelector('.p-mid-left'),  topPercent: 62 },
        { el: document.querySelector('.p-float-right'), topPercent: 62 }
    ];//массив ссылок на платформы и их высоты

    staticPlats.forEach(plat => {//цикл по статическим платформам
        let rect = plat.el.getBoundingClientRect(); //находим коордианты первого
        let overX = (circleCoord.right > rect.left + 5 && circleCoord.left < rect.right - 5);//горизонтальные
        let overY = (circleCoord.bottom > rect.top - 15 && circleCoord.top < rect.top + 25);//вертикальные

        if (overX && overY && velocity >= 0) { //если попал на область платформы
            circleY = plat.topPercent - 6.2; 
            velocity = 0;//нет отрыва
            isJump = false;//прыжка нет
            isGrounded = true;//земля да
            circle.style.top = circleY + '%';//применение к персонажу

            //условие на появление кнопки - если на верхней платформе и не активен флаг
            if (plat.isTop && !hasReachedTop) {
                hasReachedTop = true; // достигли верха
                cont.insertBefore(testBtn, end); // добавляем кнопку на карту прямо перед концом
                showWord('get it!', cont); // Показываем текст
            }
        }
    });
    // проверяем кнопку
    if (hasReachedTop && testBtn) { //достигли высоты и кнопка есть
        let btnRect = testBtn.getBoundingClientRect();//коорды кнопки
        let hitBtn = (circleCoord.right > btnRect.left && circleCoord.left < btnRect.right &&
                      circleCoord.bottom > btnRect.top && circleCoord.top < btnRect.bottom);//коорды активации
        
        if (hitBtn && testBtn.getAttribute('data-activated') === 'false') { //если коорды достигли и активации еще нет
            const rayLeft = document.createElement('div');
            rayLeft.style.cssText = 'position:absolute; top:53.5%; left:71.5%; width:20px; height:3px; background:#00FFCC; box-shadow:0 0 10px #00FFCC;';
            const rayRight = document.createElement('div');
            rayRight.style.cssText = 'position:absolute; top:53.5%; left:77%; width:20px; height:3px; background:#00FFCC; box-shadow:0 0 10px #00FFCC;';
            //две линии
            testBtn.before(rayLeft);   // вставить ПЕРЕД кнопкой
            testBtn.after(rayRight);   // вставить ПОСЛЕ кнопки
            //получаем ссылку на узел аттриубта
            let attrNode = testBtn.getAttributeNode('data-activated');
            attrNode.value = 'true';//передаем новое значение что он активирован
            testBtn.style.backgroundColor = '#555';//накидываем стиль на кнопку
            testBtn.style.boxShadow = 'none';
            showWord('Activated!', cont); //выводим текст
        }
    }
    // .p-bottom-right
    let pVert = plaplatVertical.getBoundingClientRect();
    let overVertX = (circleCoord.right > pVert.left + 5 && circleCoord.left < pVert.right - 5);
    let overVertY = (circleCoord.bottom > pVert.top - 15 && circleCoord.top < pVert.top + 25);

    if (overVertX && overVertY && velocity >= 0) { 
        circleY = parseFloat(plaplatVertical.style.top) - 6.2; 
        velocity = 0; 
        isJump = false; 
        isGrounded = true;
        circle.style.top = circleY + '%';
    }

    // .p-float-mid
    let pHoriz = platHorizont.getBoundingClientRect();
    let overHorizX = (circleCoord.right > pHoriz.left - 5 && circleCoord.left < pHoriz.right + 5);
    let overHorizY = (circleCoord.bottom > pHoriz.top - 15 && circleCoord.top < pHoriz.top + 25);
    //чтобы не дрожал шарик на платформах при поднятии или перемещении на платформе
    if (overHorizX && overHorizY && velocity >= 0) { 
        circleY = 62 - 6.2; 
        velocity = 0;
        isJump = false;
        isGrounded = true;
        circle.style.top = circleY + '%';
        circleX += 0.3 * hDir;
        circle.style.left = circleX + '%';
    } 
    else if (overHorizX && circleCoord.bottom > pHoriz.top + 5 && circleCoord.top < pHoriz.bottom - 5) {
        if (hDir === 1) { 
            circleX = parseFloat(platHorizont.style.left) - 3.5; 
            circle.style.left = circleX + '%';
        }
        if (hDir === -1) { 
            circleX = parseFloat(platHorizont.style.left) + 14 - 3.5; 
            circle.style.left = circleX + '%';
        }
    }
    //платформа прыжка
    let overJumpX = (circleCoord.right > jumplf + 15 && circleCoord.left < jumprg - 15);
    let overJumpY = (circleCoord.bottom > jumptop - 15 && circleCoord.top < jumptop + 25);
    if (overJumpX && overJumpY && velocity >= 0) {
        isJump = true;
        isGrounded = false;
        velocity = -4; 
        circle.style.top = circleY + '%';
    }
    //ФИНИШ
    if ((circleCoord.right > endlf) && (circleCoord.left < endrg) &&
        (circleCoord.bottom > endtop) && (circleCoord.top < endbot)) {
        
        attemptFinish()//вызов функции
            .then(() => {//если достигли вместе с активацией
                cont.dispatchEvent(new CustomEvent('playerWon', { bubbles: true }));//разрешает событию всплывать от cont к родителям в DOM.
            })
            .catch(() => {//если без
                cont.dispatchEvent(new CustomEvent('playerDied'));
            });
        return;
    }
}, 16);

function jump(){//функция прыжка
    if(isJump || !isGameReady){return;}
    isJump = true;
    isGrounded = false;
    velocity = -2.5;//скорость прыжка
}

function showEndOfDie(container){//функция показа

    const textNode = document.createElement('span');

    textNode.className = 'text-Start-Animation';
    textNode.setAttribute('style', 'animation: none; position: relative; top: auto; left: auto; transform: none; font-size: 80px;');
    textNode.textContent = 'Try again?';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '100px'; 

    const again = document.createElement("button");
    const back = document.createElement("button");
    again.className = 'button-Animation';
    back.className = 'button-Animation';
    again.textContent = 'Again';
    back.textContent = 'To levels';
    
    btnContainer.append(again);
    btnContainer.append(back);

    container.append(textNode);
    container.append(btnContainer);

    again.addEventListener('click', () => {
        window.location.href = 'gameLevel1.html';
    });//обрабатыаем клик
    back.addEventListener('click', () => {
        window.location.href = 'levels.html';
    });//обрабатыаем клик
}
function showEndOfWin(container){//функция показа
    const textNode = document.createElement('span');

    textNode.className = 'text-Start-Animation';
    textNode.setAttribute('style', 'animation: none; position: relative; top: auto; left: auto; transform: none; font-size: 80px; color: #FF00FF; text-Shadow: 0 0 15px #FF00FF');
    textNode.textContent = 'Congratulations!';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '100px'; 

    const again = document.createElement("button");
    const back = document.createElement("button");
    again.className = 'button-Animation';
    back.className = 'button-Animation';
    again.textContent = 'Again';
    back.textContent = 'To levels';
    
    btnContainer.append(again);
    btnContainer.append(back);

    const playAgain = document.createElement('button');
    playAgain.className = 'button-Animation';
    playAgain.textContent = 'Play again';
    playAgain.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        window.location.href = 'gameLevel1.html';
    });
    again.replaceWith(playAgain); // ← replaceWith

    // replaceChild: заменяем кнопку "To levels" через родителя
    const goBack = document.createElement('button');
    goBack.className = 'button-Animation';
    goBack.textContent = 'Back to levels';
    goBack.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'levels.html';
    });
    btnContainer.replaceChild(goBack, back); // заменяет второй аргумент (back) на первый (goBack) внутри родителя btnContainer

    container.append(textNode);
    container.append(btnContainer);

}
function attemptFinish() { //достигли финиш
    return new Promise((resolve, reject) => { 
        if (testBtn.hasAttribute('data-activated') && testBtn.getAttribute('data-activated') === 'true') {
            resolve();//если условия выполенны получаем разрешение
        } else {
            reject();
        }
    });
}
// Ловим кастомные события
cont.addEventListener('playerWon', () => {
    isGameReady = false;
    if (testBtn.parentNode) testBtn.parentNode.removeChild(testBtn);
    cont.appendChild(blurWindWin);
    showEndOfWin(blurWindWin);
    circle.remove();
});

cont.addEventListener('playerDied', () => {
    isGameReady = false;
    circle.style.backgroundColor = 'red';
    circle.style.boxShadow = '0 0 15px red';
    cont.prepend(blurWindDied);
    showEndOfDie(blurWindDied);
    circle.remove();
});