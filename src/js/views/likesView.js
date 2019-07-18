import { elements } from './base';
import { trimRecipeTitle } from './searchView';

//Show / hide love menu button if there are or thre are no liked recipes
export const toggleLikedMenuButton = numberOfRecipe => {
    numberOfRecipe > 0 ? elements.likesMenu.style.visibility = 'visible' : elements.likesMenu.style.visibility = 'hidden';
}

//Toggle liked button on UI
export const toggleLikedButton = isLiked => {
    const toggleStr = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${toggleStr}`);
}

//Add liked item to UI
export const renderLikeRecipe = item => {
    const markup = `
    <li>
        <a class="likes__link" href="#${item.id}">
            <figure class="likes__fig">
                <img src="${item.imageURL}" alt="${item.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${trimRecipeTitle(item.title)}</h4>
                <p class="likes__author">${item.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
} 

//Remove liked item from UI
export const removeLikedRecipe = id => {
    document.querySelector(`.likes__link[href="#${id}"]`).parentElement.remove();
}