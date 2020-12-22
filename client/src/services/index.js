
const API_HOST_AT = "http://localhost:3000";



export function getDocCategoryList() {
  return fetch(API_HOST_AT+"/doccategory")      
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

export function updateDoc(item) { 
  const {id=""} = item;
  return fetch(API_HOST_AT+'/product/'+id, {
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

export function addNewDoc(newitem) {
  
  return fetch(API_HOST_AT+'/products', {
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

export function getRacks(id) { 

  console.log("id----++",id);
   
  return fetch(API_HOST_AT+'/box/racks/'+id)
    .then(response => {
      if (!response.ok) {
        handleResponseError(response);
      }
      return response.json();
    })
    .catch(error => {
      console.log("error--", error);
      handleError(error);
    });
}

export function updateBox(item) { 
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



export function updateDocCat(item) { 
  const {id=""} = item;
  return fetch(API_HOST_AT+'/doccategory/'+id, {
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

export function addNewDocCat(newitem) {
  
  return fetch(API_HOST_AT+'/doccategory', {
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