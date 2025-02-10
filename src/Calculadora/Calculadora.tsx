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
                <div className='formulario'>
                    <div className='linha1'>
                        <h3>Investimento Inicial</h3>
                        <div className='div-input'>
                            <span>R$</span>
                            <input type="number" value={investimentoInicial} onChange={(evento)=>{setInvestimentoInicial(evento.target.valueAsNumber)}} />
                        </div>
                        <h3>Período</h3>
                        <div className='div-input'>
                            <input type="number" value={periodoMeses} onChange={(evento)=>{setPeriodoAnos(evento.target.valueAsNumber)}} />
                        </div>
                    </div>
                    <div className='linha2'>
                    <h3>Investimento Mensal</h3>
                        <div className='div-input'>
                            <span>R$</span>
                            <input type="number" value={investimentoMensal} onChange={(evento)=>{setInvestimentoMensal(evento.target.valueAsNumber)}} />
                        </div>
                        <h3>Rendimento anual</h3>
                        <div className='div-input'>
                            <input type="number" value={rendimentoAnual} onChange={(evento)=>{setRendimentoAnual(evento.target.valueAsNumber)}} />
                            <span>%</span>
                        </div>
                    </div>
                </div>
                <div className='div-botao'>
                    <button onClick={calcularTotal} className='botao' >Calcular</button>
                </div>
                <div className='resuldado'>
                    <h3 className='valor-final'>Valor Final Acumulado</h3>
                    <span>R${valorTotal.toFixed(2)}</span>
                </div>
            </div>
        </>
    )
}