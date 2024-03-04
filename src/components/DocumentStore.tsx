import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useStatusContext } from "../contexts/StatusContext";
import { useStepContext } from "../contexts/StepContext";
import { useWrappedDocumentContext } from "../contexts/WrappedDocumentContext";
import { deployDocumentStore } from "../services/document-store";
import { Button } from "../components/Button";
import { useState } from "react";

export const DocumentStore = () => {
    const { documentStoreAddress, setDocumentStoreAddress } = useDocumentStoreContext();
    const { setCurrentStep } = useStepContext();
    const { setStatus } = useStatusContext();
    const { signer } = useAccountContext();
    const { currentStep } = useStepContext();
    const [documentOption, setDocumentOption] = useState<string>("");
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const onDeploy = async () => {
        try {
            setStatus("pending");
            setDocumentStoreAddress(inputValue);
            setCurrentStep("dns");
            setStatus("initial");
        } catch (e) {
            setStatus("error");
            console.error(e);
        }
    };

    const onNewDeploy = async () => {
        try {
            setStatus("pending");

            const documentStoreAddress = await deployDocumentStore(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                signer!,
            );
            setDocumentStoreAddress(documentStoreAddress);

            setCurrentStep("dns");
            setStatus("initial");
        } catch (e) {
            setStatus("error");
            console.error(e);
        }
    };

    return (
        <>
            <div>
                <div>
                    <p style={{display:"inline" , marginRight:"2rem"}}>¿Tiene una dirección de Document Store?</p>
                    <Button buttonText="Sí" onHandler={() => { setDocumentOption("Ingresar") }} ></Button>
                    <Button buttonText="No" onHandler={() => { setDocumentOption("Crear") }} ></Button>
                </div>
            </div>
            {documentOption != "" && (
                <>
                    {documentOption === "Ingresar" &&
                        <div style={{marginBottom:"1rem"}}>
                            <p>Ingrese la dirección del Document Store</p>
                            <input 
                                type="text" 
                                placeholder="0xXXXXXXXXXXXX" 
                                value={inputValue} 
                                onChange={handleInputChange}>
                            </input>
                            <button 
                                style={{ margin: "0 8px 8px 0" }}
                                onClick={onDeploy}
                                disabled={inputValue === "" } 
                            >
                                Continuar
                            </button>
                        </div>
                    }
                    {documentOption === "Crear" &&
                        <div style={{marginBottom:"1rem"}}>
                            <Button 
                                buttonText="Desplegar Document Store" 
                                onHandler={onNewDeploy} 
                            />
                        </div>
                    }
                </>
            )}
        </>
    );
};