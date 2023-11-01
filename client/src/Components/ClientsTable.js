import React, { useEffect, useState } from "react";
import SimpleDataTable from "./Common/DataTable";
import Modal from "./Modal";
import axios from "axios";
import Popup from "./Popup";
import ChangePass from "./ChangePass";

const setCookie = (options) => {
  const { name, value = "", path = "/", duration = 3600 } = options;

  const durationMs = duration * 1000;
  const expires = new Date(Date.now() + durationMs);

  document.cookie = `${name}=${escape(
    value
  )}; expires=${expires.toUTCString()}; path=${path}`;
};

const deleteCookie = (name) => {
  setCookie({
    name: name,
    value: undefined,
    duration: -1,
  });
};

const ClientsTable = () => {
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [recordsData, setRecordsData] = useState([]);
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [activeRecord, setActiveRecord] = useState({});
  const [addNew, setAddNew] = useState(false);
  const [showPassChange, setShowPassChange] = useState(false);

  useEffect(() => {
    axios("/records")
      .then((response) => {
        const recordsList = response.data;
        setRecordsData(recordsList.data);
      })
      .catch(() => {
        console.log("records was not loaded");
      });
  }, []);

  const actions = {
    main: {
      add: () => {
        setShowAddNewModal(true);
        setEditable(true);
        setTitle("ახალი ჩანაწერის დამატება");
        setButtonText("დამატება");
        setAddNew(true);
      },
      changePassword: () => setShowPassChange(true),
      logOut: () => {
        deleteCookie("sessionId");
        window.location.href = "/";
      },
    },
    individual: {
      კორექტირება: (rec) => handle.edit(rec),
      წაშლა: (rec) => handle.delete(rec),
      ნახვა: (rec) => handle.view(rec),
      მონიშვნა: (rec) => handle.select(rec),
    },
  };

  const handle = {
    edit: (e) => {
      setShowAddNewModal(true);
      setActiveRecord({ ...e });
      setEditable(true);
      setTitle("ჩანაწერის რედაქტირება");
      setButtonText("შენახვა");
      setAddNew(false);
    },
    delete: (e) => {
      setConfirm(true);
      setActiveRecord({ ...e });
    },
    view: (e) => {
      setShowAddNewModal(true);
      setActiveRecord({ ...e });
      setEditable(false);
      setTitle("ჩანაწერი");
      setAddNew(false);
    },
    select: (e) => {
      axios.put(`/select/${e.clientId}`)
        .then((response) => {
          const setSelected = recordsData.map((rec) => {
            if(rec.clientId === e.clientId) {
              return {...rec, selected: true}
            }else{
              return {...rec}
            }
          })

          setRecordsData(setSelected);

          alert(response.data.message)
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
  };

  return (
    <>
      {showPassChange && <ChangePass hideModal={setShowPassChange} />}
      {confirm && (
        <Popup
          hideModal={setConfirm}
          active={activeRecord}
          records={recordsData}
          setRecords={setRecordsData}
        />
      )}
      {showAddNewModal && (
        <Modal
          onEdit={editable}
          title={title}
          buttonText={buttonText}
          hideModal={setShowAddNewModal}
          record={activeRecord}
          addRecord={setRecordsData}
          recordsList={recordsData}
          addNew={addNew}
        />
      )}
      <SimpleDataTable
        items={recordsData}
        searchable={["mark", "model", "phone", "location", "comment"]}
        actions={actions}
      />
    </>
  );
};

export default ClientsTable;
