// import articlesTpl from './templates/articles.hbs';
import './css/common.css';
import NewsApiService from './js/news-service'; // импортируем логику взаимодейтвия с API
// import LoadMoreBtn from './js/components/load-more-btn';


/*
 * - Пагинация
 *   - страница и кол-во на странице
 * - Загружаем статьи при сабмите формы
 * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
 * - Обновляем страницу в параметрах запроса
 * - Рисуем статьи
 * - Сброс значения при поиске по новому критерию
 *
 * https://newsapi.org/
 * 4330ebfabc654a6992c2aa792f3173a3
 * cdbc22a4fd484d829814de4916e0ca00 // зарегился и добавил свой ключ
 * http://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1
 */


// const options = {
//   headers: {
//     Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
// };

// fetch('https://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1', options)
//   .then(r => r.json())
//   .then(console.log); // отвыкаем выводить в консоль т.к. у нас есть вкладка network

// также для примера подключусь вторым способом так как говорит об этом документация при регистрации, так тоже ок:
// fetch('https://newsapi.org/v2/everything?q=cat&apiKey=cdbc22a4fd484d829814de4916e0ca00')
//   .then(r => r.json())
//   .then(console.log); // отвыкаем выводить в консоль т.к. у нас есть вкладка network

// Теперь приступим к загрузке страниц, начнем с простого:

// const options = {
//   headers: {
//     Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
// };
// const url = 'https://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1'; // вынесем в отдельную перемнную,
// // чтобы наш код был аккуратнее

// fetch(url, options)
//   .then(r => r.json())
//   .then(console.log); 

// Далее при сабмите формы, должен выполняться запрос с поиском того что мы ввели в инпут формы:

// Для этого в нашей HTML уже есть разметка формы:
    // <form class="form-inline search-form js-search-form">
    //   <div class="form-group mx-sm-3 mb-2">
    //     <label for="searchQuery" class="sr-only">Что ищем?</label>
    //     <input
    //       type="text"
    //       class="form-control"
    //       name="query"
    //       id="searchQuery"
    //       placeholder="Что ищем?"
    //       autocomplete="off"
    //     />
    //   </div>
    //   <button type="submit" class="btn btn-primary mb-2">Искать</button>
    // </form>

//  У нас есть ul куда мы будем вставлять наш наблон разметки для динамической загрузки карточек:
    // <ul class="articles js-articles-container"></ul>

// У нас есть кнопка загрузить ещё, чтобы подгружать доп. группу карточек:    
    // <button
    //   type="button"
    //   class="btn btn-primary button"
    //   data-action="load-more"
    // >
    //   <span
    //     class="spinner-border spinner-border-sm spinner is-hidden"
    //     role="status"
    //     aria-hidden="true"
    //   ></span>

    //   <span class="label">Показать ещё</span>
    // </button>
    
// настроим рефы:
const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]')
};

// Вешаем слушатель событий на форму и добавляем обработчик событий:
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// let searchQuery = ''; // сделаем эту переменную глобальной, чтобы использовать в функциях onSearch() и onLoadMore,
// но это не лучшее решение, ниже об этом описал (далее вынесем логику взаимодейтсвия с API в отдельный файл) Можем
// убирать т.к. добавили геттер и сеттер в файле с логикой API

// Добавляем функцию обработчик событий:
// function onSearch(e) {
//   e.preventDefault(); // убераем перезагрузку страницы при сабмите

// // код который мы описали выше для загрузки карточек из бекенда, вставляем в нашу функцию.Такой вариант не очень, но для начала
// // сделаем так:
//   const options = {
//   headers: {
//     Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
// };
// const url = 'https://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1'; // вынесем в отдельную перемнную,
// // чтобы наш код был аккуратнее

// fetch(url, options)
//   .then(r => r.json())
//   .then(console.log);

// }

// Работает, пока это все выводится на вкладку network.Далее хотелось бы значение которое необходимо искать, прописывать
// не в коде, как "?q=cat", а получать как значение из инпута (т.е. то что вводит нам пользователь) для этого достучимся
// до нашего инпута, заберем из него значение и подставим в наш запрос на бекенд:

// function onSearch(e) {
//   e.preventDefault();

//   searchQuery = e.currentTarget.elements.query.value; // получаем ссылку на форму через станартный для формы
//   // атрибут name = "query". Т.е мы взяли форму "e.currentTarget" у неё свойство .elemments у неё свойство .query и
//   // получили его значение .value

//   const options = {
//   headers: {
//     Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
//   };

// //  далее подставим динамическое значение для поиска из переменной searchQuery вместо нашего cat:
// const url = 'https://newsapi.org/v2/everything?q=${searchQuery}&language=en&pageSize=5&page=1';

// fetch(url, options)
//   .then(r => r.json())
//   .then(console.log);

// }

// Ок, теперь добавим функциоал позволяющий загружать статьи по кнопке "загрузить ещё"
// Первым делом настроим реф с нашей кнопкой в разметке, чтобы не дублировать код подымимся выше и добавим такую запись
// в уже существующие рефы: loadMoreBtn: document.querySelector('[data-action="load-more"]'), а такж добавим слушатель
// событий на эту кнопку и обработчик событий функцию onLoadMore (см. выше по тексту)

// В эту функцию передаем тот же код что и для функции onSearch(), но есть проблема: как внутри этой функции получить
// значение const searchQuery, если эта переменная объявлена внутри функции onSearch(). Получается, что при сабмите формы
// необходимо где-то сохранять текущее значение нашей формы (значения инпута). Самое простое решение, это сделать нашу
// переменную const searchQuery глобальной и вынести её за пределы функции и по умолчанию селать пустой: let searchQuery = '';
// Вроде такое решение ок, но есть проблема, она заключается в том, что начинаютя макароны, а именно мы начинаем путать нашу
// логику работы с API и логику отрисовки и реагирования на интерфейс. Ранее мы говорили, что функции которые что-то забирают
// и которые что-то рисуют и обрабатывают должны быть разделены на разные функции. Соответсвенно нам логику работы с API
// необходимо вынести в отдельный файл

