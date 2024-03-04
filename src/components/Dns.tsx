import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useDnsContext } from "../contexts/DnsContext";
import { useStepContext } from "../contexts/StepContext";
import { Button } from "../components/Button";
import { dns } from "../types";

export const Dns = () => {
  const { documentStoreAddress } = useDocumentStoreContext();
  const { setDns } = useDnsContext();
  const { setCurrentStep } = useStepContext();
  const { network } = useAccountContext();

  const onConfirm = () => {
    setCurrentStep("document");
  };

  const onChange = (event: { target: { value: dns } }) => {
    setDns(event.target.value);
  };

  return (
    <div>
      <section style={{ marginBottom: "24px" }}>
        <p>
          Tu dirección de Document Store es: <strong>{documentStoreAddress}</strong>
        </p>
        <p>
          Coloca el siguiente parámetro como un atributo TXT del dominio que emitirá los certificados:
        </p>
        <code
          style={{
            padding: "8px 12px",
            display: "block",
            border: "1px solid #e0e0e0",
            borderRadius: "0.5rem",
            background: "var(--primary-color)",
            color: "white", 
          }}
        >
          openatts net=ethereum netId={network?.chainId} addr={documentStoreAddress} 
        </code>
      </section>
      <section style={{ marginBottom: "24px" }}>
        <p>Ingresa el DNS en el que se realizó la configuración: </p>
        <input
          style={{ padding: "8px 12px", width: "100%" }}
          type="text"
          placeholder="epn.edu.ec"
          onChange={onChange}
        />
      </section>
      <Button buttonText="Confirmar" onHandler={onConfirm} />
    </div>
  );
};
