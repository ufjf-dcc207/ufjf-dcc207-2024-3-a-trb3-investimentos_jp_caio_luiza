import { useState } from 'react'
import './Calculadora.css'


export default function Calculadora() {

    const [investimentoInicial, setInvestimentoInicial] = useState(0);
    const [investimentoMensal, setInvestimentoMensal] = useState(0);
    const [periodoMeses, setPeriodoAnos] = useState(0);
    const [rendimentoAnual, setRendimentoAnual] = useState(0);
    const [valorInvestido, setValorInvestido] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);

    const imposto = 0.1;
    
    function calcularTotal() {

        // i = taxa de juros mensal
        const i = Math.pow( 1 + (rendimentoAnual / 100.00), 1/12) - 1;

        // facilita organizacao formula
        const t = periodoMeses;

        // calcula o montante do dinheiro no fim do período sem imposto
        const totalSemImposto = (investimentoInicial * Math.pow(1 + i, t)) + investimentoMensal * ((Math.pow(1 + i, t) - 1) / i );

        // soma o valor do aporte inicial com o valor aportado mensalmente
        const valorAportado = (investimentoInicial + (investimentoMensal * t));

        // calcula quanto de fato a aplicação rendeu
        const rendimento = totalSemImposto - valorAportado;

        // calcula o total do dinheiro com impostos descontados
        const total = totalSemImposto - (rendimento * imposto);
        
        setValorTotal(total);

        setValorInvestido(valorAportado);
    }


    return (
        <>
            <div className='calculadora'>
                <h1>Calculadora de investimentos</h1>
                <dl>
                    <dd>Investimento Inicial</dd>
                    <dl>
                        <input type="number" value={investimentoInicial} onChange={(evento)=>{setInvestimentoInicial(evento.target.valueAsNumber)}} />
                    </dl>
                    <dd>Investimento Mensal</dd>
                    <dl>
                        <input type="number" value={investimentoMensal} onChange={(evento)=>{setInvestimentoMensal(evento.target.valueAsNumber)}} />
                    </dl>
                    <dd>Período em meses</dd>
                    <dl>
                        <input type="number" value={periodoMeses} onChange={(evento)=>{setPeriodoAnos(evento.target.valueAsNumber)}} />
                    </dl>
                    <dd>Rendimento anual</dd>
                    <dl>
                        <input type="number" value={rendimentoAnual} onChange={(evento)=>{setRendimentoAnual(evento.target.valueAsNumber)}} />
                    </dl>
                </dl>
                <button onClick={calcularTotal} >Calcular</button>
                <div>
                    <h3>Valor Final Acumulado</h3>
                    <span>R${valorTotal.toFixed(2)}</span>
                </div>
            </div>
        </>
    )
}