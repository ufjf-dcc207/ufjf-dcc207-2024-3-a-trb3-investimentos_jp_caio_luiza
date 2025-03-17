import "./Resumo.css";

interface Investimento {
    tipo: string;
    valorTotal: number;
    valorInvestido: number;
    valorImposto: number;
}

interface ResumoProps {
    investimentos: Investimento[];
}

export default function Resumo({ investimentos = [] }: ResumoProps) {
    const tiposInvestimento = ["CDB", "Tesouro Selic", "LCI e LCA", "Fundo DI", "Tesouro IPCA"];

    return (
        <div className="resumo">
            <table className="tabela">
            <caption className="titulo">Resumo dos Investimentos</caption>
            <thead>
                <tr>
                    <th>Tipo de Investimento</th>
                    {tiposInvestimento.map((tipo, index) => (
                        <th key={index}>{tipo}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <>
                    <tr>
                        <td>Dinheiro Investido</td>
                        {tiposInvestimento.map((_, index) => (
                            <td key={index} className="direita">R$ 0,00</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Seu dinheiro renderá</td>
                        {tiposInvestimento.map((_, index) => (
                            <td key={index} className="direita">R$ 0,00</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Total Bruto</td>
                        {tiposInvestimento.map((_, index) => (
                            <td key={index} className="direita">R$ 0,00</td>
                        ))}    
                    </tr>
                    <tr>
                        <td>Valor do Imposto</td>
                        {tiposInvestimento.map((_, index) => (
                            <td key={index} className="direita">R$ 0,00</td>
                        ))}
                    </tr>
                    <tr className="total">
                        <td>Total Líquido</td>
                        {tiposInvestimento.map((_, index) => (
                            <td key={index} className="direita">R$ 0,00</td>
                        ))}
                    </tr>
                </>
            </tbody>
            </table>
        </div>
    );
}
