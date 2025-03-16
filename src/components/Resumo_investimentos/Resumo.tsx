import "./Resumo.css";

interface ResumoProps {
    valorTotal: number;
    valorInvestido: number;
    valorImposto: number;
}

export default function Resumo({ valorTotal, valorInvestido, valorImposto }: ResumoProps) {
    return (
        <div className="resumo">
            <table className="tabela">
            <caption className="titulo">Resumo do Investimento</caption>
            <tr>
                <td>Dinheiro Investido:</td>
                <td className="direita">{valorInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
            <tr>
                <td>Seu  dinheiro renderá:</td>
                <td className="direita">{((valorTotal - valorInvestido)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
            <tr>
                <td>Total Bruto:</td>
                <td className="direita">{valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
            <tr>
                <td>Valor do Imposto:</td>
                <td className="direita">{(valorImposto * (valorTotal-valorInvestido)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
            <tr className="total">
                <td>Total Líquido:</td>
                <td className="direita">{(valorTotal-(valorImposto * (valorTotal-valorInvestido))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
            </table>
        </div>
    );
}
