import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable'; //polyfilling all parsel
import 'regenerator-runtime/runtime'; //polyfilling async await parsel

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/*
if(module.hot){
  module.hot.accept();
}
*/

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks
    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    //rendering recipe

    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error, 8888);
    recipeView.renderError(); //`${error} 8888` no recipe (bad id)
  }
};

const controlSearchResults = async function (query) {
  try {
    resultsView.renderSpinner();

    //1 get search query
    const query = searchView.getQuery();
    //if(!query) return;

    //2 load search results
    await model.loadSearchResult(query);

    //3 render results
    //console.log(model.state.search.results);

    //resultsView.render(model.state.search.results); all results
    resultsView.render(model.getSearchResultsPage());

    //4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //console.log(goToPage);
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)

  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/delete bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
    //console.log(2222);
  } else {
    model.deleteBookmark(model.state.recipe.id);
    //console.log(3333);
  }
  //console.log(model.state);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);

    //successfull upload message
    addRecipeView.renderMessage();

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window

    setTimeout(function () {
      addRecipeView.toggle();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err, 898989);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome');
};

init();

//////////////////////////////////////исходник
/*
import icons from '../img/icons.svg';
import 'core-js/stable'; //polyfilling all parsel
import 'regenerator-runtime/runtime'; //polyfilling async await parsel


const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderSpinner = function(parent){
  const murkup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parent.innerHTML = '';
  parent.insertAdjacentHTML('afterbegin', murkup);
};

const showRecipe = async function(){
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if(!id) return;
    //loading recipe
    renderSpinner(recipeContainer);
    const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
    const data = await res.json();

    //console.log(res, data);
    if(!res.ok) throw new Error(`${data.message} (status: ${res.status})`);

    let {recipe} = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };

    console.log(recipe);

    //rendering recipe
    
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${recipe.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round">
              <svg class="">
                <use href="${icons}#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${recipe.ingredients.map(ing =>
                { return `
                  <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ing.quantity}</div>
                    <div class="recipe__description">
                      <span class="recipe__unit">${ing.unit}</span>
                      ${ing.description}
                    </div>
                  </li>
                `;}
              ).join('')}              
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${recipe.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
    `;
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML("afterbegin", markup);


    //if(!res.ok) throw new Error(`${data.message} (status: ${res.status})`);
  } catch (error) {
    console.error(error);
  }
};

['hashchange','load'].forEach(event => window.addEventListener(event, showRecipe));
*/
