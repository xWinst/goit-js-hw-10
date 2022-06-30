export default function searchCountry(name) {
  return fetch(name).then(response => response.json());
}
