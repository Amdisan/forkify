import View from "./View";
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay'); 
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _message = 'Recipe was successfully upload';

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();       
    }

    toggle(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggle.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggle.bind(this));
        this._overlay.addEventListener('click', this.toggle.bind(this));
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();

            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);            
        });
    }
   
    _generateMarkup(){
       
    }
}

export default new AddRecipeView();