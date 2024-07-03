export const requestNewDocumentSunat = async (body: any) => {
    const newDocumentBoleta = await fetch("https://back.apisunat.com/personas/v1/sendBill", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!newDocumentBoleta.ok) throw new Error("ERROR EN SUNAT");
    return newDocumentBoleta.json();
}

export const statusNewDocument = async (documentId: string) => {
    const response = await fetch(`https://back.apisunat.com/documents/${documentId}/getById`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    if (!response.ok) throw new Error("ERROR EN ESTADO DE DOCUMENTO");
    return response.json();
}