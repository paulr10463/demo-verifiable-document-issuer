import { checkProof } from '@govtechsg/open-attestation';
import React, { useState } from 'react';

export const TransactionByHash = () => {
    const [transactionsData, setTransactionsData] = useState([]); // Cambiado a 'any' para permitir objetos, ajusta según necesidad
    const [transactionResult, setTransactionResult] = useState(null);
    const [address, setAddress] = useState("");
    const [merkleRootHash, setMerkleRootHash] = useState("");

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }

    const handleMerkleRootHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMerkleRootHash(e.target.value);
    }

    async function enviarPeticion() {
        const url = 'https://sepolia.infura.io/v3/f45e57b4e82342c289ea21394ef8ef7e';
        const body = {
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [{
                fromBlock: 'earliest',
                toBlock: 'latest',
                address: address,
            }],
            id: 1
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('La solicitud falló');
            }
            if (data.error) {
                throw new Error('Error en la respuesta:', data.error);
            }
            if (!data.result) {
                throw new Error('No se encontraron resultados');
            }
            if (data.result.length != undefined && data.result.length > 0) {
                setTransactionsData(data.result);
            }
        } catch (error) {
            console.error('Error al enviar la petición:', error);
        }
    }

    const checkTransactionWithMerkeRootHash = () => {
        enviarPeticion();
        transactionsData.map((transaction) => {
            const proofs = transaction.topics;
            for (let i = 0; i < proofs.length; i++) {
                if (proofs[i].includes(merkleRootHash)) {
                    setTransactionResult(transaction);
                }
            }
            return null;
        });
    }



    return (
        <>
            <div>
                <h1>Obtener transacción con el hash</h1>
                <div>
                <p>
                    Dirección de la Document Store: {address}
                </p>
                <input type="text" style={{width:"66ch"}} value={address} onChange={handleAddressChange}  />
                <p>
                    Merkle Root Hash: {merkleRootHash}
                </p>
                <input type="text" style={{width:"66ch"}} value={merkleRootHash} onChange={handleMerkleRootHashChange} />
                </div>
                <button onClick={checkTransactionWithMerkeRootHash}>Chequear</button>
                <div>
                    {transactionResult &&
                        <a href={`https://sepolia.etherscan.io/tx/${transactionResult.transactionHash}`}>{transactionResult.transactionHash} </a>
                    }
                </div>
            </div>
        </>
    );
};