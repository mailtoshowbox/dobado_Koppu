
import { logout } from "./store/actions/account.actions";
 
import React  from "react";
import APP_CONST from "./common/contant"; 

//class IdleTimer {
  class  IdleTimer   extends  React.Component {
  timeout: any;
  onTimeout: any;
  interval: any;
  timeoutTracker: any;
  eventHandler: any;
  onExpired: any;
   
 constructor(props: any ) {
  super(props);
  
    this.timeout = props.timeout;
    this.onTimeout = props.onTimeout;
    this.onExpired = props.onExpired;
 
    const localStorage_expiredTime: any = 0;
 
    //const [isTimeout, setIsTimeout] = useState(false);

    const expiredTime = parseInt(localStorage_expiredTime, 10);
 

    if (expiredTime > 0 && expiredTime < Date.now()) {  
      this.onExpired();
      return;
    }
 
    this.eventHandler = this.updateExpiredTime.bind(this);
 
    this.tracker(); 
    this.startInterval();  
  } 
 
  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const localStorage_expiredTime: any = localStorage.getItem("_expiredTime"); 
      const expiredTime = parseInt(localStorage_expiredTime, 10); 

      if (expiredTime < Date.now()) {
  
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 1000);
  }

  updateExpiredTime() { 
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      const tilee: any = Date.now() + APP_CONST.AUTO_LOGOUT_TIME * 1000;   
      localStorage.setItem("_expiredTime", tilee);
    }, 300);
  }

  tracker() { 
    window.addEventListener("mousemove", this.updateExpiredTime);
    window.addEventListener("scroll", this.updateExpiredTime);
    window.addEventListener("keydown", this.updateExpiredTime);
  }

  cleanUp() {
    localStorage.removeItem("_expiredTime");
    clearInterval(this.interval);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
    logout(); 
    window.location.replace(APP_CONST.LOGIN_URL);
   // this.context.router.push("/path")


  }

}

export default IdleTimer;

