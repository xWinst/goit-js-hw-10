export default function searchCountry(name) {
    return fetch(name).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        response.json();
    });
}
