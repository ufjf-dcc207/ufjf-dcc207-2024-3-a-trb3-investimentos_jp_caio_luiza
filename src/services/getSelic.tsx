
export async function getSelic(dataFinal: string) {
    const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados";
    const params = new URLSearchParams({
        formato: "json",
        dataInicial: "01/03/2025",
        dataFinal: dataFinal
    });

    try {
        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();

        const resultado = data.find((item: { data: string; valor: string}) => item.data === dataFinal);

        if (resultado) {
            return resultado.valor;
        }
        
        return null;

    } catch (error) {
        console.error("Erro ao buscar taxa Selic:", error);
        return null;
    }
}