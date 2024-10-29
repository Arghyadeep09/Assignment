// let fruits=["apple","mango","banana","grapes","orange"];
// for (const element of fruits) {
//     console.log(element);
    
// }
// let person={
//     name: "anshu",
//     age: 21,
//     city: "bangalore",
//     state: "karnataka",
//     country: "india",
// }
// for (const element in person) {
//    if(person.hasOwnProperty(element)) { console.log(`{${element}:${person[element]}}`);
//    }
    
// }
// fruits.push("kiwi");//add element at last
// fruits.pop();// remove last element from array
// fruits.shift();// remove first element from array
// fruits.unshift("cherry");//return array length
let students = [
    { name: "Anshu", age: 15, city: "banglore", province: "whitefield" },
    { name: "Wine", age: 90, city: "kolkata", province: "salt lake" },
    { name: "Anni", age: 25, city: "bhagalpur", province: "jagdishpur" },
    { name: "rani", age: 18, city: "nagpur", province: "shivppur" }
];

for (const key in students) {
    if (students[key].age > 18) {
        console.log(`${students[key].name} is eligible`);
    }
}
