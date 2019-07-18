export default class Likes {
    constructor () {
        this.likes = [];
    }

    //Add like
    addLike(id, title, author, imageURL) {
        const like = {id, title, author, imageURL};
        this.likes.push(like);
        this.saveLikes();
        return like;
    }

    //Delete like
    deleteLike(id) {
        const position = this.likes.findIndex(like => like.id === id);
        this.likes.splice(position, 1);
        this.saveLikes();
    }

    //Is liked or not
    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) > -1;
    }

    //Get numbers of likes
    getNumberOfLikes() {
        return this.likes.length;
    }

    saveLikes() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getLikes() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}