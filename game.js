const $btn = document.getElementById('btn-kick');
const $btnSuper = document.getElementById('btn-super');
const $logs = document.getElementById('logs'); // ← контейнер для логів

const random = num => Math.ceil(Math.random() * num);

function createLimitedClickCounter(buttonElement, buttonName, limit = 6) {
  let count = 0;
  buttonElement.textContent = `${buttonName} (${limit})`;
  function handler() {
    // додаткова захистна перевірка (якщо вже видалили — нічого не робимо)
    if (buttonElement.dataset.permaDisabled === 'true') return;

    if (count < limit) {
      count++;
      const remaining = limit - count;
      console.log(`Кнопка "${buttonName}" натиснута ${count} раз(и). Залишилось ${remaining}.`);
      buttonElement.textContent = `${buttonName} (${remaining})`;
    }

    if (count === limit) {
      console.log(`⚠ Межа натискань для "${buttonName}" досягнута (${limit}).`);
      buttonElement.textContent = `${buttonName} (0)`;
      // зробимо кнопку візуально вимкненою
      buttonElement.disabled = true;
      // позначимо, що її вже не можна більше вмикати
      buttonElement.dataset.permaDisabled = 'true';
      // видаляємо обробник — кнопка більше не реагуватиме навіть якщо її "уберуть" disabled=false
      buttonElement.removeEventListener('click', handler);
    }
  }

  return handler;
}

// ПРИКЛАД ПРИВ'ЯЗКИ:
const countKick = createLimitedClickCounter($btn, 'Kick', 6);
const countSuper = createLimitedClickCounter($btnSuper, 'Super Kick', 3);

$btn.addEventListener('click', countKick);
$btnSuper.addEventListener('click', countSuper);


// --- ФУНКЦІЯ ЛОГУ ---
function generateLog(firstPerson, secondPerson, damage) {
  const logs = [
    `${firstPerson.name} згадав щось важливе, але раптом ${secondPerson.name}, не тямлячи себе від переляку, вдарив у передпліччя ворога.`,
    `${firstPerson.name} вдавився, і за це ${secondPerson.name} зі страху приклав прямий удар коліном у лоб ворога.`,
    `${firstPerson.name} задумався, але в цей час нахабний ${secondPerson.name}, прийнявши вольове рішення, нечутно підійшов ззаду й ударив.`,
    `${firstPerson.name} отямився, але несподівано ${secondPerson.name} випадково наніс потужний удар.`,
    `${firstPerson.name} вдавився, але в цей момент ${secondPerson.name} нехотячи розтрощив кулаком <вилучено цензурою> противника.`,
    `${firstPerson.name} здивувався, а ${secondPerson.name}, похитнувшись, завдав підлого удару.`,
    `${firstPerson.name} висякався, але раптом ${secondPerson.name} провів дробильний удар.`,
    `${firstPerson.name} похитнувся, і раптом нахабний ${secondPerson.name} без причини вдарив у ногу противника.`,
    `${firstPerson.name} засмутився, як раптом несподівано ${secondPerson.name} випадково вліпив ногою в живіт супернику.`,
    `${firstPerson.name} намагався щось сказати, але раптом несподівано ${secondPerson.name} від нудьги розбив брову супернику.`
  ];

  const text = logs[random(logs.length) - 1];
  return `${text} Втрати: ${damage}. HP ${firstPerson.name}: ${firstPerson.damageHP}/${firstPerson.defaultHP}.`;
}

// --- ФУНКЦІЯ ВИВЕДЕННЯ ЛОГУ ---
function addLogToPage(text) {
  const $p = document.createElement('p');
  $p.innerText = text;
  $logs.insertBefore($p, $logs.children[0]); // додає новий лог зверху
}

// --- ГЕРОЙ ---
const character = {
  name: 'Pikachu',
  defaultHP: 100,
  damageHP: 100,
  elHP: document.getElementById('life-character'),
  elProgressbar: document.getElementById('bar-character'),

  renderHP() {
    const { damageHP, defaultHP } = this;
    this.elHP.innerText = `${damageHP}/${defaultHP}`;
    this.renderProgressbarHP();
  },

  renderProgressbarHP() {
    const { elProgressbar, damageHP, defaultHP } = this;
    const percent = (damageHP / defaultHP) * 100;
    elProgressbar.style.width = `${percent}%`;
    elProgressbar.style.background =
      percent > 60 ? 'green' :
      percent > 30 ? 'orange' : 'red';
  },

  changeHP(count, attacker) {
    const { name, damageHP } = this;
    if (damageHP === 0) return;

    const actualDamage = Math.min(count, this.damageHP);
    this.damageHP -= actualDamage;
    this.renderHP();

    const log = generateLog(this, attacker, actualDamage);
    console.log(log);
    addLogToPage(log); // ← додаємо лог у div

    if (this.damageHP === 0) {
      console.log(`${name} загинув!`);
      alert(`${name} загинув!`);
    }

    checkGameOver();
  }
};

// --- ВОРОГИ ---
const enemies = [
  { name: 'Charmander', defaultHP: 100, damageHP: 100, elHP: document.getElementById('life-enemy1'), elProgressbar: document.getElementById('bar-enemy1') },
  { name: 'Bulbasaur', defaultHP: 120, damageHP: 120, elHP: document.getElementById('life-enemy2'), elProgressbar: document.getElementById('bar-enemy2') }
].map(enemy => ({
  ...enemy,
  renderHP: character.renderHP,
  renderProgressbarHP: character.renderProgressbarHP,
  changeHP: character.changeHP
}));

// --- ЛОГІКА БОЮ ---
$btn.addEventListener('click', () => battleTurn(20, 10));
$btnSuper.addEventListener('click', () => battleTurn(40, 20));

function battleTurn(characterDamage, enemyDamage) {
  [$btn, $btnSuper].forEach(btn => btn.disabled = true);

  // Герой атакує ворогів
  for (const enemy of enemies) {
    if (enemy.damageHP > 0) {
      const dmg = random(characterDamage);
      enemy.changeHP(dmg, character);
    }
  }

  // Через секунду вороги атакують героя
  setTimeout(() => {
    for (const enemy of enemies) {
      if (enemy.damageHP > 0 && character.damageHP > 0) {
        const dmg = random(enemyDamage);
        character.changeHP(dmg, enemy);
      }
    }

    const aliveEnemies = enemies.some(({ damageHP }) => damageHP > 0);
    if (character.damageHP > 0 && aliveEnemies) {
      [$btn, $btnSuper].forEach(btn => (btn.dataset.permaDisabled !== 'true')?btn.disabled = false:btn.disabled = true);
    }
  }, 1000);
}

// --- ПЕРЕВІРКА КІНЦЯ ГРИ ---
function checkGameOver() {
  const allEnemiesDead = enemies.every(({ damageHP }) => damageHP === 0);
  const heroDead = character.damageHP === 0;

  if (heroDead && allEnemiesDead) {
    endGame('Гра закінчена! Герой та всі вороги загинули!');
  } else if (heroDead) {
    endGame('Гра закінчена! Герой програв!');
  } else if (allEnemiesDead) {
    endGame('Гра закінчена! Всі вороги переможені!');
  }
}

// --- ЗАВЕРШЕННЯ ГРИ ---
function endGame(message) {
  [$btn, $btnSuper].forEach(btn => btn.disabled = true);
  setTimeout(() => alert(message), 300);
}

// --- ІНІЦІАЛІЗАЦІЯ ---
function init() {
  character.renderHP();
  enemies.forEach(enemy => enemy.renderHP());
}
init();
