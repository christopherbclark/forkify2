export const elements = {
    searchForm: document.querySelector('.search'),
    searchRes: document.querySelector('.results'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

export const aLinks = {

    oliveOil: `https://www.amazon.com/gp/product/B00GGBLPVU/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00GGBLPVU&linkCode=as2&tag=forkify-20&linkId=5546ec6c4a16689cc0add0b7e9995242`

};

export const renderLoader = parent => {

    const loader = `
    
        <div class="${elementStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>

    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};