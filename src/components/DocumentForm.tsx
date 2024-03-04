import { wrapDocument } from "@govtechsg/open-attestation";
import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useDnsContext } from "../contexts/DnsContext";
import { useStatusContext } from "../contexts/StatusContext";
import { useStepContext } from "../contexts/StepContext";
import { useWrappedDocumentContext } from "../contexts/WrappedDocumentContext";
import { issueDocument } from "../services/document-store";

export const DocumentForm = () => {
  const { documentStoreAddress } = useDocumentStoreContext();
  const { dns } = useDnsContext();
  const { status, setStatus } = useStatusContext();
  const { setCurrentStep } = useStepContext();
  const { setWrappedDocument } = useWrappedDocumentContext();
  const { signer } = useAccountContext();

  const documentBase = {
    $template: {
      name: "SIMPLE_COO",
      type: "EMBEDDED_RENDERER",
      url: "https://paulr10463.github.io/CheckPlantilla",
    },
    issuers: [
      {
        name: "Demo Issuer",
        documentStore: documentStoreAddress,
        identityProof: {
          type: "DNS-TXT",
          location: dns,
        },
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const dniStudent = data.get("DNIStudent")
    //Change the fetch to the correct endpoint
    const path = 'http://localhost:3000/student/'+dniStudent

    let rawDocument = {};
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('La solicitud falló');
      }
      const data = await response.json();
    
      rawDocument = {
        // Suponiendo que documentBase ya está definido en alguna parte de tu código
        ...documentBase,
        names: data["names"],
        lastNames: data["lastNames"],
        faculty: data["faculty"],
        academicPeriod: data["academicPeriod"],
        enrollmentDate : data["enrollmentDate"],
      };
      
      // Ahora puedes usar rawDocument como necesites
    } catch (error) {
      alert(error+" Revisar que el número de cédula exista");
    }

    try {
      setStatus("pending");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(rawDocument);
      const wrappedDocument = wrapDocument(rawDocument as any);

      await issueDocument({
        wrappedDocument,
        signer: signer!,
        documentStoreAddress: documentStoreAddress!,
      });

      setWrappedDocument(wrappedDocument);
      setCurrentStep("download");

      setStatus("initial");
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  };

  return (
    <form onSubmit={onDocumentSubmit}>
      <section style={{ marginBottom: "24px" }}>
        <p>N° de cédula</p>
        <input
          style={{ padding: "8px 12px", width: "100%" }}
          type="text"
          name="DNIStudent"
          placeholder="1725651281"
        />
      </section>
      <button style={{marginBottom:"1rem"}}type="submit" disabled={status === "pending"}>
        {status === "pending" ? "Cargando..." : "Aceptar"}
      </button>
    </form>
  );
};
