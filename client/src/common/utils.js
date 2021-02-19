export function getDocCustomGetOptions(options) { 
    const myHeaders = new Headers();
    var bearer= `bearer ${options.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    return {mode: "cors",    method: 'GET',    headers: myHeaders}
}

export function getDocCustomPostOptions(options,newitem) {

    const myHeaders = new Headers();
    var bearer= `bearer ${options.auth.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    //delete options.auth;
     
    return {mode: "cors",    method: 'POST',    headers: myHeaders,body: JSON.stringify({...newitem})}
}

export function getDocCustomPutOptions(options,newitem) {

    const myHeaders = new Headers();
    var bearer= `bearer ${options.auth.access_token}`;
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', bearer);
    //delete options.auth;
    return {mode: "cors",    method: 'PUT',    headers: myHeaders, body: JSON.stringify({...newitem})}
}