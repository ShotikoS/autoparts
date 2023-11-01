import React, { useState } from "react";
import axios from "axios";

const ChangePass = ({hideModal}) => {

    const [formData, setFormData] = useState({
        oldPass: "",
        newPass: "",
        secret: ""
    })

  const changePassword = () => {
    axios.put("/password", formData)
        .then((response) => {
            alert(response.data.message);
            hideModal(false)
        })
        .catch((err) => {
            alert(err.response.data.message)
        })
  }

  return (
    <div className="modal-container">
      <div className="modal-backgrop" onClick={() => hideModal(false)}></div>
      <div className="modal-content" style={{width: "400px", height: "360px"}}>
      <h2 className="title">შეცვალეთ პაროლი</h2>
        <div className="form-fields" style={{padding: "0px 20px"}}>
          <label htmlFor="model">ძველი პაროლი</label>
          <input
            type="password"
            id="model"
            className="modal-form-control"
            onChange={(e) => setFormData((prev) => {return {...prev, oldPass: e.target.value}})}
          />
        </div>
        <div className="form-fields" style={{padding: "0px 20px"}}>
          <label htmlFor="model">ახალი პაროლი</label>
          <input
            type="password"
            id="model"
            className="modal-form-control"
            onChange={(e) => setFormData((prev) => {return {...prev, newPass: e.target.value}})}
          />
        </div>
        <div className="form-fields" style={{padding: "0px 20px"}}>
          <label htmlFor="secret">Secret key</label>
          <input
            type="password"
            id="secret"
            className="modal-form-control"
            onChange={(e) => setFormData((prev) => {return {...prev, secret: e.target.value}})}
          />
        </div>
        <div className="submit-button" onClick={changePassword} >შეცვლა</div>
      </div>
    </div>
  );
};

export default ChangePass;
