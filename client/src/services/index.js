
import { getDocCustomGetOptions, getDocCustomPostOptions, getDocCustomPutOptions } from "../common/utils";

const API_HOST_AT = "http://localhost:3000";



export function getDashboardList(options) {

  var myOptions = getDocCustomGetOptions(options);

      return fetch(API_HOST_AT+"/products/dashboard/602eb4222e3f11162ccdb0da", myOptions)      
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
export function updateDocType(item,options) { 
  const {id=""} = item;
  var myOptions = getDocCustomPutOptions(options, item);  

  return fetch(API_HOST_AT+'/doctype/'+id, myOptions)
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
export function addNewDocType(newitem, options) {
  var myOptions = getDocCustomPostOptions(options, newitem);  
  return fetch(API_HOST_AT+'/doctype', myOptions)
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
export function getDocTypeList(options={}) {
  var myOptions = getDocCustomGetOptions(options);
  return fetch(API_HOST_AT+"/doctype", myOptions)      
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

export function approveUser(newitem, options) { 

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
  var myOptions = getDocCustomPostOptions(options, ypdatedStaus);  

  return fetch(API_HOST_AT+'/users/profile/updateStatus', myOptions)
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

export function getUserList(options) { 
  var url = API_HOST_AT+"/users/list";
   var myOptions = getDocCustomGetOptions(options);
   return fetch(url, myOptions).then(response => {      
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

export function getDocCategoryList(options={}) {
  var myOptions = getDocCustomGetOptions(options);
  return fetch(API_HOST_AT+"/doccategory", myOptions)      
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

export function updateDoc(item,options ) { 
  var myOptions = getDocCustomPutOptions(options, item);  

  const {id=""} = item;
  return fetch(API_HOST_AT+'/products/'+id, myOptions)
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

export function addNewDoc(newitem,options ) {
  var myOptions = getDocCustomPostOptions(options, newitem);  
  return fetch(API_HOST_AT+'/products', myOptions)
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
  return fetch(API_HOST_AT+'/products/getRandomCode', {
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



export function getDocumentList(options) {

  var myOptions = getDocCustomGetOptions(options);

      return fetch(API_HOST_AT+"/products", myOptions)      
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

  export function getBoxList(options) {
    var myOptions = getDocCustomGetOptions(options);

    return fetch(API_HOST_AT+"/box", myOptions)      
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
      handleError(error);
    });
}

export function updateBox(item,options) { 
  var myOptions = getDocCustomPutOptions(options, item); 
  const {id=""} = item;
  return fetch(API_HOST_AT+'/box/'+id, myOptions )
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

export function addNewBox(newitem, options) {
  var myOptions = getDocCustomPostOptions(options, newitem);  

  return fetch(API_HOST_AT+'/box',  myOptions)
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



export function updateDocCat(item,options) { 
  const {id=""} = item;
  var myOptions = getDocCustomPutOptions(options, item);  

  return fetch(API_HOST_AT+'/doccategory/'+id, myOptions)
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

export function addNewDocCat(newitem, options) {
  var myOptions = getDocCustomPostOptions(options, newitem);  
  return fetch(API_HOST_AT+'/doccategory', myOptions)
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