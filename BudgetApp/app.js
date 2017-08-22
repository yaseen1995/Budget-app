
var budgetController = (function() { // This is a module


var Expense = function (id, description, value) { // function constructor

    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
};

  Expense.prototype.calcPercentage = function(totalIncome) { // This prototype function calculates the percentage

  if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);

              } else {

                this.percentage = -1;
          }
};

Expense.prototype.getPercentage = function() { // This prototype function returns the result

  return this.percentage;
};


var Income = function (id, description, value) { // function contructor

    this.id = id;
    this.description = description;
    this.value = value;
};

var calculateTotal = function(type) { // function contructor

  var sum = 0;

  data.allItems[type].forEach(function (curr) {
    sum = sum + curr.value;

  });

  data.totals[type] = sum;

}

    var data = {

      allItems: {
        exp: [],
        inc: []
     },

      totals: {
        exp: 0,
        inc: 0
     },

     budget: 0,
     percentage: -1
  };

      return {

        addItem: function(type, des, val) { // This function adds items to the stack
          var newItem, ID;

           //Create new ID
           if(data.allItems[type].length > 0) {

             ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // To get the last element
           }
           else { // if there are no items in the array
           ID = 0;
         }

           //Create new item based on 'inc' or 'exp'
          if(type === 'exp') {
            newItem = new Expense(ID, des, val);
          }

          else if (type === 'inc'){
            newItem = new Income(ID, des, val);
          }

           //Push it into the data structure
           data.allItems[type].push(newItem); // To always put a new element in array, we have to push it

           // Return the new element
           return newItem;

         },

         calculateBudget: function() {

        var inc = calculateTotal('exp'); // calculating total expenses
        var exp = calculateTotal('inc'); // calculating total income

           data.budget = data.totals.inc -  data.totals.exp;

           if(data.totals.inc > 0) {
           data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
         }

         else {
           data.percentage = -1;

         }

     },


     calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
      cur.calcPercentage(data.totals.inc);
    });
},

      getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
  },


         deleteItem: function(type, id) {

           var ids, index;


           ids = data.allItems[type].map(function (current) {
             return current.id;

           });

           index = ids.indexOf(id); // Getting the index or retreving a specific id for use. index number of the element of the array. ids is the array, (id) is the item we are looking for

           if(index !== -1) {
             data.allItems[type].splice(index, 1);

           }

       },

         getBudget: function() {
           return {

             budget: data.budget,
             percentage: data.percentage,
             totalInc: data.totals.inc,
             totalExp: data.totals.exp
           };

         },


         testData: function() {
           console.log(data);
         }

    };


})(); // IFFI - Immediatly Invoked Function Expression. Creates data privacy because it creates a new scope that is not visible from the outside scope. Variables andf functions within this are safe and cannot be accessed outside

// when you do an IFFI, it returns an object that allows access to variables anf functions after the return has occured.
//IFFI allow encapsualtion and hiding of data.


