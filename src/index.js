import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

Notiflix.Notify.init({ position: 'right-top' });

const DEBOUNCE_DELAY = 300;

const list = document.querySelector('.country-list');
const inputEL = document.querySelector('input');
const countryInfoEl = document.querySelector('.country-info');

let inputValue = '';

inputEL.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  clearInfo();
  inputValue = event.target.value;
  if (inputValue === '' || inputValue.trim() === '') {
    return;
  }
  fetchCountries(inputValue)
    .then(response => markupMaker(response))
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function markupMaker(response) {
  if (!response) return;
  if (response.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (response.length === 1) {
    markupLeng = response[0].languages.map(leng => {
      return leng.name;
    });
    const markup = response.map(arr => {
      return CountryInfo(arr);
    });

    countryInfoEl.insertAdjacentHTML('beforeend', [...markup]);
    return;
  }

  const markup = response.map(arr => {
    return CountryList(arr);
  });

  list.insertAdjacentHTML('beforeend', [...markup]);
}

function CountryList(arr) {
  return `<li class="item"><img src='${arr.flags.svg}' width='20' height='10px'/><h2>${arr.name}</h2></li>`;
}

function CountryInfo(arr) {
  return `<div class="country-name"><img  class='flag' src='${
    arr.flags.svg
  }' width='20' height='10px'/><h2>${arr.name}</h2></div><p>Capital: ${
    arr.capital
  }</p><p>Population: ${arr.population}</p><p>Languages: ${[...markupLeng]}</p>`;
}

function clearInfo() {
  list.innerHTML = '';
  countryInfoEl.innerHTML = '';
}
