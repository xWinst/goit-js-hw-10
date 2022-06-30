import './css/styles.css';
import fetchCountries from './fetchCountries';
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
    reset();
    let { value } = event.target;
    value = value.trim();
    if (!value) {
        return;
    }
    fetchCountries(value).then(renderCountryData).catch(searchError);
}

function renderCountryData(countryData) {
    if (countryData.length > 10) {
        Notify.info(
            'Too many matches found. Please enter a more specific name.'
        );
        return;
    }

    if (countryData.length > 1) {
        ref.countryList.innerHTML = createList(countryData);
    } else {
        ref.countryInfo.innerHTML = createInfo(countryData[0]);
    }
}

function searchError(error) {
    console.log(error);
    Notify.failure('Oops, there is no country with that name');
}

function reset() {
    ref.countryInfo.innerHTML = '';
    ref.countryList.innerHTML = '';
}

function createList(countries) {
    const result = countries
        .map(
            ({ name, flags }) =>
                `<li class="item">
                <img alt = "${name.common} flag" src = "${flags.svg}" width="50"> 
                <span>${name.common}</span>
            </li>`
        )
        .join('');
    return result;
}

function createInfo(country) {
    const { name, flags, capital, population, languages } = country;
    const langs = Object.values(languages);
    return `<div class=thumb>
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
}
