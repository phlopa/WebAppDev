//pokemon.js
import { generateLog, addLogToPage } from './logs.js';

class Selectors {
  constructor(selectorName) {
    this.elHP = document.getElementById(`life-${selectorName}`);
    this.elProgressbar = document.getElementById(`bar-${selectorName}`);
    this.elImg = document.getElementById(`img-${selectorName}`);
  }
}

class Pokemon extends Selectors {
  constructor({ name, type, hp, selectors, attacks, img }) {
    super(selectors);
    this.name = name;
    this.type = type;
    this.hp = {
      current: hp,
      total: hp,
    };
    this.attacks = attacks || [];
    this.img = img;
    this.renderHP();
  }

  renderHP() {
    this.elImg.innerHTML = `<img src=${this.img}>`;
    this.elHP.innerText = `${this.hp.current}/${this.hp.total}`;
    const percent = (this.hp.current / this.hp.total) * 100;
    this.elProgressbar.style.width = percent + '%';
    this.elProgressbar.style.background =
      percent > 60 ? 'green' : percent > 30 ? 'orange' : 'red';
  }

  changeHP(damage, enemy) {
    this.hp.current = Math.max(this.hp.current - damage, 0);
    this.renderHP();

    addLogToPage(generateLog(this, enemy, damage));

    if (this.hp.current === 0) {
      alert(`${this.name} програв!`);
    }
  }
}

export default Pokemon;

