import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    //Add item
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    //Delete item
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    //Update item
    updateItem(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
};