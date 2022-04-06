const form = document.querySelector('form')
const recipes = document.querySelector('.recipes')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log(`service worker registered`))
        .catch(() => console.log(`service worker not registered`))
}