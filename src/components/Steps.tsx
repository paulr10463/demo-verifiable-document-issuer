import { saveAs } from "file-saver";
import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useStatusContext } from "../contexts/StatusContext";
import { useStepContext } from "../contexts/StepContext";
import { useWrappedDocumentContext } from "../contexts/WrappedDocumentContext";
import { step } from "../types";
import { getAccount } from "../services/account";
import { deployDocumentStore } from "../services/document-store";
import { Button } from "../components/Button";
import { Dns } from "../components/Dns";
import { DocumentForm } from "../components/DocumentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { DocumentStore } from "../components/DocumentStore";
const Step = ({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: React.ReactElement;
}) => {
  return (
    <>
      <h2>
        {index + 1}. {title}
      </h2>
      {body}
    </>
  );
};

export const Steps = () => {
  const stages = ["connect", "deploy", "dns", "document", "download"];
  const { signer, setSigner, setNetwork } = useAccountContext();
  const { setDocumentStoreAddress } = useDocumentStoreContext();
  const { setStatus } = useStatusContext();
  const { currentStep, setCurrentStep } = useStepContext();
  const { wrappedDocument } = useWrappedDocumentContext();

  const onConnect = async () => {
    try {
      const { providerSigner, providerNetwork } = await getAccount();
      setSigner(providerSigner);
      setNetwork(providerNetwork);
      setCurrentStep("deploy");
    } catch (e) {
      console.error(e);
    }
  };

  const getBack = () => {
    if (currentStep === "connect") {
      return;
    }
    const index = stages.indexOf(currentStep);
    setCurrentStep(stages[index - 1]);
  }

  const onDownload = () => {
    const blob = new Blob([JSON.stringify(wrappedDocument, null, 2)], {
      type: "text/json;charset=utf-8",
    });
    saveAs(blob, `SIMPLE_COO_DOCUMENT.tt`);
  };

  const onShowContract = () => {
    return JSON.stringify(wrappedDocument, null, 2);
  }

  const onCreateAnother = () => {
    setCurrentStep("document");
  };

  const steps: {
    key: step;
    title: string;
    body: React.ReactElement;
  }[] = [
    {
      key: "connect",
      title: "Conectar la extensión de Metamask",
      body: <Button buttonText="Conectar" onHandler={onConnect} />,
    },
    {
      key: "deploy",
      title: "Configurar Document Store",
      body: <DocumentStore/> 
    },
    {
      key: "dns",
      title: "Configuración de DNS",
      body: <Dns />,
    },
    {
      key: "document",
      title: "Editar Formulario de Documento",
      body: <DocumentForm />,
    },
    {
      key: "download",
      title: "Descargar y Verificar Documento",
      body: (
        <>
          <div style={{marginBottom:"1rem", border:"1px solid #f2f2f2", borderRadius:"0.5rem", padding:"0.5rem"}}>
            {onShowContract()}
          </div>
          <div>
            {wrappedDocument?.data.issuers[0].name}
          </div>
          <Button buttonText="Download" onHandler={onDownload} />
          <a
            href="https://dev.tradetrust.io/verify"
            target="_blank"
            rel="noreferrer noopener"
            style={{ margin: "0 8px 8px 0" }}
          >
            <button>Verificar</button>
          </a>
          <Button buttonText="Create Another" onHandler={onCreateAnother} />
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", width:"100%", justifyContent:"space-between" }}>
        {steps.map((step, index) => (
          <div
            key={`step-${step.key}`}
            style={{
              borderLeft: currentStep === step.key ? "solid 4px white" : "none",
              width: "19%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                opacity: currentStep === step.key ? "1" : "0.4",
                lineHeight: 1.3,
                fontSize: "0.9em",
                border:"solid 1px #f2f2f2",
                height: "100%",
                borderRadius: "0.5em",
                padding: "0.5em",
                width: "100%",
                backgroundColor: currentStep === step.key ? "var(--primary-color)" : "white",
                color: currentStep === step.key ? "white" : "var(--primary-color)",
              }}
            >
              <span style={{border : "1px solid ", display:"flex", justifyContent:"center", alignItems:"center", borderRadius:"50%", width:"20px", height:"20px"}}>
                {index + 1}
              </span>
              <div style={{maxWidth:"15ch", fontSize:"1rem"}}>
              {step.title}
              </div>
              {index < 4 && <FontAwesomeIcon  
              icon={faChevronRight} className="" size="lg" />}
            </div>
          </div>
        ))}
      </div>
      {steps.map(
        (step, index) =>
          currentStep === step.key && <Step {...{ index, ...step }} />,
      )}
      {currentStep != "connect" && <Button buttonText="Regresar" onHandler={getBack}></Button>}
    </>
  );
};
