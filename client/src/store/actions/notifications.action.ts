export const ADD_NOTIFICATION: string = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION: string = "REMOVE_NOTIFICATION";

export function addNotification(title: string, text: string): IAddNotificationActionType { 
    return { type: ADD_NOTIFICATION, text: text, title: title };
}

export function removeNotification(id: number): IRemoveNotificationActionType {
    return { type: REMOVE_NOTIFICATION, id: id };
}
export function parseApiResult(result: any) {
    const {message="", data:{ user={}}}  = result; 
    let titleMesage = '';
    let bodyMessage = ''; 
    const processMassage = message ? message : result.data.message;
    switch (processMassage){
        case "LOGIN.ERROR":
            if(result.data.message && result.data.message === "LOGIN.LOGIN_NOT_ACTIVATED"){
                bodyMessage = "account not activated";
                titleMesage = "Contact Administrator";
            }else{
                bodyMessage = "account not registered properly";
                titleMesage = "Failed";
            }
            
           
            break;
        case "LOGIN.SUCCESS": 
            titleMesage =  `Hello ${user.name} `;
            bodyMessage =  `Welcome`;
            break;
        default:
            titleMesage ="";
            break;

    } 
    return {titleMesage, bodyMessage};

   
}

interface IAddNotificationActionType { type: string, text: string, title: string };
interface IRemoveNotificationActionType { type: string, id: number };
