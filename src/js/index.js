import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

//********************
//SEARCH CONTROLLER***
//********************

const ControlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();


    if (query) {
        // 2) New search object and add it to the state
        state.search = new Search(query);

        // 3) Perpare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
    try {
        await state.search.getResults();


        // 5) Reunder the results on the UI
        clearLoader();
        searchView.renderResults(state.search.result);
    } catch (err) {
        alert(`Oh no! Something isn't working.`);
        clearLoader();
    }
        //console.log(search)
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    ControlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        
    };
});

//********************
//RECIPE CONTROLLER***
//********************
const  controlRecipe = async () => {
    //Get the ID from the URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prep the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Create the new recipe object
        state.recipe = new Recipe(id);

        //Highlight selected search item
        //if (state.search) searchView.highlightSelected(id);
        
        //Get the recipe data and parse ingredients
        try {
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //Calc the servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (err) {
            alert ('There was a problem getting the recipe.');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//********************
//LIST CONTROLLER  ***
//********************

const controlList = () => {
    if (!state.list) state.list = new List();
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.additem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e=> {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);
        //Delete from the UI
        listView.deleteItem(id);

        //Handle the count update
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});


//********************
//LIKE CONTROLLER  ***
//********************

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //User has NOT liked current recipe.
    if (!state.likes.isLiked(currentID)) {
        
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //add like to the UI list
            likesView.renderLike(newLike);
            
    //User HAS liked current recipe.
    } else {
        //Remove like from state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from the UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore the liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restores the likes
    state.likes.readStorage();

    //Toggles the like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked.
        if (state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add *')) {
        //This adds ingredients to the Shopping List
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Call the Like controller
        controlLike();
    }
});