var UIController = (function() { // This is a module

  var DOMstrings = { // creating an object to store multiple data

    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    expensesContainer: '.expenses__list',
    incomeContainer: '.income__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    displayMonth: '.budget__title--month'
  };

  formatNumber = function(num,type){
            var numSplit,int,dec,len,numOfComa;

            num = Math.abs(num);

            num = num.toFixed(2);

            numSplit = num.split('.');
            int = numSplit[0];

            len = int.length; // Length of the string e.g 54346 = 5 digits
            console.log('len is:'+ len);
            if(len > 3){
                if (len % 3 === 0){ // 9 mod 3 = 0
                    numOfComa = Math.floor(len / 3) -1; // 9 / 3 = 3 -1 = 2
                }
                else{
                    numOfComa = Math.floor(len / 3);
                }

                for (var i = 1; i <= numOfComa; i++){
                    int = int.substr(0, len-(3 * i)) + ',' + int.substr(len - (3 * i));

                }
            }
            dec = numSplit[1];

            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };

        var nodeListForEach = function(list, callback) {
          for(var i = 0; i < list.length; i++ ) {
            callback(list[i], i);
          }
        };


    return {
      getInput: function() { // Diffrence between this function and the above, this actually retrieves the data from HTML input
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) { // obj are the three fields from the contructor, which created objects. This adds the relavnt html to the browser and saves it

      var html, newHtml, element;

      if(type === 'inc') {
                element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                  }

      else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                }


      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // inserts HTML to the browser

  },


    deleteListItem: function (selectorID) {

      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {

      var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

      var fieldsArr = Array.prototype.slice.call(fields); // clears it using Array functions

      fieldsArr.forEach(function(current, index, array){
        current.value = ""; // value in this case is a forech loop method
      });

      fieldsArr[0].focus(); // goes back to the first field of the array upon clearFields
    },

    displayBudget: function(obj) {

      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent =  formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent =  formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


        if(obj.budget > 0) {

        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';

      }


      // these are all accessed in the app controller module, where the objects created in the getBudget() function will be passed through
    },

    displayPercentages: function (percentages) {

      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {

        if(percentages[index] > 0) {

          current.textContent = percentages[index] + '%';
        }

        else {
          current.textContent = '---';
        }
    });

    },

    displayMonth: function() {
      var now, year, month, months;

      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      month = now.getMonth();

      year = now.getFullYear();


     document.querySelector(DOMstrings.displayMonth).textContent = months[month] + " " + year;

   },

    changeType: function() {

      var fields = document.querySelectorAll(DOMstrings.inputValue + ","
      + DOMstrings.inputDescription + "," + DOMstrings.inputType);

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },

    getDomStrings: function() {

      return DOMstrings;
    }

  };

})();

//UIcontroller.getDomStrings(); - Thats how you call closure functions outside of its scope.

var controller = (function(budgetCtrl, UICtrl) { // This is a module

var setUpEventListeners = function() {

  var DOM = UICtrl.getDomStrings();

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);  //For the click on the mouse.
  document.addEventListener('keypress', function(event) {  //For the key press. If it is clicked, it activates the ctrlAddItem function

    if(event.keycode === 13 || event.which === 13){

      event.preventDefault(); // This removes the oginally triggered event that was called upon first e.g click
      ctrlAddItem(); // We are calling this in the closure

        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); // The function will fire the ctrDeleteItem. This is part of the setUpEventListeners() function which is triggered on the return

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
  };

  var updateBudget = function() {

    budgetCtrl.calculateBudget(); // WHat the total budget will be

    var budget = budgetCtrl.getBudget();
    // Getting the budget i.e the objects that we created such as:
    //budget: data.budget,
    //percentage: data.percentage,
    //totalInc: data.totals.inc,
    // And passing them in the displayBudget function

    UICtrl.displayBudget(budget);

  };

  var updatePercentages = function() {

    budgetCtrl.calculatePercentages();

    var percentages = budgetCtrl.getPercentages();


    UICtrl.displayPercentages(percentages);



  };

    var ctrlAddItem = function() {
      var input, newItem;

      input = UICtrl.getInput();

      if(input.description !== "" && !isNaN(input.value) && input.value > 0) { // validating the fields
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      console.log(newItem);

      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      updateBudget();

      updatePercentages();

    }

    else {

      UICtrl.clearFields();

    }

    };

    var ctrlDeleteItem = function(event) {

      var itemID, splitID, type, ID;

       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id // This has the full ID name from html

      if(itemID) {

    splitID = itemID.split('-');
    type = splitID[0];
    ID = parseInt(splitID[1]);

    }

    budgetCtrl.deleteItem(type, ID);

    UICtrl.deleteListItem(itemID);

    updateBudget();

    updatePercentages();

  };




    return {
      init: function() {
        console.log("Application has started");
        UICtrl.displayMonth();
        UICtrl.displayBudget({ // This is allowed because we have saved type obj to be:
          budget: 0,           // obj.budget
          percentage: -1,      // obj.percentage
          totalInc: 0,         // obj.totalInc
          totalExp: 0          // obj.totalExp
        });                    // Which allows us to access these object

        setUpEventListeners();
      }
  };

})(budgetController, UIController);

controller.init();

budgetController.testData();
