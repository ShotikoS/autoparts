import axios from "axios";
import React, { useState } from "react";

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const Auth = () => {

    const isLoggedIn = getCookie("sessionId");

    if(isLoggedIn !== null) window.location.href = "/main";

    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    })

    const authorization = () => {
        axios.post("/users/auth", formData)
            .then((response) => {
                response = response.data;
                if(response.access !== "danied") {
                    setCookie("sessionId", response.sessionId);
                    setCookie("user", formData.userName);
                    window.location.reload();
                }
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
    }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="title">ავტორიზაცია</h2>
        <div className="form-fields" style={{padding: "0px 20px"}}>
          <label htmlFor="model">მომხმარებლის სახელი</label>
          <input
            type="text"
            id="model"
            className="modal-form-control"
            onChange={(e) => setFormData((prev) => {return {...prev, userName: e.target.value}})}
          />
        </div>
        <div className="form-fields" style={{padding: "0px 20px"}}>
          <label htmlFor="model">პაროლი</label>
          <input
            type="password"
            id="model"
            className="modal-form-control"
            onChange={(e) => setFormData((prev) => {return {...prev, password: e.target.value}})}
          />
        </div>
        <div className="submit-button" onClick={authorization} >შესვლა</div>
      </div>
    </div>
  );
};

export default Auth;
