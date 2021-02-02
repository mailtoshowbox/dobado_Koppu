
const API_HOST_AT = "http://localhost:3000";



export function approveUser(newitem) { 
  const {value=0} = newitem.selected;
  let role = '';
  /* if(value ==="1"){
    role ="Documentcreater";
  }else if(value ==="2"){
    role ="Qualityuser";
  }else{
    role ="Employee";
  } */
  let ypdatedStaus= Object.assign({...newitem.user,roles : [value] });
  
  return fetch(API_HOST_AT+'/users/profile/updateStatus', {
    method: "POST",
    mode: "cors",
    headers: {
          "Content-Type": "application/json"
      },
    body: JSON.stringify(ypdatedStaus)
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

export function getUserList() {
  return fetch(API_HOST_AT+"/users/list")      
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
export function loginUser(newitem) {
  
  return fetch(API_HOST_AT+'/auth/email/login', {
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

export function registerUser(newitem) {
  
  return fetch(API_HOST_AT+'/auth/email/register', {
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

export function getNewQrCode(newitem) {
  return fetch(API_HOST_AT+'/products/getQRCode', {
    method: "POST",    
    headers: {
          "Content-Type": "application/json"
      },
    body: JSON.stringify(newitem)
  })
    .then((response) => { 
      if (!response.ok) {
          handleResponseError(response);
      }
      return response.json();
    }).then((dtatus) =>  { 
      return dtatus;
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