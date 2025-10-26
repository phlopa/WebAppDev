import { random } from "./utils.js";
import { generateLog, addLogToPage } from "./logs.js";
import Pokemon from "./pokemons.js";

const $btn = document.getElementById('btn-kick');
const $btnSuper = document.getElementById('btn-super');

// --- створення покемонів ---
const character = new Pokemon({
  name: "Pikachu",
  type: "electric",
  hp: 100,
  selectors: "character"
});

const enemies = [
  new Pokemon({ name: "Charmander", type: "fire", hp: 100, selectors: "enemy1" }),
  new Pokemon({ name: "Bulbasaur", type: "grass", hp: 120, selectors: "enemy2" }),
];

// --- функція ліміту натискань ---
function createLimitedClickCounter(button, name, limit) {
  let count = 0;
  button.textContent = `${name} (${limit})`;

  function handler() {
    if (button.dataset.permaDisabled === 'true') return;
    if (count < limit) {
      count++;
      const remaining = limit - count;
      button.textContent = `${name} (${remaining})`;
    }
    if (count === limit) {
      button.textContent = `${name} (0)`;
      button.disabled = true;
      button.dataset.permaDisabled = 'true';
      button.removeEventListener('click', handler);
    }
  }

  return handler;
}

const countKick = createLimitedClickCounter($btn, 'Kick', 6);
const countSuper = createLimitedClickCounter($btnSuper, 'Super Kick', 3);
$btn.addEventListener('click', countKick);
$btnSuper.addEventListener('click', countSuper);

// --- основна логіка бою ---
function battleTurn(characterDamage, enemyDamage) {
  [$btn, $btnSuper].forEach(btn => btn.disabled = true);

  // герой атакує ворогів
  for (const enemy of enemies) {
    if (enemy.hp.current > 0) {
      const dmg = random(characterDamage);
      enemy.changeHP(dmg, character);
    }
  }

  // вороги атакують героя через 1 секунду
  setTimeout(() => {
    for (const enemy of enemies) {
      if (enemy.hp.current > 0 && character.hp.current > 0) {
        const dmg = random(enemyDamage);
        character.changeHP(dmg, enemy);
      }
    }
    const aliveEnemies = enemies.some(e => e.hp.current > 0);
    if (character.hp.current > 0 && aliveEnemies) {
      [$btn, $btnSuper].forEach(btn =>
        btn.dataset.permaDisabled !== 'true' ? (btn.disabled = false) : null
      );
    }
    checkGameOver();
  }, 1000);
}

$btn.addEventListener('click', () => battleTurn(20, 10));
$btnSuper.addEventListener('click', () => battleTurn(40, 20));

// --- перевірка кінця гри ---
function checkGameOver() {
  const allEnemiesDead = enemies.every(e => e.hp.current === 0);
  const heroDead = character.hp.current === 0;

  if (heroDead && allEnemiesDead) endGame("Гра закінчена! Герой та всі вороги загинули!");
  else if (heroDead) endGame("Гра закінчена! Герой програв!");
  else if (allEnemiesDead) endGame("Гра закінчена! Всі вороги переможені!");
}

// --- завершення гри ---
function endGame(message) {
  [$btn, $btnSuper].forEach(btn => (btn.disabled = true));
  setTimeout(() => alert(message), 300);
}
