import { ComponentProps } from "react";
import { FunctionComponentWithChildren } from "./types";

export const combineContextProviders = (
  contextProviders: FunctionComponentWithChildren[],
) => {
  return contextProviders.reduce(
    (AccumulatedContextProvider, CurrentContextProvider) => {
      return ({ children }) => {
        return (
          <AccumulatedContextProvider>
            <CurrentContextProvider>{children}</CurrentContextProvider>
          </AccumulatedContextProvider>
        );
      };
    },
    ({ children }: ComponentProps<FunctionComponentWithChildren>) => (
      <>{children}</>
    ),
  );
};

export function transformDocument(originalDocument: any) {
  try {
    // Extraer los datos originales
    const { version, data, signature } = originalDocument;
    console.log("1");
    console.log(originalDocument);
    console.log(version);
    // Transformar la sección de $template
    const template = {
      name: data.$template.name.split(":")[2],
      type: data.$template.type.split(":")[2],
      url: getUrlFromString(data.$template.url),
    };

    // Transformar la sección de issuers
    const issuers = data.issuers.map(issuer => ({
      name: issuer.name.split(":")[2],
      documentStore: issuer.documentStore.split(":")[2],
      identityProof: {
        type: issuer.identityProof.type.split(":")[2],
        location: issuer.identityProof.location.split(":")[2],
      },
    }));

    // Construir el nuevo documento
    const transformedDocument = {

        $template: template,
        issuers,
        names: data.names.split(":")[2],
        lastNames: data.lastNames.split(":")[2],
        faculty: data.faculty.split(":")[2],
        academicPeriod: data.academicPeriod.split(":")[2],
        enrollmentDate: data.enrollmentDate.split(":")[2],
      
    };

    return transformedDocument;
  } catch (error) {
    alert('Error: '+error);
  }
}

function getUrlFromString(str) {
  const regex = /https?:\/\/[^\s]+/;
  const match = str.match(regex);
  return match ? match[0] : null;
}