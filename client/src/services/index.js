
import { getDocCustomGetOptions, getDocCustomPostOptions, getDocCustomPutOptions } from "../common/utils";
 
import APP_CONST from "../common/contant";
export function confirmEmailToken(options) {

 
//localhost:3000http://localhost:3001/emailconfirmation#4295787
      return fetch(APP_CONST.API_HOST_AT+"/auth/email/verify/4295787",)      
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

export function getDashboardList(options) {

  var myOptions = getDocCustomGetOptions(options);

      return fetch(APP_CONST.API_HOST_AT+"/products/dashboard/602eb4222e3f11162ccdb0da", myOptions)      
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

  return fetch(APP_CONST.API_HOST_AT+'/doctype/'+id, myOptions)
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
  return fetch(APP_CONST.API_HOST_AT+'/doctype', myOptions)
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
  return fetch(APP_CONST.API_HOST_AT+"/doctype", myOptions)      
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

export function updateUserProfile(newitem, options) { 

  console.log("myOpt newitem ions---", newitem);
    
  var myOptions = getDocCustomPostOptions(options, newitem);  

  console.log("myOptions---", myOptions);


  return fetch(APP_CONST.API_HOST_AT+'/users/profile/updateProfile', myOptions)
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
export function approveUser(newitem, options) { 

  const {value=0} = newitem.selected; 
  let ypdatedStaus= Object.assign({...newitem.user,roles : [value] }); 
  var myOptions = getDocCustomPostOptions(options, ypdatedStaus);  


  return fetch(APP_CONST.API_HOST_AT+'/users/profile/updateStatus', myOptions)
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
  var url = APP_CONST.API_HOST_AT+"/users/list";
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
  
  return fetch(APP_CONST.API_HOST_AT+'/auth/email/login', {
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
  
  return fetch(APP_CONST.API_HOST_AT+'/auth/email/register', {
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
  return fetch(APP_CONST.API_HOST_AT+"/doccategory", myOptions)      
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
export function getDocRequestList(options={}) {
  var myOptions = getDocCustomGetOptions(options);
  return fetch(APP_CONST.API_HOST_AT+"/docrequests/request", myOptions)      
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
export function getDocRequestApprovalList(options={}) {
  var myOptions = getDocCustomGetOptions(options);
  return fetch(APP_CONST.API_HOST_AT+"/docrequests/approval", myOptions)      
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

export function loadApproavalAccessUserInfo(item,options={}) {
  const {access, emp_id} = item;
  var myOptions = getDocCustomGetOptions(options.auth); 
  return fetch(APP_CONST.API_HOST_AT+"/users/checkApproval/"+emp_id.toString(), myOptions)      
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




export function getDocDepartmentList(options={}) {
  var myOptions = getDocCustomGetOptions(options);
  return fetch(APP_CONST.API_HOST_AT+"/docdepartments", myOptions)      
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
  return fetch(APP_CONST.API_HOST_AT+'/products/'+id, myOptions)
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
  return fetch(APP_CONST.API_HOST_AT+'/products', myOptions)
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
  return fetch(APP_CONST.API_HOST_AT+'/products/getRandomCode', {
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

      return fetch(APP_CONST.API_HOST_AT+"/products", myOptions)      
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

    return fetch(APP_CONST.API_HOST_AT+"/box", myOptions)      
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
   
  return fetch(APP_CONST.API_HOST_AT+'/box/racks/'+id)
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
  return fetch(APP_CONST.API_HOST_AT+'/box/'+id, myOptions )
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

  return fetch(APP_CONST.API_HOST_AT+'/box',  myOptions)
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

  return fetch(APP_CONST.API_HOST_AT+'/doccategory/'+id, myOptions)
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
  return fetch(APP_CONST.API_HOST_AT+'/doccategory', myOptions)
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



export function updateDocDept(item,options) { 
  const {id=""} = item;
  var myOptions = getDocCustomPutOptions(options, item);  

  return fetch(APP_CONST.API_HOST_AT+'/doccategory/'+id, myOptions)
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

export function addNewDocDept(newitem, options) {
  var myOptions = getDocCustomPostOptions(options, newitem);  
  return fetch(APP_CONST.API_HOST_AT+'/docdepartments', myOptions)
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



export function addNewDocumentRequest(newitem, options) {
  var myOptions = getDocCustomPostOptions(options, newitem);  
  return fetch(APP_CONST.API_HOST_AT+'/docrequests', myOptions)
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