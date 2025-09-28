const firstRow = prompt('Enter first row:');//'Slow and steady wins the race';
const secondRow = prompt('Enter second row:');//'You can say that again';
const ch = prompt('Enter a char:');
function count(row, ch){
    let counter = 0;
    for (let i =0; i < row.length; i++){
        if (row.charAt(i).toLowerCase() === ch){
            counter++;
        }
    }
    return counter;
}
function getRow(firstRow, secondRow, ch) {
    if(count(firstRow, ch)>count(secondRow, ch)){
        return firstRow;
    }else{
        return secondRow;
    }
}
//console.log(getRow(firstRow, secondRow, ch)); //'You can say that again'
alert("Row with the bigger number of '"+ch+"': "+ getRow(firstRow, secondRow, ch));

const phone=prompt('Enter phone:')//'+380664567890';
function formattedPhone(phone) {
    let digits = phone.replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("380")) {
    // формат +380XXXXXXXXX
        digits = digits;
    } else if (digits.length === 11 && digits.startsWith("80")) {
    // формат 80XXXXXXXXX
        digits = "3" + digits; // додаємо 3 → 380XXXXXXXXX
    } else if (digits.length === 10 && digits.startsWith("0")) {
    // формат 0XXXXXXXXX
        digits = "38" + digits; // додаємо 38 → 380XXXXXXXXX
    } else {
        return "Wrong number format!";
    }

    const country = "+38";
    const operator = digits.substring(2, 5); // код оператора
    const part1 = digits.substring(5, 8); // перші 3
    const part2 = digits.substring(8, 10); // наступні 2
    const part3 = digits.substring(10, 12); // останні 2
    return `${country} (${operator}) ${part1}-${part2}-${part3}`;
}
/*
console.log(formattedPhone('+80664567890')); // +38 (066) 456-78-90
console.log(formattedPhone("+380664567890")); // +38 (066) 456-78-90
console.log(formattedPhone("80664567890"));   // +38 (066) 456-78-90
console.log(formattedPhone("0671234567"));    // +38 (067) 123-45-67
console.log(formattedPhone("123456"));        // Неправильний формат номера!*/

alert("Your number: "+ formattedPhone(phone));