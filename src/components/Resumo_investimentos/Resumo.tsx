import "./Resumo.css";
import { Investimento } from "../Calculadora/Calculadora";

interface ResumoProps {
    investimentos:  Investimento[];
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
                        {tiposInvestimento.map((_, index) => {
                            const investimento = investimentos[index];

                            return (
                                <td key={index} className="direita">
                                    R$ {investimento ? investimento.valorInvestido.toFixed(2) : "0,00"}
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td>Seu dinheiro renderá</td>
                        {tiposInvestimento.map((_, index) => {
                            const investimento = investimentos[index];
                            const rentabilidade = investimento ? investimento.valorTotalSemImposto - investimento.valorInvestido : 0;
                            return (
                                <td key={index} className="direita">
                                    R$ {rentabilidade.toFixed(2)}
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td>Total Bruto</td>
                        {tiposInvestimento.map((_, index) => {
                            const investimento = investimentos[index];
                            return (
                                <td key={index} className="direita">
                                    R$ {investimento ? investimento.valorTotalSemImposto.toFixed(2) : "0,00"}
                                </td>
                            );
                        })}
                    </tr>
                    <tr>
                        <td>Valor do Imposto</td>
                        {tiposInvestimento.map((_, index) => {
                            const investimento = investimentos[index];
                            const imposto = investimento ? investimento.valorTotalSemImposto - investimento.valorTotalPosImposto : 0;
                            return (
                                <td key={index} className="direita">
                                    R$ {imposto.toFixed(2)}
                                </td>
                            );
                        })}
                    </tr>
                    <tr className="total">
                        <td>Total Líquido</td>
                        {tiposInvestimento.map((_, index) => {
                            const investimento = investimentos[index];
                            return (
                                <td key={index} className="direita">
                                    R$ {investimento ? investimento.valorTotalPosImposto.toFixed(2) : "0,00"}
                                </td>
                            );
                        })}
                    </tr>
                </>
            </tbody>
            </table>
        </div>
    );
}
