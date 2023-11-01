import axios from "axios";
import React, { useState } from "react";
import close from "../icons/close.png";

const Modal = ({
  addNew,
  title,
  onEdit,
  buttonText,
  hideModal,
  record,
  addRecord,
  recordsList,
}) => {
  const [formData, setFormData] = useState({
    mark: addNew ? "" : record.mark,
    location: addNew ? "" : record.location,
    phone: addNew ? "" : record.phone,
    model: addNew ? "" : record.model,
    comment: addNew ? "" : record.comment,
  });

  const phones = !addNew ? record.phone.split(",") : [];

  const addNewRecord = () => {
    axios
      .post("/records", formData)
      .then((response) => {
        hideModal(false);
        addRecord((prevState) => {
          return [
            { Id: "0", clientId: response.data.clientId, ...formData },
            ...prevState,
          ];
        });
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  const editRecord = () => {
    axios
      .put(`/records/${record.clientId}`, formData)
      .then(() => {
        hideModal(false);
        const renew = recordsList.map((r) => {
          if (r.clientId == record.clientId) {
            return { Id: record.id, clientId: record.clientId, ...formData };
          } else {
            return r;
          }
        });
        addRecord(renew);
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  return (
    <div className="modal-container">
      <div className="modal-backgrop" onClick={() => hideModal(false)}></div>
      <div className="modal-content">
        <div className="modal-form">
          <div className="modal-head">
            <img
              className="close-image"
              onClick={() => hideModal(false)}
              src={close}
              alt="close"
            />
          </div>
          <h2 className="title">{title}</h2>
          <div className="form-field-container">
            <div className="form-fields-column">
              <div className="form-fields">
                <label htmlFor="mark">მწარმოებელი</label>
                {onEdit ? (
                  <input
                    type="text"
                    id="mark"
                    className="modal-form-control"
                    placeholder="ჩაწერეთ მწარმოებელი"
                    value={formData.mark}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, mark: e.target.value };
                      })
                    }
                  />
                ) : (
                  <input
                    type="text"
                    id="მწარმოებელი"
                    className="modal-form-control"
                    placeholder="ჩაწერეთ მწარმოებელი"
                    value={formData.mark}
                    disabled
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, mark: e.target.value };
                      })
                    }
                  />
                )}
              </div>
              <div className="form-fields">
                <label htmlFor="model">მოდელი</label>
                {onEdit ? (
                  <input
                    type="text"
                    id="model"
                    className="modal-form-control"
                    placeholder="შეიყვანეთ მოდელი"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, model: e.target.value };
                      })
                    }
                  />
                ) : (
                  <input
                    type="text"
                    id="model"
                    className="modal-form-control"
                    placeholder="შეიყვანეთ მოდელი"
                    disabled
                    value={formData.model}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, model: e.target.value };
                      })
                    }
                  />
                )}
              </div>
            </div>
            <div className="form-fields-column">
              <div className="form-fields">
                <label htmlFor="location">ქალაქი</label>
                {onEdit ? (
                  <input
                    type="text"
                    id="location"
                    className="modal-form-control"
                    placeholder="შეიყვანეთ ქალაქი"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, location: e.target.value };
                      })
                    }
                  />
                ) : (
                  <input
                    type="text"
                    id="location"
                    className="modal-form-control"
                    placeholder="შეიყვანეთ ქალაქი"
                    disabled
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, location: e.target.value };
                      })
                    }
                  />
                )}
              </div>
              <div className="form-fields">
                <label htmlFor="phone">ნომერი</label>
                {onEdit ? (
                  <input
                    type="text"
                    id="phone"
                    className="modal-form-control"
                    placeholder="შეიყვანეთ ნომერი"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, phone: e.target.value };
                      })
                    }
                  />
                ) : (
                  <div
                    className="modal-form-control"
                    style={{ border: "none" }}
                  >
                    {phones.map((number) => {
                      return (
                        <a
                          href={`tel:${number}`}
                          style={{ marginLeft: "10px", marginTop: "10px" }}
                        >
                          {number}{" "}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div
              className="comments-container"
              style={{ marginTop: "20px", marginBottom: "5px" }}
            >
              <label htmlFor="comment" className="comments-label">
                კომენტარი
              </label>
              {onEdit ? (
                <textarea
                  className="comments-field"
                  style={{ marginTop: "5px" }}
                  placeholder="შეიყვანეთ კომენტარი"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => {
                      return { ...prev, comment: e.target.value };
                    })
                  }
                ></textarea>
              ) : (
                <textarea
                  className="comments-field"
                  style={{ marginTop: "5px" }}
                  disabled
                  placeholder="შეიყვანეთ კომენტარი"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => {
                      return { ...prev, comment: e.target.value };
                    })
                  }
                ></textarea>
              )}
            </div>
            {onEdit &&
              (addNew ? (
                <div className="form-submit-container">
                  <button className="form-submit-button" onClick={addNewRecord}>
                    დამატება
                  </button>
                </div>
              ) : (
                <div className="form-submit-container" onClick={editRecord}>
                  <button className="form-submit-button">შენახვა</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
