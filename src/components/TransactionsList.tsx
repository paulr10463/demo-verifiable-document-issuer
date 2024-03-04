import React, { useState } from 'react';

export const TransactionsList = ({address}) => {
    const [transactionsData, setTransactionsData] = useState([]); // Cambiado a 'any' para permitir objetos, ajusta según necesidad
    
    
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
            if(data.result.length != undefined && data.result.length > 0) {
                setTransactionsData(data.result);
            }
        } catch (error) {
            console.error('Error al enviar la petición:', error);
        }
    }

    return (
    <>
        <button onClick={enviarPeticion}>Enviar</button>
        <div>
            <h1>Lista de Transacciones</h1>
            <p>Más recientes primero</p>
            <ul>
                {transactionsData.map((transaction, index) => (
                    <li key={index}>
                        <a href={`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`}>{transaction.transactionHash} </a>
                    </li>
                ))}
            </ul>
        </div>
    </>
    );
};