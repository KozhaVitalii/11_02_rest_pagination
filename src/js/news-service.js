// Выносим нашу логику работы с API в это файл:

// Создадим класс, который будет отвечать за взаимодействие с API: 
// export default class NewsApiService { 
// // создадим внутри него конструктор (как для любого класса):
//   constructor() {
  
// }
//   // создадим метод который будет отвечать за HTTP запросы, т.е. перенесем в него уже написанный нами код, который мы ранее
//   // написали и поместили внутрь функции onSearch() и onLoadMore():
//   fetchArticles(searchQuery) {
//     const options = {
//       headers: {
//         Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
//   };

//     const url = 'https://newsapi.org/v2/everything?q=${searchQuery}&language=en&pageSize=5&page=1'; 

//     fetch(url, options)
//       .then(r => r.json())
//       .then(console.log); 
//   } 
  
// }

// Проверяем, все работает. Проблема в том, что в нашем основном файле js все ещё есть наша глобальная
// переменная let searchQuery = ''; при этом логику мы вынесли в отдельный файл.Логично, что именно он должен запоминать
// значение которое будет поступать в searchQuery. Соответственно перенесем эту переменную туда, но немного измени логику
// и перепишем наш экземпляр класса:

// export default class NewsApiService { 
// // создадим внутри него конструктор (как для любого класса):
//   constructor() {
//     this.searchQuery = ''; // так вынесем нашу переменную в конструктор класса и далее будем подставлять её динамически 
//     // в нашу стороку запроса
//     this.page = 1; // храним первоначальное значение параметра запроса
//   }
//   // создадим метод который будет отвечать за HTTP запросы, т.е. перенесем в него уже написанный нами код, который мы ранее
//   // написали и поместили внутрь функции onSearch() и onLoadMore():
//   fetchArticles(searchQuery) {
//     const options = {
//       headers: {
//         Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
//   };

//     const url = `https://newsapi.org/v2/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`; 

//     fetch(url, options)
//       .then(r => r.json())
//       .then(console.log); 
//   } 
  
// // Для того чтобы из внешнего кода что-то записать в свойство класса this.searchQuery = ''; создадим геттер и сеттер:

//   // теперь значение свойства  this.searchQuery можно получить через геттер:
//   get query() {
//     return this.searchQuery;
//   }
// //  либо теперь через сеттер мы можем перезаписать новое значение поверх того значения, которое уже есть: 
//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }  
// }

// Но даже после всех наших доработок проблема все ещё остается.В чем она ? Когда мы делаем запрос, к нам приходит результат
// из первого пакета объектов(котиков), но когда мы нажимаем на кнопку "показать ещё", запрос выполняется, но в запросе
// параметр page остается все ещё "1", т.е. получается что необходимо при каждом следующем запросе, увеличивать значение
// page на 1. Необходимо доабать логику взаимодействия с бекендом (API). Соответственно понадобитья где-то хранить значение
// нашего параетра page, для этого расширим конструктор нашего класса и скорректируем нашу строку запроса подставив
// динамическое значение const url = `https://newsapi.org/v2/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`;. 
// После чего останется добавить увеличение значения нашего this.page. Это необходимо сделать здесь fetch(url, options)
// .then(r => r.json()).then(console.log);} т.к. именно сюда приходят данные. Пишем условие, если по результатам HTTP запроса 
// результат успешный, то увеличиваем на 1:  

// export default class NewsApiService { 
//   constructor() {
//     this.searchQuery = ''; 
//     this.page = 1; // храним первоначальное значение параметра запроса
//   }

//   fetchArticles(searchQuery) {
//     console.log('До запроса: ', this); // добавим консоль чтобы видеть как меняется значение при каждом обращении через HTTP запрос

//     const options = {
//       headers: {
//         Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
//   },
//   };

//     const url = `https://newsapi.org/v2/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`; 

