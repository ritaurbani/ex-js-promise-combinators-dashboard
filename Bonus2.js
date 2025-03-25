// Bonus 2 - Chiamate fallite
// Attualmente, se una delle chiamate fallisce, ** Promise.all() ** rigetta l'intera operazione.

// Modifica `getDashboardData()` per usare ** Promise.allSettled() **, in modo che:
// Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
// Stampa in console un messaggio di errore per ogni richiesta fallita.
// Testa la funzione con un link fittizio per il meteo(es.https://www.meteofittizio.it).
//oppure metti falso 

async function fetchJson(url) {//per evitare il then
    const response = await fetch(url)
    const object = await response.json()
    return object
}

async function getDashboardData(query) {//queste operazioni anche se effettuate in parallelo ci metteranno tempo
    try {

        console.log(`caricamento dashboard query ${query}`)
        //1.creo 3 promises in attesa di risoluzione una per ogni richiesta (eseguite in parallelo senza await)- raccoglie promessa res.json()
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapifalso/destinations?search=${query}`)
        console.log(destinationPromise)
        const weatherPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`)
        console.log(weatherPromise)
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`)
        console.log(airportsPromise)

        const promises = [destinationPromise, weatherPromise, airportsPromise]//array di promises (fetchJson)
        console.log(promises)
        const [destinations, weathers, airports] = await Promise.allSettled(promises)//invece delle 3 qui sotto facciamo destructuring
        console.log([destinations, weathers, airports])
        //per controllare se dati sono validi uso ternario - BONUS1
        const destination = destinations[0]
        const weather = weathers[0]
        const airport = airports[0]

        return {//ternario e per fare il controllo
            // city: destinations[0].name,//primo elemento da ogni risposta (risposta di API e un array)
            city: destination ? destination.name : null,
            country: destination ? destination.country : null,
            temperature: weather ? weather.temperature : null,
            weather: weather ? weather.weather_description : null,
            airport: airport ? airport.name : null
        }
    } catch (error) {//se richiesta API fallisce
        throw new Error(`errore nel recupero dei dati: ${error.message}`)
    }
}


// getDashboardData("london")

getDashboardData("vienna")//london corretto - vienna has weather array vuoto
    .then(data => {//THEN RICEVE I DATI(gestisce risultato di una promise) E LI STAMPA - la promise resolve un data
        console.log("Dashboard data", data);
        let frase = "";
        if (data.city !== null && data.country !== null) {
            frase += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature !== null && data.weather !== null) {
            frase += `Today there are ${data.temperature} degree amd the weather is ${data.weather}.\n`
        }
        if (data.airport !== null) {
            frase += `The main airport is ${data.airport}.\n`
        }
        console.log(frase)
    })//se chiamata fallisce invece di then eseguiamo catch
    .catch(error => console.error(error))