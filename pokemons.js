// pokemon.js
import { generateLog, addLogToPage } from "./logs.js";

class Selectors {
  constructor(selectorName) {
    this.elHP = document.getElementById(`life-${selectorName}`);
    this.elProgressbar = document.getElementById(`bar-${selectorName}`);
  }
}

class Pokemon extends Selectors {
  constructor({ name, type, hp, selectors }) {
    super(selectors);
    this.name = name;
    this.type = type;
    this.hp = { current: hp, total: hp };
    this.renderHP();
  }

  // --- відмалювання HP ---
  renderHP = () => {
    this.renderHPLife();
    this.renderProgressbarHP();
  };

  renderHPLife = () => {
    const { elHP, hp: { current, total } } = this;
    elHP.innerText = `${current}/${total}`;
  };

  renderProgressbarHP = () => {
    const { elProgressbar, hp: { current, total } } = this;
    const percent = (current / total) * 100;
    elProgressbar.style.width = percent + "%";
    elProgressbar.style.background =
      percent > 60 ? "green" : percent > 30 ? "orange" : "red";
  };

  // --- зміна HP ---
  changeHP = (count, enemy, cb) => {
    if (this.hp.current === 0) return;

    const actualDamage = Math.min(count, this.hp.current);
    this.hp.current -= actualDamage;
    this.renderHP();

    const logText = generateLog(this, enemy, actualDamage);
    addLogToPage(logText);

    if (cb) cb(actualDamage);

    if (this.hp.current === 0) {
      alert(`${this.name} загинув!`);
    }
  };
}

export default Pokemon;
