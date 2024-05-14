/////////////////////////////////////////////////
//methods are functions that we call on objects
//arraymethods are functions that we call on all arrays
//arrays are objects that get access to built-in methods
/*
let arr =['a', 'b', 'c', 'd', 'e']
console.log(arr.slice(2)); //creates a new array
console.log(arr.slice(0,2));
console.log(arr.slice(-2));
console.log(arr.slice(1, -1));
//console.log(arr.splice(2)) //does mutate the array 
console.log(arr);
let arr2 = ['j', 'i', 'h', 'g', 'f']
console.log(arr2.reverse()); //
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr,...arr2]);

//join
console.log(letters.join('-'));
*/
// for( const movement of movements){
  //     if(movement > 0){
    //         console.log(`You deposited ${movement}`);
    //     }else {console.log(`You withdrew ${Math.abs(movement)}`);
    // }}
    //enties returns array of arrays, that's how we access index of the array
    const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
    
    // movements.forEach(function(movement, index, array){
    //   //forEach passes in the current element of the array, index and the whole array
    //   //you can't break in forEach
    //   if(movement > 0){
    //     console.log(`${index+1} You deposited:  ${movement}`);
    //   }else {console.log(`${index+1} You withdrew ${Math.abs(movement)}`);
    //   }
    // });
    
    // //using MAPS
    // const currencies = new Map([
    //   ['USD', 'United States dollar'],
    //   ['EUR', 'Euro'],
    //   ['GBP', 'Pound sterling'],
    // ]);
    
    // currencies.forEach(function(value, key,map) {
    // //console.log(`${key}: ${value}`);
    // })
    
    // //WITH A SET
    // const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'Pound']);
    // currenciesUnique.forEach(function(value, key, mset){
    //   console.log(`${key}: ${value}`);
    // });
    'use strict';
    
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements= function(movements,sort = false) {

  
  containerMovements.innerHTML = '';
  
  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
  movs.forEach(function(mov, i){
  const type = mov > 0 ? 'deposit' : 'withdrawal'
  const html = `
    <div class="movements__row">
      <div class="movements__type 
        movements__type--${type}">
        ${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

 containerMovements.insertAdjacentHTML
 ('afterbegin', html)
});
};

//calculating balance
const calcPrintBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov)=> acc+mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummery = function(acc){

  const incomes= acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc+mov,0);
  labelSumIn.textContent=`${incomes}€`

  const outcomes=acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc+mov,0);
  labelSumOut.textContent=`${Math.abs(outcomes)}€`

  const interest=acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter((int)  => {
    return int >= 1;
  })
  .reduce((acc, int) => acc+int,0);
  labelSumInterest.textContent=`${interest}€`
};

//adding a username property to account
const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map((name)=> name[0])
    .join('');
  })
}
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummery(acc);
}
//Event Handler
let currentAccount;
btnLogin.addEventListener('click', function(e){
  //for not submitting a from
  e.preventDefault();
  currentAccount = accounts.find
  (acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
);
console.log(amount, recieverAcc);

if(amount > 0 && 
  recieverAcc &&
  currentAccount.balance >= amount && 
  recieverAcc?.username !== currentAccount.usrname){
    
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
}

 inputTransferAmount.value = inputTransferTo.value = '';
 inputTransferAmount.blur();
 updateUI(currentAccount);
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount =  Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => 
  mov >= amount * 0.1 )){
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value='';
});

btnClose.addEventListener('click', function(e){
e.preventDefault();
if(inputCloseUsername.value=== currentAccount.username
   && Number(inputClosePin.value) === currentAccount.pin)
   {
    const index = accounts.findIndex(acc => 
      acc.username === currentAccount.username);
     
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
}
inputCloseUsername.value = inputClosePin.value = '';
inputClosePin.blur();
});
let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;

})
const eurToUsd=1.1;

const totalDepositsUSD= movements
.filter(mov=>mov>0)
.map(mov=>Math.trunc(mov * eurToUsd))
.reduce((acc,mov)=> acc+mov,0);


console.log(totalDepositsUSD);

// const movementsDesc = movements.map(
//   (mov, i) => 
//     `Movement ${i+1}: you ${mov > 0 ? 'deposited': 
//     'withdrew'}  ${Math.abs(mov)}`
//   );

// console.log(movementsDesc);

// const deposits = movements.filter(mov => mov > 0 )
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0)
// console.log(withdrawals);

// const balance = movements.reduce((acc, curr)=> acc + curr)
// console.log(balance);

// const max=movements.reduce((acc,mov)=>acc>mov ? acc : mov
// ,movements[0])
// console.log(max);

// const fisrtWithdrawal = movements.find(mov => mov < 0)
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const accountMovements = accounts.map(acc => acc.movements)
// console.log(accountMovements.flat());
// overallBalance = accountMovements.flat().reduce((acc, mov) => acc+mov,0);
// console.log(overallBalance);

// const owners = ['john', 'nick' , 'zack' , 'miranda', 'Adam'];
// console.log(owners.sort());

// const sorted = movements.sort((a,b) => b-a)
// console.log(sorted);

//calculate the depostits

// const bankDeposits = accounts.map(acc => acc.movements).flat();
// let positiveDeposits = bankDeposits.filter(amount => amount > 0).reduce((acc, mov) => acc+mov,0);
// console.log(positiveDeposits);

// //count the depostits with at lesdt 1000
// positiveDeposits=bankDeposits.filter(amount => amount>=1000)
// console.log(positiveDeposits.length);
// //convert string to titlecase
// const convertTitleCase = function (title) {
// const captialize = str => str[0].toUpperCase() + str.slice(1);
//   const exeptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in','with'];

//   const titleCase = title
//   .toLowerCase()
//   .split(' ')
//   .map(word => (
//     exeptions.includes(word) ? word : captialize(word)))
//     .join(' ');
//   return captialize(titleCase);

// };
//   console.log(convertTitleCase('this is a nice title'));
//   console.log(convertTitleCase('this iS a LONG tITle'));
//   console.log(convertTitleCase('thIS is A nice title with an EXAMPLE'));
//   console.log(convertTitleCase('and or with an in Huge SpecACLR lSD lsdkd thIS is A nice title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as 
a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28.

 (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, 
so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with
 all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., like this: 
"Matilda and Alice and Bob's dogs eat too much!" and 
"Sarah and John and Michael's dogs eat too little!"
-------------------------------------------------------------------------------------------------------------------------------
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by 
recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, 
you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the
 recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10).
  Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map((name)=> name[0])
    .join('');
  })
}
createUsernames(accounts);

