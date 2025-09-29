const $btn = document.getElementById('btn-kick');
const $btnSuper = document.getElementById('btn-super');

const character = {
  name: 'Pikachu',
  defaultHP: 100,
  damageHP: 100,
  elHP: document.getElementById('life-character'),
  elProgressbar: document.getElementById('bar-character'),
};

const enemies = [
  {
    name: 'Charmander',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('life-enemy1'),
    elProgressbar: document.getElementById('bar-enemy1'),
  },
  {
    name: 'Bulbasaur',
    defaultHP: 120,
    damageHP: 120,
    elHP: document.getElementById('life-enemy2'),
    elProgressbar: document.getElementById('bar-enemy2'),
  }
];

function random(num) {
  return Math.ceil(Math.random() * num);
}

// Обробка кліку Kick
$btn.addEventListener('click', () => battleTurn(20, 5));

// Обробка кліку Super Kick
$btnSuper.addEventListener('click', () => battleTurn(40, 15));

// Функція одного ходу бою
function battleTurn(characterDamage, enemyDamage) {
  // Блокуємо кнопки поки йде хід
  $btn.disabled = true;
  $btnSuper.disabled = true;

  // Атака героя всіх живих ворогів
  enemies.forEach(enemy => changeHP(random(characterDamage), enemy));

  // Через 1 секунду атака ворогів героя
  setTimeout(() => {
    enemies.forEach(enemy => {
      if (enemy.damageHP > 0 && character.damageHP > 0) {
        changeHP(random(enemyDamage), character);
      }
    });

    // Розблокуємо кнопки, якщо гра ще не закінчена
    if (character.damageHP > 0 && enemies.some(enemy => enemy.damageHP > 0)) {
      $btn.disabled = false;
      $btnSuper.disabled = false;
    }
  }, 1000);
}

function renderHP(person) {
  renderHPLife(person);
  renderProgressbarHP(person);
}

function renderHPLife(person) {
  person.elHP.innerText = person.damageHP + '/' + person.defaultHP;
}

function renderProgressbarHP(person) {
  const percent = (person.damageHP / person.defaultHP) * 100;
  person.elProgressbar.style.width = percent + '%';

  if (percent > 60) {
    person.elProgressbar.style.background = 'green';
  } else if (percent > 30) {
    person.elProgressbar.style.background = 'orange';
  } else {
    person.elProgressbar.style.background = 'red';
  }
}

function changeHP(count, person) {
  if (person.damageHP === 0) return; // вже мертвий, нічого не робимо

  if (person.damageHP <= count) {
    person.damageHP = 0;
    renderHP(person);
    console.log(person.name + ' програв бій!');
  } else {
    person.damageHP -= count;
    renderHP(person);
  }

  // Перевірка на кінець гри
  const allEnemiesDead = enemies.every(enemy => enemy.damageHP === 0);

  if (character.damageHP === 0 || allEnemiesDead) {
    $btn.disabled = true;
    $btnSuper.disabled = true;

    if (character.damageHP === 0 && allEnemiesDead) {
      alert('Гра закінчена! Герой та всі вороги програли!');
    } else if (character.damageHP === 0) {
      alert('Гра закінчена! Герой програв!');
    } else {
      alert('Гра закінчена! Всі вороги програли!');
    }
  }
}

// Ініціалізація
function init() {
  renderHP(character);
  enemies.forEach(renderHP);
}

init();
