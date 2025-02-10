import { useState } from 'react'
import './Calculadora.css'


export default function Calculadora() {

    const [investimentoInicial, setInvestimentoInicial] = useState(0);
    const [investimentoMensal, setInvestimentoMensal] = useState(0);
    const [periodoAnos, setPeriodoAnos] = useState(0);
    const [rendimentoAnual, setRendimentoAnual] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    
    function calcularTotal() {

        const i = rendimentoAnual / 100;

        const resultado = investimentoInicial * Math.pow(1 + i, periodoAnos) + investimentoMensal * (Math.pow(1 + i, periodoAnos) / i );

        setValorTotal(resultado);
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
                    <dd>Período em anos</dd>
                    <dl>
                        <input type="number" value={periodoAnos} onChange={(evento)=>{setPeriodoAnos(evento.target.valueAsNumber)}} />
                    </dl>
                    <dd>Rendimento anual</dd>
                    <dl>
                        <input type="number" value={rendimentoAnual} onChange={(evento)=>{setRendimentoAnual(evento.target.valueAsNumber)}} />
                    </dl>
                </dl>
                <button onClick={calcularTotal} >Calcular</button>
            </div>
        </>
    )
}