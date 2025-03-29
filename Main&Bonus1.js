// Scrivi la funzione getDashboardData(query), che deve:

// Essere asincrona(async). //le async anche se tornano valore (Ex: return object), in realta
// ritornano una promise che risolve quel valore > questo valore deve contenere dati aggregati raccolti da queste 3 API
// Utilizzare Promise.all() per eseguire più richieste in parallelo.
// Restituire una Promise che risolve un oggetto contenente i dati aggregati.
// Stampare i dati in console in un messaggio ben formattato.
// Testa la funzione con la query "london"

// utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:
// Nome completo della città e paese da / destinations ? search = [query]
//     (result.name, result.country, nelle nuove proprietà city e country).
// Il meteo attuale da / weathers ? search = { query }
//     (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
// Il nome dell’aeroporto principale da / airports ? search = { query }
//     (result.name nella nuova proprietà airport).
// Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

// Attenzione: le chiamate sono delle ricerche e ritornano un’array ciascuna, di cui devi prendere il primo risultato(il primo elemento).

//SVOLGIMENTO
//3 chiamate da ottenere in un unico momento in parallelo > NON POSSO USARE AWAIT
//Nella variabile devo salvarmi la promessa, che poi daro al Promise.all all interno di un array

// Bonus 1 - Risultato vuoto
// Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione,
// semplicemente i dati relativi a quella chiamata verranno settati a null
// e  la frase relativa non viene stampata. Testa la funzione con la query “vienna” (non trova il meteo).

/////////////////////////////////////ESECUZIONE/////////////////////////////////////

//per rendere piu leggibile posso creare funzione fetchJson
// Essere asincrona(async). //le async anche se tornano valore (Ex: return object), in realta
// ritornano una promise che risolve quel valore > questo valore deve contenere dati aggregati raccolti da queste 3 API
async function fetchJson(url) {//per evitare il then
    const response = await fetch(url)
    const object = await response.json()
    return object
}

async function getDashboardData(query) {//queste operazioni anche se effettuate in parallelo ci metteranno tempo
    try {

        console.log(`caricamento dashboard query ${query}`)
        //1.creo 3 promises in attesa di risoluzione una per ogni richiesta (eseguite in parallelo senza await)- raccoglie promessa res.json()
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${query}`)
        console.log(destinationPromise)
        const weatherPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${query}`)
        console.log(weatherPromise)
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${query}`)
        console.log(airportsPromise)

        const promises = [destinationPromise, weatherPromise, airportsPromise]//array di promises (fetchJson)
        console.log(promises)
        //attende che le 3 chiamate(promise) siano risolte e restituisce array di risultati
        // const results = await Promise.all(promises)//mi ritorna una promise che con await ritorna un array di results(dato che ogni promise ritorna in resolve) di ogni promise
        const [destinations,weathers,airports] = await Promise.all(promises)//invece delle 3 qui sotto facciamo destructuring
        //Estrazione risultati array results
        // const destinations = results[0] //dati della destinazione (prima API)
        // const weathers = results[1]//dati del tempo
        // const airports= results[2]//dati aereoporto

        //per controllare se dati sono validi uso ternario - BONUS1
        const destination = destinations[0]
        const weather = weathers[0]
        const airport = airports[0]

        return {//ternario e per fare il controllo
            // city: destinations[0].name,//primo elemento da ogni risposta (risposta di API e un array)
            city: destination ? destination.name : null,
            country: destination ? destination.country : null,
            temperature: weather? weather.temperature: null,
            weather: weather ? weather.weather_description : null,
            airport: airport ? airport.name : null
        }
    }catch(error){//se richiesta API fallisce
        throw new Error(`errore nel recupero dei dati: ${error.message}`)
    }
}


// getDashboardData("london")

getDashboardData("vienna")//london corretto - vienna has weather array vuoto
    .then(data => {//THEN RICEVE I DATI(gestisce risultato di una promise) E LI STAMPA - la promise resolve un data
        console.log("Dashboard data", data);
        let frase = "";
        if(data.city !== null && data.country !== null){
            frase += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature !== null && data.weather !== null){
            frase += `Today there are ${data.temperature} degree amd the weather is ${data.weather}.\n`
        }
        if(data.airport !== null){
            frase+= `The main airport is ${data.airport}.\n`
        }
        console.log(frase)
    })//se chiamata fallisce invece di then eseguiamo catch
    .catch(error => console.error(error))