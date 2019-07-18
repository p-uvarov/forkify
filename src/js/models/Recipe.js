import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() { 
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            const recipe = result.data.recipe;
            
            this.title = recipe.title;
            this.author = recipe.publisher;
            this.imageURL = recipe.image_url;
            this.url = recipe.source_url;
            this.ingredients = recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    calcTime() {
        //Assuming that for each 3 ingredients we will need 15 minutes of cooking time
        const numberPeriods = Math.ceil(this.ingredients.length / 3);
        this.time = numberPeriods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        let newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();

            //Replace long units to short units
            const longUnits = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'cups', 'ounces', 'ounce', 'pounds', 'packages', 'lbs'];
            const shortUnits = ['tbsp', 'tbsp', 'tsp', 'tsp', 'cup', 'oz', 'oz', 'pound', 'pckg', 'lb'];
            const units = [...shortUnits, 'kg', 'g'];

            ingredient = ingredient.replace(',', ' ')

            longUnits.forEach((longUnit, index) => {
                ingredient = ingredient.replace(longUnit, shortUnits[index]);
            })

            //Delete parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Split ingredient to amount, unit and name of ingredient
            const ingredientArray = ingredient.split(' ');

            //Find in what position in the string is short unit word
            const unitIndex = ingredientArray.findIndex(el => units.includes(el));
            let ingredientObject;

            if (unitIndex > -1) {
                let isElWasString = false;

                const countArray = ingredientArray.map(el1 => {
                    try {
                        eval(el1);
                    } catch (error) {
                        isElWasString = true;
                        return 0;
                    }

                    if (!isElWasString) {
                      const regex = /^([0-9]*\.?[0-9]*\/?[0-9]*\.?[0-9]*|\+|\-)$/g; // 1, 1/2, - or +

                      //If element is like 1-2 cup or 3-4 cups we need averadge like 1.5 cup or 3.5 cups
                      let minusNum = 0;
                      const doubleElArray = el1.split("-");

                      //If in the array has more than one element and first element of the array is less than second element (like 3-4 cups and not 1-1/2 cups)
                      const isFirstElLessThanSecond = () => {
                          try {
                              const firstEl = eval(doubleElArray[0]);
                              const secondEl = eval(doubleElArray[1]);
                              if (firstEl < secondEl) {
                                return true;
                              }
                              else {
                                el1 = firstEl + secondEl;
                                return false;
                              }
                          } catch (error) {
                              return false;
                          }
                      }
                      if (doubleElArray.length > 1 && isFirstElLessThanSecond()) {
                        el1 = doubleElArray.reduce((total, num) => {
                              try {
                                return total = total + eval(num);
                              } catch (error) {
                                minusNum += 1;
                              }
                            }, 0) / (doubleElArray.length - minusNum);
                      }

                      //Convert from string to a number
                      const evalEl = eval(el1);

                      if (`${evalEl}`.match(regex)) {
                        return evalEl;
                      } else {
                        isElWasString = true;
                        return 0;
                      }
                    } 
                    else {
                        return 0;
                    }                   
                })
                
                const count = countArray.reduce((total, num) => {
                    if (parseFloat(num)) {
                        return total + parseFloat(num);
                    }
                    else {
                        return total
                    }
                }, 0);

                ingredientObject = {
                    count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                }
            }
            else if (parseInt(ingredientArray[0])) {
                const countStr = ingredientArray[0].replace('-', '+');
                const count = eval(countStr);

                ingredientObject = {
                    count,
                    unit: '',
                    ingredient: ingredientArray.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                ingredientObject = {
                    count: '',
                    unit: '',
                    ingredient:  ingredientArray.join(' ')
                }
            }


            //Return changed value if it is not empty
            if (ingredientObject.ingredient !== ' ') {
                return ingredientObject;
            }
        });

        //Delete all undefined or null elements from array
        newIngredients = newIngredients.filter(el => el);

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Update servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Update ingredients
        this.ingredients.forEach((el, i) => {
            el.count = el.count * (newServings / this.servings);
            this.ingredients[i].count = el.count;
        });
        this.servings = newServings;
    }
};