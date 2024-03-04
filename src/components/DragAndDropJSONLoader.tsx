import React, { useState } from 'react';

interface DragAndDropJSONLoaderProps {
    onLoadDocument: (document: any) => void; // Acepta una función que toma el documento cargado
  }

  const DragAndDropJSONLoader: React.FC<DragAndDropJSONLoaderProps> = ({ onLoadDocument }) => {
  const [jsonContent, setJsonContent] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            const content = ev.target.result as string;
            setJsonContent(content);
            onLoadDocument(JSON.parse(content));
          }
        };
        reader.readAsText(file);
      } else {
        alert("Por favor, carga un archivo JSON.");
      }
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #000',
        padding: '20px',
        width: '80%',
        margin: '20px auto',
      }}
    >
      {jsonContent ? (
        <pre>{jsonContent}</pre>
      ) : (
        <p>Arrastra y suelta aquí un archivo JSON para cargar su contenido.</p>
      )}
    </div>
  );
};

export default DragAndDropJSONLoader;
