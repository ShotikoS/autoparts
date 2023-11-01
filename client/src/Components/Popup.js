import React from "react";
import axios from "axios";

const Popup = ({active, records, setRecords, hideModal}) => {

    const deleteRecord = () => {
        axios.delete(`/records/${active.clientId}`)
        .then(() => {
          const renew = records.filter((record) => {
            if(record.clientId != active.clientId) return record; 
          })
    
          setRecords(renew);
          hideModal(false)
        })
        .catch(() => {
          console.log("records was not deleted")
        })
      }

  return (
    <div className="modal-container">
      <div className="modal-backgrop" onClick={() => hideModal(false)}></div>
      <div className="modal-content" style={{width: "400px", height: "180px"}}>
        <div className="confirmation-box">
            <p>ნამდვილად გსურთ ამ ჩანაწერის წაშლა?</p>
            <div className="confirmation-buttons">
                <div className="yes" onClick={deleteRecord}>
                    დიახ
                </div>
                <div className="no" onClick={() => hideModal(false)}>
                    არა
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
