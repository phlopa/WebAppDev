const $btn = document.getElementById('btn-kick');
const $btnSuper = document.getElementById('btn-super');

function random(num) {
  return Math.ceil(Math.random() * num);
}

const character = {
  name: 'Pikachu',
  defaultHP: 100,
  damageHP: 100,
  elHP: document.getElementById('life-character'),
  elProgressbar: document.getElementById('bar-character'),

  renderHP() {
    this.renderHPLife();
    this.renderProgressbarHP();
  },

  renderHPLife() {
    this.elHP.innerText = this.damageHP + '/' + this.defaultHP;
  },

  renderProgressbarHP() {
    const percent = (this.damageHP / this.defaultHP) * 100;
    this.elProgressbar.style.width = percent + '%';

    if (percent > 60) {
      this.elProgressbar.style.background = 'green';
    } else if (percent > 30) {
      this.elProgressbar.style.background = 'orange';
    } else {
      this.elProgressbar.style.background = 'red';
    }
  },

  changeHP(count) {
    if (this.damageHP === 0) return;

    if (this.damageHP <= count) {
      this.damageHP = 0;
      this.renderHP();
      console.log(`${this.name} загинув!`);
      alert(`${this.name} загинув!`);
    } else {
      this.damageHP -= count;
      this.renderHP();
    }

    // Перевіряємо стан гри після оновлення HP
    checkGameOver();
  }
};

const enemies = [
  {
    name: 'Charmander',
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById('life-enemy1'),
    elProgressbar: document.getElementById('bar-enemy1'),

    renderHP: character.renderHP,
    renderHPLife: character.renderHPLife,
    renderProgressbarHP: character.renderProgressbarHP,
    changeHP: character.changeHP,
  },
  {
    name: 'Bulbasaur',
    defaultHP: 120,
    damageHP: 120,
    elHP: document.getElementById('life-enemy2'),
    elProgressbar: document.getElementById('bar-enemy2'),

    renderHP: character.renderHP,
    renderHPLife: character.renderHPLife,
    renderProgressbarHP: character.renderProgressbarHP,
    changeHP: character.changeHP,
  }
];

// --- Логіка бою ---
$btn.addEventListener('click', () => battleTurn(20, 10));
$btnSuper.addEventListener('click', () => battleTurn(40, 20));

function battleTurn(characterDamage, enemyDamage) {
  $btn.disabled = true;
  $btnSuper.disabled = true;

  // Герой атакує всіх живих ворогів
  enemies.forEach(enemy => enemy.changeHP(random(characterDamage)));

  // Через секунду вороги атакують героя
  setTimeout(() => {
    enemies.forEach(enemy => {
      if (enemy.damageHP > 0 && character.damageHP > 0) {
        character.changeHP(random(enemyDamage));
      }
    });

    if (character.damageHP > 0 && enemies.some(enemy => enemy.damageHP > 0)) {
      $btn.disabled = false;
      $btnSuper.disabled = false;
    }
  }, 1000);
}

// --- Перевірка кінця гри ---
function checkGameOver() {
  const allEnemiesDead = enemies.every(enemy => enemy.damageHP === 0);
  const heroDead = character.damageHP === 0;

  if (heroDead && allEnemiesDead) {
    endGame('Гра закінчена! Герой та всі вороги загинули!');
  } else if (heroDead) {
    endGame('Гра закінчена! Герой програв!');
  } else if (allEnemiesDead) {
    endGame('Гра закінчена! Всі вороги переможені!');
  }
}

// --- Функція завершення гри ---
function endGame(message) {
  $btn.disabled = true;
  $btnSuper.disabled = true;
  setTimeout(() => alert(message), 200);
}

// --- Ініціалізація ---
function init() {
  character.renderHP();
  enemies.forEach(enemy => enemy.renderHP());
}

init();