GOOD LUCK 😀
*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

// const createRecommendedFood = function(food){
//   food.forEach(function(food){
//     food.recommendedFood= Math.trunc(food.weight ** 0.75 * 28)
//   });
// }
// createRecommendedFood(dogs);
// console.log(dogs);


// dogs.forEach( dog => {
//   if(dog.owners.includes('Sarah')){
//    if(dog.curFood >dog.recommendedFood ){
//     console.log("sara's dog is eating too much")
//    }else console.log("sara's dog is eating enough")
//   }
// })

// let ownersEatTooMuch= [] ;
// let ownersEatTooLittle=[];
// dogs.forEach( dog => {
//     if(dog.curFood >dog.recommendedFood ){
//       ownersEatTooMuch=ownersEatTooMuch.concat(dog.owners);
      
//     } else ownersEatTooLittle= ownersEatTooLittle.concat(dog.owners);
   
//  })
//  const tooMuchString = ownersEatTooMuch.join(' and ') + "'s dogs eat too much!";
// console.log(tooMuchString);
// const tooLittleString = ownersEatTooLittle.join(' and ') + "'s dogs eat too little!";
// console.log(tooLittleString);
// //-------------------------------------------------------------------------------------------------------------------------------
// //5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// const EXACTLY = dogs.some(dog => dog.curFood === dog.recommendedFood);
// console.log(EXACTLY);
// //6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)

// const Okay = dog => dog.curFood > dog.recommendedFood * 0.90 && dog.curFood < dog.recommendedFood * 1.10;
// console.log(dogs.some(Okay));
// //7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

// console.log(dogs.filter(Okay));

// //8. Create a shallow copy of the dogs array and sort it by 
// //recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
// const dogsCopy = dogs.slice().sort((a,b) => a.recommendedFood-b.recommendedFood);
// console.log(dogsCopy);