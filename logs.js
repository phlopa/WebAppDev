// logs.js
import { random } from "./utils.js";

const $logs = document.getElementById("logs");

export function generateLog(firstPerson, secondPerson, damage) {
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
    `${firstPerson.name} намагався щось сказати, але раптом несподівано ${secondPerson.name} від нудьги розбив брову супернику.`,
  ];

  const text = logs[random(logs.length) - 1];
  return `${text} Втрати: ${damage}. HP ${firstPerson.name}: ${firstPerson.hp.current}/${firstPerson.hp.total}.`;
}

export function addLogToPage(text) {
  const $p = document.createElement("p");
  $p.innerText = text;
  $logs.insertBefore($p, $logs.children[0]); // новий лог зверху
}
