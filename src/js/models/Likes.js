export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        //Persist the date in localStorage
        this.persistData();

        return like;
    }
    //Same code from Lists to delete a liked item.
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //Persist the date in localStorage
        this.persistData;

    }
    //Is an item liked or not?
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // This restores likes from the localStorage
        if (storage) this.likes = storage;
    }

}
