// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;

import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultLinks = document.querySelectorAll('.results__link');
    const resultLinksArray = Array.from(resultLinks);
    resultLinksArray.forEach(el => el.classList.remove('results__link--active'));

    const activeResult = document.querySelector(`a[href*="${id}"]`)
    if(activeResult) activeResult.classList.add('results__link--active');
}

export const trimRecipeTitle = (title, length = 20) => {
    if (title.length > length) {
        const reducer = (accumulator, current) => {
            if (`${accumulator} ${current}`.length > length) {
                return accumulator;
            }
            
            return `${accumulator} ${current}`;
        }

        return `${title.split(" ").reduce(reducer)} ...`;
    }

    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${trimRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1  : page + 1}">
        <span>Page ${type === 'prev' ? page - 1  : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);
    let buttons = '';

    if (page === 1 && numberOfPages > 1) {
        //Show next button
        buttons = createButton(page, 'next');
    }
    else if (page > 1 && page < numberOfPages) {
        //Show next button
        //Show previous button
        buttons = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if (page === numberOfPages && numberOfPages > 1) {
        //Show previous button
        buttons = createButton(page, 'prev');
    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', buttons);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    //Render results of current page
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    
    //Render pagination
    renderButtons(page, recipes.length, resultsPerPage);
};