//     fetch(url, options)
//       .then(r => r.json())
//       .then(data => {
//         console.log(data); // только лишь для того чтобы посмотреть в консоли что приходит по запросу
//         this.page += 1; // при каждом успешном обращении к бекенду, увеличиваем значение page на +1
//         console.log('После запроса, если все ок: ', this); // можно посмотреть в консоле как изменяется номер пейдж при 
//         // каждом нажатии на кнопку "Показать ещё" 
//       }); 
//   } 
  
//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }  
// }

// Логика увеличения page такая: изначально как только мы создали наш const newsApiService = new NewsApiService(searchQuery)
// наш searchQuery = "", а наш page = 1, далее когда мы в инпут вносим значение и нажимаем искать(сабмитим нашу форму), наше
// значение(к примеру cat или dog) из инпута подставляется в newsApiService.query = e.currentTarget.elements.query.value; и
// пошел HTTP запрос newsApiService.fetchArticles(searchQuery); и если в нем фетч выполнился успешно: fetch(url, options)
// .then(r => r.json()).then(data => {});, то тогда мы увеличиваем наш пейдж на 1: then(data => {this.page += 1;});
// Соответственно на следующий запрос(а следующий запрос у нас срабатывает когда мы нажимаем на кнопку "Показать ещё", т.к.мы
// на эту кнопку повесили слушатель событий, которому указали функцию обработчик onLoadMore() в которую вложили функцию с нашей
// основной логикой взаимодействия с бекендом newsApiService.fetchArticles(searchQuery)), наша пейдж уже будет с номером 2 и так
// далее с каждым нажатием на кнопку "показать ещё" при успешном выполнении запроса, наш пейдж будет увеличиваться на +1

// Можем переписать так:

export default class NewsApiService { 
  constructor() {
    this.searchQuery = ''; 
    this.page = 1; // храним первоначальное значение параметра запроса
  }

  fetchArticles(searchQuery) {
    console.log('До запроса: ', this); // добавим консоль чтобы видеть как меняется значение при каждом обращении через HTTP запрос

    const options = {
      headers: {
        Authorization: 'cdbc22a4fd484d829814de4916e0ca00',
  },
  };

    const url = `https://newsapi.org/v2/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`; 

    fetch(url, options)
      .then(r => r.json())
      .then(data => {
        this.incrementPage(); 
        }); 
  } 
  
  // Т.е. добавим небольшую функцию, в которую перенесем наше +1 и просто будем её вызывать в нашем фетч (так аккуратнее)

  // Назовем функцию увеличения страницы так чтобы было понятна суть:
  incrementPage() {
    this.page += 1;
  }

  // Аналогично назовем функцию по смыслу:
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }  
}

// Все работает, но в чем проблема ? Если мы в инпут вместо cat теперь введём dog и засабмитим форму(т.е.
// нажмем на кнопку "искать"), наше свойство page не приит исходное значение "1", а продолжит нумерацию + 1 с того номера
// на котором у нас закончилась нумерация страниц при поиске cat. По сути меняется значение searchQuery, но наш page не
// сбрасывается. Чтобы это пофиксить необходимо делать ресет: resetPage() {this.page = 1;}. Определимся где это вызывать?
// Когда мы сабмитим форму в функции onSearch(e), мы устанавливаем значение для нашего searchQuery, здесь 
// searchQuery = e.currentTarget.elements.query.value; поэтому сразу же после можем добавить нашу функцию ресет.



// Оригиальный код:

// const API_KEY = '4330ebfabc654a6992c2aa792f3173a3';
// const BASE_URL = 'https://newsapi.org/v2';
// const options = {
//   headers: {
//     Authorization: API_KEY,
//   },
// };

// export default class NewsApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   fetchArticles() {
//     const url = `${BASE_URL}/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`;

//     return fetch(url, options)
//       .then(response => response.json())
//       .then(({ articles }) => {
//         this.incrementPage();
//         return articles;
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
