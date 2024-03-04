import { utils } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import DragAndDropJSONLoader from './DragAndDropJSONLoader'; // Asegúrate de que el nombre del archivo importado sea correcto
import { wrapDocument } from "@govtechsg/open-attestation";
import { diagnose, Kind, Mode } from "@govtechsg/open-attestation/dist/types/shared/utils/diagnose";
import { TransactionsList } from "./TransactionsList";
import { TransactionByHash } from "./TransactionByHash";
import { transformDocument } from "../utils";

export function Validate() {
    const [document, setDocument] = useState<any>(null); // Cambiado a 'any' para permitir objetos, ajusta según necesidad
    useEffect(() => {
        
    }, [document]); // Depende de 'document', no de 'setDocument'


    const checkDocument = (rawDocument: any) => {
        const wrappedDocument = wrapDocument(rawDocument);
        alert(utils.isWrappedV2Document(wrappedDocument));
    };



    return (
        <div>
             
            <h1>Validar</h1>
            <p>Carga el documento </p>
            <DragAndDropJSONLoader onLoadDocument={setDocument}/>
            <label style={{marginRight:"1rem"}} htmlFor="VerifyDocumentStore">Document Store Address:</label>
            <TransactionsList />
            <TransactionByHash />
        </div>
    );
}
