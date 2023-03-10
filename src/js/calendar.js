import { onCategoryClick, onSearchInputClick, getPopularNews } from "../index";

import { newsFetchApi } from "../index";
import { currentTypeOfSearch } from "./currentTypeOfSearch";


const CalendarDates = require("calendar-dates");
const calendarDates = new CalendarDates();

const dataSelected = document.querySelector(".data_selected");
const dateField = document.querySelector('.date-field');
const month = document.querySelector(".current_month");
const year = document.querySelector(".current_year");
const monthNext = document.querySelector(".calendar_month_next");
const monthDown = document.querySelector(".calendar_month_down");
const yearNext = document.querySelector(".calendar_year_next");
const yearBack = document.querySelector(".calendar_year_back");
const btnCalendarOpen = document.querySelector(".btn_calendar_open");
const btnCalendarClose = document.querySelector(".btn_calendar_close");
const days = document.querySelector(".days");
const calendar = document.querySelector(".calendar");
const iconCalendar = document.querySelector(".calendar_icon");
const calendarBox = document.querySelector(".calendar-box");
const resetBtn = document.querySelector('.resetDate')


//    formData.day, formData.month, formData.year  для даних дня місяця і року
//  "data_select"   ключ в Локалсторідж


// -----вибір місяця і року

let dates = new Date(); 
let currMonth = dates.getMonth();
let currYear = dates.getFullYear();
let currDate = dates.getDate();


dataSelected.textContent = 'Pick a date';


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

month.innerText = months[currMonth];
year.innerText = currYear;
 

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
};


// -------запис в Локалсторідж
localStorage.removeItem("data_select");

const formData = {
    day: addLeadingZero(currDate),
    month: addLeadingZero(currMonth + 1),
    year: currYear,
};

localStorage.setItem("data_select", JSON.stringify(formData));

// -----вибір і додавання в поле календаря місяця і року

monthNext.addEventListener("click", onNextMonth);
monthDown.addEventListener("click", onDownMonth)
yearNext.addEventListener("click", onNextYear);
yearBack.addEventListener("click", onBackYear);
resetBtn.addEventListener('click', onResetClick)


function onNextMonth() {   
    
    if (currMonth === 11) {
        currMonth = 0;
        month.innerText = months[currMonth]; 
            
    } else {
        currMonth += 1;
        month.innerText = months[currMonth];       
    } 
    
    mainAsync();

    dataSelected.textContent = `${addLeadingZero(formData.day)}/${addLeadingZero(months.indexOf(month.textContent) + 1)}/${year.textContent}`;

    formData.month = addLeadingZero(months.indexOf(month.textContent) + 1);
       
   localStorage.setItem("data_select", JSON.stringify(formData));
}

function onDownMonth() {

    if (currMonth === 0) {
        currMonth = 11;
        month.innerText = months[currMonth]; 
            
    } else {
        currMonth -= 1;
        month.innerText = months[currMonth];       
    } 
    
    mainAsync(); 

    dataSelected.textContent = `${addLeadingZero(formData.day)}/${addLeadingZero(months.indexOf(month.textContent) + 1)}/${year.textContent}`;

    formData.month = addLeadingZero(months.indexOf(month.textContent) + 1);

    localStorage.setItem("data_select", JSON.stringify(formData));
    
}

function onNextYear() {   
    currYear += 1;
    year.innerText = currYear;  

    mainAsync();

    dataSelected.textContent = `${addLeadingZero(formData.day)}/${addLeadingZero(months.indexOf(month.textContent) + 1)}/${year.textContent}`;

    formData.year = year.textContent;

    localStorage.setItem("data_select", JSON.stringify(formData));
   
}

function onBackYear() {
    currYear -= 1;
    year.innerText = currYear;

    mainAsync();

    dataSelected.textContent = `${addLeadingZero(formData.day)}/${addLeadingZero(months.indexOf(month.textContent) + 1)}/${year.textContent}`;

    formData.year = year.textContent;

    localStorage.setItem("data_select", JSON.stringify(formData));
   
}

// -------додавання дати в поле календаря


days.addEventListener("click", onDateSelection);

function onDateSelection(event) {  
    
    const classCurrent = event.target.classList.contains('current');
    const classToday = event.target.classList.contains('today');
    
    if (!classCurrent && !classToday) {
        alert("Select the date of the current month!");
        return;
    }
 
    formData.day = addLeadingZero(event.target.textContent);

    localStorage.setItem("data_select", JSON.stringify(formData)); 

    dataSelected.textContent = `${addLeadingZero(event.target.textContent)}/${addLeadingZero(months.indexOf(month.textContent) + 1)}/${year.textContent}`;

    // записали дату поиска в для запроса newsFetchApi
    newsFetchApi.date = (dataSelected.textContent).split('/').reverse().join('');

  
    onCloseCalendar(); 
}

// --------рендер днів

 async function mainAsync() {
    const data = new Date(Number(year.textContent), months.indexOf(month.textContent));

    const mayDates = await calendarDates.getDates(data); 
    
     // -------колір поточної дати

      mayDates.map(e => {
          
         if (e.iso === `${dates.getFullYear()}-${addLeadingZero(dates.getMonth() + 1)}-${addLeadingZero(dates.getDate())}`) {
             e.type = "today";
         }        
     });

    createMarkup(mayDates); 
        
};
mainAsync();

function createMarkup(mayDates) {
   
    const markup = mayDates.map(({ date, type }) => {
        return `<li class="${type}">${date}</li>`;
    }).join('');

    days.innerHTML = markup;

}

// ---------відкриття і закриття календаря---------

btnCalendarOpen.addEventListener("click", onOpenCalendar);

function onOpenCalendar() {
   
    calendar.classList.add('calendar-open');    
    calendar.classList.remove('calendar-close'); 
            
    btnCalendarClose.style.display = "block";
    btnCalendarOpen.style.display = "none";

    dataSelected.style.color = "#FFFFFF";
    dataSelected.style.backgroundColor = "#4440F6";
    dataSelected.style.opacity = '1';
    dateField.style.backgroundColor = "#4440F6";
    iconCalendar.style.fill = "#FFFFFF";     
}

btnCalendarClose.addEventListener("click", onCloseCalendar);

function onCloseCalendar() {  



// тут, проверяем какой тип поиска, event это переменная пустышка

  if(currentTypeOfSearch.searchInput) {
    onSearchInputClick(event)    
  }
  if(currentTypeOfSearch.popular) {
    getPopularNews(event)    
  }
  if(currentTypeOfSearch.category) {
    onCategoryClick(event)    
  }


    calendar.classList.remove('calendar-open');    
    calendar.classList.add('calendar-close');    

    btnCalendarClose.style.display = "none";
    btnCalendarOpen.style.display = "block";    

    if (localStorage.getItem("theme") === "dark") {       
        dataSelected.style.color = "#F4F4F4";
        dataSelected.style.backgroundColor = "#2E2E2E";
        dateField.style.backgroundColor = "#2E2E2E";
    } else {
        dataSelected.style.color = "#111321";
        dataSelected.style.backgroundColor = "#F4F4F4";
        dateField.style.backgroundColor = "#F4F4F4";
    }

    dataSelected.style.opacity = "0.4";
    // dateField.style.backgroundColor = "transparent";
    iconCalendar.style.fill = "#4440F7";     
}

function onResetClick() {
    dataSelected.textContent = 'Pick a date';
    newsFetchApi.date = null;
    onCloseCalendar();
}
