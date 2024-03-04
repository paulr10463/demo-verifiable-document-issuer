
import React, {  useState } from "react";

import { TransactionsList } from "./TransactionsList";
import { TransactionByHash } from "./TransactionByHash";


export function Validate() {

    const [verifyerOption, setVerifyerOption] = useState<string>(""); // Cambiado a 'string' para permitir texto, ajusta según necesidad

    return (
        <div>
            <button onClick={() => { setVerifyerOption("Transactions") }}> Consultar transacciones de una document store </button>
            <button onClick={() => { setVerifyerOption("MerkleRoot") }}> Consultar que la transaccion existe con el merkle root </button>
            <a
            href="https://dev.tradetrust.io/verify"
            target="_blank"
            rel="noreferrer noopener"
            style={{ margin: "0 8px 8px 0" }}
            >
            <button>Verificar con render</button>
            </a>

            <h1>Validar</h1>

            {verifyerOption === "Transactions" && <TransactionsList />}
            {verifyerOption === "MerkleRoot" && (
                <>
                    <p>Carga el documento </p>
                    <TransactionByHash />
                </>)}
                
        </div>
    );
}
