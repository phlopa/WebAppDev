//game.js
import Pokemon from './pokemons.js';
import { pokemons } from './pokemons_data.js';
import { random } from './utils.js';

const $attacks = document.getElementById('attacks');

// 🔹 знаходимо Пікачу
const pikachuData = pokemons.find(p => p.name === 'Pikachu');

const charmanderData = pokemons.find(p => p.name === 'Charmander');

// 🔹 створюємо гравців
const player1 = new Pokemon({
  ...pikachuData,
  selectors: 'player1',
});

const player2 = new Pokemon({
  //name: 'Charmander',
  //type: 'fire',
  //hp: 100,
  ...charmanderData,
  selectors: 'player2',
});

const enemyAttacks = player2.attacks.map(a => ({
  ...a,
  count: a.maxCount,
}));

// 🔥 ДИНАМІЧНЕ СТВОРЕННЯ КНОПОК АТАК
player1.attacks.forEach(attack => {
  const button = document.createElement('button');
  let count = attack.maxCount;

  button.textContent = `${attack.name} (${count})`;

  button.addEventListener('click', () => {
    if (count === 0 || player2.hp.current === 0) return;

    count--;
    button.textContent = `${attack.name} (${count})`;

    const damage =
      random(attack.maxDamage - attack.minDamage + 1) +
      attack.minDamage - 1;

    player2.changeHP(damage, player1);

    // відповідь ворога
    if (player2.hp.current > 0) {
      setTimeout(() => {
        const availableAttacks = enemyAttacks.filter(a => a.count > 0);
        if (availableAttacks.length === 0) return;

        const enemyAttack =
          availableAttacks[random(availableAttacks.length) - 1];

        enemyAttack.count--;

        const enemyDamage =
          random(enemyAttack.maxDamage - enemyAttack.minDamage + 1) +
          enemyAttack.minDamage - 1;

        player1.changeHP(enemyDamage, player2);
      }, 500);
    }

    if (count === 0) {
      button.disabled = true;
    }
  });

  $attacks.appendChild(button);
});
