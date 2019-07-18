// Global app controller

import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, spinerLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';

//Global state of the app
const state = {};

//MARK: - Search Controller
const controlSearch = async () => {
    //1. Get seacrh query from UI
    const query = searchView.getInput();

    if (query) {
        //2. New search object add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        spinerLoader(elements.searchRes);

        try {
            //4. Search for recipes
            await state.search.getRecipes();
    
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch (error) {
            clearLoader();
            alert(error);
        };
    }
}

elements.searchForm.addEventListener('submit', (query) => {
    query.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', el => {
    const button = el.target.closest('.btn-inline');
    const page = parseInt(button.dataset.goto);

    searchView.clearResults();
    searchView.renderResults(state.search.recipes, page);
});

//MARK: - Recipe controller
const isLiked = () => {
    let isLiked;
    try {
        isLiked = state.likes.isLiked(state.recipe.id);
    } catch (error) {
        isLiked = false;
    }

    return isLiked;
}

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for new recipe
        recipeView.clearRecipe();
        spinerLoader(elements.recipe);

        //Highlight active recipe if results showed into UI
        if (state.search) searchView.highlightSelected(id);
        
        //Create new Recipe object
        state.recipe = new Recipe(id);
        
        try {
            //Get recipe from API
            await state.recipe.getRecipe();
            
            //Calculate time and number of servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Parse ingredients
            state.recipe.parseIngredients();

            //Present recipe into UI
            clearLoader();
            recipeView.renderRecipe(state.recipe, isLiked());
        } catch (error) {
            alert(error);
        }
    }


}

//MARK: - List controller
const controlList = () => {
    if (!state.list) state.list = new List();
    
    state.recipe.ingredients.forEach(el => {
        //Add ingredients to state
        const shoppingListItem = state.list.addItem(el.count, el.unit, el.ingredient);
        
        //Add ingredients to UI
        listView.renderItem(shoppingListItem);
    });
};
    
const controlListChangeDelete = event => {
    const itemID = event.target.closest('.shopping__item').dataset.itemid;

    if (itemID) {
        if (event.target.matches('.shopping__delete, .shopping__delete *')) {
            //Delete item from state
            state.list.deleteItem(itemID);

            //Delete item from UI
            listView.deleteItem(itemID);
        }
        else if (event.target.matches('.shopping__count__value')) {
            const val = event.target.value;

            if (val > 0) {
                //Update state
                state.list.updateItem(itemID, val);
            }
        }
    }
};

//MARK: - Likes controller
const controlLikes = () => {
    if (!state.likes) state.likes = new Like();

    const id = state.recipe.id;
    //If NOT marked as liked
    if (!state.likes.isLiked(id)) {
        //Add like to state
        const likedItem = state.likes.addLike(
            id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.imageURL
        )
        //Change button color to FILLED
        likesView.toggleLikedButton(true);

        //Add item to liked list
        likesView.renderLikeRecipe(likedItem);
    }
    //If MARKED as liked
    else {
        //Delete like from state
        state.likes.deleteLike(id);
        //Change button color to NOT filled
        likesView.toggleLikedButton(false);

        //Update UI
        likesView.removeLikedRecipe(id);
    }

    likesView.toggleLikedMenuButton(state.likes.getNumberOfLikes());
};

window.addEventListener('load', () => {
    state.likes = new Like();

    state.likes.getLikes();
    state.likes.likes.forEach(item => likesView.renderLikeRecipe(item));

    //Show / hide likes menu button
    likesView.toggleLikedMenuButton(state.likes.getNumberOfLikes());

    //If hash value exist the recipe will be loaded
    controlRecipe();

});

//Add event listener if change the number of ingredients in the shopping list by clicking onto the small up/down button or changing it manually
['click', 'change'].forEach(event => elements.shoppingList.addEventListener(event, controlListChangeDelete)); 

//Add event listeners for hash changes
window.addEventListener('hashchange', controlRecipe);

//Change number of servings
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if (event.target.matches('.add__to__shopping__list, .add__to__shopping__list *')) {
        controlList();
    }
    else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});