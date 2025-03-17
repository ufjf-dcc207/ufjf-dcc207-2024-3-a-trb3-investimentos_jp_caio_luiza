

export async function getIpca(dataFinal: string) {
    const url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados";
    const params = new URLSearchParams({
        formato: "json",
        dataInicial: "01/02/2025",
        dataFinal: dataFinal
    });

    try {
        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const ultimoValor = data[data.length - 1].valor;

        console.log(ultimoValor);

        if (ultimoValor) {
            return ultimoValor;
        }
        
        return null;

    } catch (error) {
        console.error("Erro ao buscar o IPCA:", error);
        return null;
    }
}