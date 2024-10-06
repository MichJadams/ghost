import Cookies from 'js-cookie';
/**
 * 🍪 Cookie Monster says... 🍪
 * we will name our cookie "game"
 * we will store our session data as comma separated string to avoid 
 * insecure deserialization vulnerabilties 
 * we also won't store any PII in our cookie
 * cookie monster HATES hackers
 */


/**
 * this function will eventually need to request consent to store cookies...
 * we may need to track that consent somewhere in state to avoid accidentally going against user wishes
 * it's not just good practice...
 * it's the LAW 🚓🚨👮‍♀️
 */
function initCookies(){
    if (Cookies.get("game") == undefined){
        alert("This game uses cookies to save progress.")
    } 
    Cookies.set("game", "hi!");
}

/**
 * pass this function game state as an object, 
 * it will convert to a cookie string and set the current cookie to that string
 * @param {Object} saveData 
 */
function saveToCookie(saveData){
    let cookie = '';
    for (const key in saveData){
        cookie += key.toString();
        cookie += ':' + saveData[key].toString();
        cookie += '|';
    }
    cookie = cookie.substring(0, cookie.length - 1);
    Cookies.set("game", cookie);
}

/**
 * 
 * @returns saved data as javascript object OR empty object if no data exists
 */
function readFromCookie(){
    const saveData = {};
    const cookie = Cookies.get("game");
    if (cookie == undefined || !cookie.includes('|')){
        return saveData;
    }

    const strings = cookie.split('|');
    for (const s of strings){
        const pair = s.split(':');
        saveData[pair[0]] = pair[1];
    }

    return saveData;
}

export {initCookies, saveToCookie, readFromCookie};