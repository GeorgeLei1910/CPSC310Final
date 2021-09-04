/**
 * Receives a query object as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query object
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */
let returnJSON = (resp) => {
    return JSON.parse(resp.responseText);
}

CampusExplorer.sendQuery = (query) => {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        const theUrl = "/query";
        xhttp.open("POST", theUrl);

        xhttp.onload = () => {
            let result = returnJSON(xhttp);
            if (xhttp.status === 200) {
                resolve(result);
            } else {
                reject(result);
            }
        };
        xhttp.onerror = () => {
            reject({"error": "Connection Error"});
        };
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(query));
    });
};
