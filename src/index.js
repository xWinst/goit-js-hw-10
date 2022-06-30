import './css/styles.css';
import fetchCountry from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const ref = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

ref.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(event) {
    let { value } = event.target;
    value = value.trim();
    if (!value) {
        reset();
        return;
    }
    const name = `https://restcountries.com/v3.1/name/${value}?fields=name,capital,population,flags,languages`;
    fetchCountry(name).then(renderCountryData).catch(searchError);
}

function renderCountryData(countryData) {
    reset();
    if (countryData.length > 10) {
        Notify.info(
            'Too many matches found. Please enter a more specific name.'
        );
        return;
    }
    let markup = '';
    if (countryData.length > 1) {
        countryData.forEach(({ name, flags }) => {
            markup += `<li class="item">
                           <img alt = "${name.common} flag" src = "${flags.svg}" width="50"> 
                           <span>${name.common}</span>
                       </li>`;
        });
        ref.countryList.innerHTML = markup;
    } else {
        const { name, flags, capital, population, languages } = countryData[0];
        const langs = Object.values(languages);
        markup = `<div class=thumb>
                      <img alt = "${name.common} flag" 
                          src = "${flags.svg}" 
                          width="100"> 
                      <span>${name.common}</span>
                  </div>
                  <p class="prop">Official name:  
                      <span>${name.official}</span>
                  </p>
                  <p class="prop">Capital:  
                      <span>${capital}</span>
                  </p>
                  <p class="prop">Population:  
                      <span>${population}</span>
                  </p>
                  <p class="prop">Langueges:  
                      <span>${langs.toString().replaceAll(',', ', ')}</span>
                  </p>`;

        ref.countryInfo.innerHTML = markup;
    }
}

function searchError(error) {
    Notify.failure('Oops, there is no country with that name');
}

function reset() {
    ref.countryInfo.innerHTML = '';
    ref.countryList.innerHTML = '';
}