// function onLoadMore() {
//    e.preventDefault();

//   const options = {
//   headers: {
//     Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
//   };

// const url = 'https://newsapi.org/v2/everything?q=${searchQuery}&language=en&pageSize=5&page=1';

// fetch(url, options)
//   .then(r => r.json())
//   .then(console.log);

// }

// Ок, далее всю логику работы с API просто вынесем в отдельный файл. Теперь перепишем наши функции onSearch() и onLoadMore
// с учетом того, что мы вынесли нашу логику взаимодействия с API в отдельный файл (перед этим импортируем нашу логику которую
// мы прописали в файле news-ServiceWorker.js) и создадим экземпляр класса, чтобы получить объект с методами и логикой, которую
// описали для взаимодействия с API:

const newsApiService = new NewsApiService(searchQuery); // таким образом мы достучались к той логике которую вынесли в отдельный файл,
// т.е. у этого класса теперь метод fetchArticles()
// console.log(newsApiService);


// function onSearch(e) {
//   e.preventDefault(); 

//   searchQuery = e.currentTarget.elements.query.value;
  
//   newsApiService.fetchArticles(searchQuery); // благодаря тому что мы импортировали логику из файла взаимодействия с API (где 
//   // мы создали прототип) + тому что мы объявили этот прототип(класс) здесь в коде перед функцией, мы вызываем этот класс и метод
//   // который в него вложили, кроме того нам необходимо на вызванном методе достучаться к значению инпута для этого в параметр
//   // функции вложим searchQuery и поместим значение переменной в наш экземпляр класса, так: new NewsApiService(searchQuery) 
// }

// // В этой функции также вызовим функцию оторую помистили в наш экземпляр класса:
// function onLoadMore() {
//   newsApiService.fetchArticles(searchQuery);
// }

// Проверяем, все работает. Проблема в том, что в нашем основном файле js все ещё есть наша глобальная
// переменная let searchQuery = ''; при этом логику мы вынесли в отдельный файл.Логично, что именно он должен запоминать
// значение которое будет поступать в searchQuery. Соответственно перенесем эту переменную туда, но немного измени логику
// и перепишем наш экземпляр класса (см. в файле логики работы с апи), ну и после доработки класса, перепишем наши функции:

function onSearch(e) {
  e.preventDefault(); 

  newsApiService.query = e.currentTarget.elements.query.value; // что мы сделали? в этой строке кода, при сабмите формы, мы
  // на наш объект const newsApiService = new NewsApiService(searchQuery); в его свойство this.searchQuery, которое лежит в
  // constructor() { this.searchQuery = ''; } при помощи сеттера: set query(newQuery) { this.searchQuery = newQuery; }, 
  // записали то что мы из формы получаем: "= e.currentTarget.elements.query.value;" (кота, собаку и т.д.)
  newsApiService.resetPage(); // когда мы сабмитим форму, мы устанавливаем значение для нашего searchQuery, здесь
  // newsApiService.query = e.currentTarget.elements.query.value; поэтому сразу же добавим нашу функцию ресет. Теперь после
  // каждого сабмита, наш пейдж будет = 1, при этом по кнопке "показать ещё" наш пейдж по прежнему будет увеличиваться на +1
  // Т.е.если мы сабмитим повторно, то скорее всего мы ввели в наш инпут новое значение, поэтому начинаем наш пейдж снова с 1,
  // даже если пользователь повторно нажмет на сабмит и значение в инпуте останется прежним, то резуьльтат запроса выдаст первую 
  // страницу объектов
  newsApiService.fetchArticles(searchQuery); 
}


function onLoadMore() {
  newsApiService.fetchArticles(searchQuery);
}

// Но даже после всех наших доработок проблема все ещё остается.В чем она ? Когда мы делаем запрос, к нам приходит результат
// из первого пакета объектов(котиков), но когда мы нажимаем на кнопку "показать ещё", запрос выполняется, но в запросе
// параметр page остается все ещё "1", т.е. получается что необходимо при каждом следующем запросе, увеличивать значение
// page на 1. Необходимо доабать логику взаимодействия с бекендом (API). Соответственно понадобитья где-то хранить значение
// нашего параетра page, для этого расширим конструктор нашего класса и скорректируем нашу строку запроса подставив
// динамическое значение.






// Оригинальный код:

// import articlesTpl from './templates/articles.hbs';
// import './css/common.css';
// import NewsApiService from './js/news-service';
// import LoadMoreBtn from './js/components/load-more-btn';

// const refs = {
//   searchForm: document.querySelector('.js-search-form'),
//   articlesContainer: document.querySelector('.js-articles-container'),
// };
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
// const newsApiService = new NewsApiService();

// refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

// function onSearch(e) {
//   e.preventDefault();

//   newsApiService.query = e.currentTarget.elements.query.value;

//   if (newsApiService.query === '') {
//     return alert('Введи что-то нормальное');
//   }

//   loadMoreBtn.show();
//   newsApiService.resetPage();
//   clearArticlesContainer();
//   fetchArticles();
// }

// function fetchArticles() {
//   loadMoreBtn.disable();
//   newsApiService.fetchArticles().then(articles => {
//     appendArticlesMarkup(articles);
//     loadMoreBtn.enable();
//   });
// }

// function appendArticlesMarkup(articles) {
//   refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
// }

// function clearArticlesContainer() {
//   refs.articlesContainer.innerHTML = '';
// }
