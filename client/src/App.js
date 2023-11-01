import {useState, useEffect} from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Auth from "./Components/Auth";
import ClientsTable from "./Components/ClientsTable";
import "./reset.css";
import axios from 'axios';

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

function App() {
  const session = getCookie("sessionId")
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org/?format=json", {
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        let ip = data.ip;
        setIpAddress(ip)
      })
      .catch(error => {
        console.error("Error placing bid:", error);
      });
  }, [])

  return (
    <div className="App">
      {(ipAddress == "212.58.102.246" || ipAddress == "212.58.121.121") ? (<Switch>
        <Route path="/" exact>
            {session != null ?<ClientsTable /> : <Auth />}
        </Route>
        <Route path="/main" exact>
            {session != null ? <ClientsTable /> : <Auth />}
        </Route>
      </Switch>) : (
        <div style={{display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center"}}>
          <h2 style={{color: "white", fontSize: "26px"}}>IP address restriction</h2>
        </div>
      )}
    </div>
  );
}

export default App;
