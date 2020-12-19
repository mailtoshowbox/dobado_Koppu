
export function getDocumentList() {
      return fetch("http://localhost:3000/products")      
            .then(response => {      
              if (!response.ok) {      
                handleResponseError(response);      
              }      
              return response.json();      
            })      
            .then(json => {   
                return json;
            })      
            .catch(error => {      
              handleError(error);      
            });
  }

  export function getBoxList() {
    return fetch("http://localhost:3000/box")      
          .then(response => {      
            if (!response.ok) {      
              handleResponseError(response);      
            }      
            return response.json();      
          })      
          .then(json => {   
              return json;
          })      
          .catch(error => {      
            handleError(error);      
          });
}
  function handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
}

function handleError(error) {
    console.log(error.message);
}