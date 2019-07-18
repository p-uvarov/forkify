import { elements } from './base';

//Render item into UI
export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count__value" min="${item.count}">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;

    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

//Delete item from UI
export const deleteItem = id => {
    elements.shoppingList.querySelector(`[data-itemid="${id}"]`).remove();
};