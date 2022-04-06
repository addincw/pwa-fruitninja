db.enablePersistence()
    .catch(error => {
        if (error.code == 'failed-precondition') {
            //probably multiple tabs open at once
            console.log('persistence failed')
        } else if (error.code == 'unimplemented') {
            // lack of browser support
            console.log('persistence is not available')
        }
    })

db.collection('recipes').onSnapshot((snap) => {
    snap.docChanges().forEach(docChange => {
        if (docChange.type === 'added') {
            renderUiRecipe(docChange.doc.data(), docChange.doc.id)
        }
        if (docChange.type === 'removed') {
            removeUiRecipe(docChange.doc.id)
        }
    });
})

form.addEventListener('submit', event => {
    event.preventDefault()

    const recipe = {
        name: form.title.value,
        ingredients: form.ingredients.value
    }

    db.collection('recipes').add(recipe)
        .catch(error => console.error(error))

    form.title.value = ''
    form.ingredients.value = ''
})

recipes.addEventListener('click', event => {
    if (event.target.tagName === 'I') {
        const recipeId = event.target.getAttribute('data-id')
        db.collection('recipes').doc(recipeId).delete()
    }
})