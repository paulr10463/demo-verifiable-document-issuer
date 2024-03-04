import { AccountContextProvider } from "./contexts/AccountContext";
import { DnsContextProvider } from "./contexts/DnsContext";
import { DocumemtStoreProvider } from "./contexts/DocumentStoreContext";
import { StatusProvider } from "./contexts/StatusContext";
import { StepProvider } from "./contexts/StepContext";
import { WrappedDocumentProvider } from "./contexts/WrappedDocumentContext";
import { Steps } from "./components/Steps";
import { Header } from "./components/Header";
import { Validate } from "./components/Validate";
import { combineContextProviders } from "./utils";
import { useState } from "react";
import "./App.css";

const App = () => {
  const providers = [
    AccountContextProvider,
    DnsContextProvider,
    DocumemtStoreProvider,
    StatusProvider,
    StepProvider,
    WrappedDocumentProvider,
  ];
  const AppContextProvider = combineContextProviders(providers);
  const [mode, setMode] = useState<string>("");
  return (
    <AppContextProvider>
      <main>
        <Header/>
          <button className="principalButtons" onClick={()=>setMode("emitir")}>Emitir Documento</button>
          <button className="principalButtons" onClick={()=>setMode("validar")}>Validar Documento</button>
        {mode === "emitir" && <Steps />}
        {mode === "validar" && <Validate />}

      </main>
    </AppContextProvider>
  );
};

export default App;
