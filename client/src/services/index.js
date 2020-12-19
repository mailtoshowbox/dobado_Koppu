
const API_HOST_AT = "http://localhost:3000";

export function getDocumentList() {
      return fetch(API_HOST_AT+"/products")      
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
    return fetch(API_HOST_AT+"/box")      
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


export function updateBox(item) {
  console.log("ItemService.updateItem():");
  console.log(item);
  const {id=""} = item;
  return fetch(API_HOST_AT+'/box/'+id, {
    method: "PUT",
    mode: "cors",
    headers: {
          "Content-Type": "application/json"
        },
    body: JSON.stringify(item)
  })
    .then(response => {
      if (!response.ok) {
        handleResponseError(response);
      }
      return response.json();
    })
    .catch(error => {
      handleError(error);
    });
}

export function addNewBox(newitem) {
  
  return fetch(API_HOST_AT+'/box', {
    method: "POST",
    mode: "cors",
    headers: {
          "Content-Type": "application/json"
      },
    body: JSON.stringify(newitem)
  })
    .then(response => {
      if (!response.ok) {
          handleResponseError(response);
      }
      return response.json();
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