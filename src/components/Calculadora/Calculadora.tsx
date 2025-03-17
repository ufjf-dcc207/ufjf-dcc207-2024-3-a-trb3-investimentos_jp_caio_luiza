import { useEffect, useRef, useState } from 'react'
import './Calculadora.css'
import Resumo from '../Resumo_investimentos/Resumo';
import { getSelic } from '../../services/getSelic';
import { getCdi } from '../../services/getCdi';
import { getIpca } from '../../services/getIpca';


export default function Calculadora() {

    const selic = useRef(0);
    const cdi = useRef(0);
    const ipca = useRef(0);

    const [investimentoInicial, setInvestimentoInicial] = useState(0);
    const [investimentoMensal, setInvestimentoMensal] = useState(0);
    const [periodoMeses, setPeriodoAnos] = useState(0);
    const [rentabilidadeCdb, setRentabilidadeCdb] = useState(0);
    const [rentabilidadeFundoDi, setRentabilidadeFundoDi] = useState(0);
    // const [rentabilidadeTesouroSelic, setRentabilidadeTesouroSelic] = useState(0);
    const [rentabilidadeLciLca, setRentabilidadeLciLca] = useState(0);
    const [juroRealIpca, setJuroRealIpca] = useState(0);

    // Estados para armazenar os valores calculados
    const [cdb, setCdb] = useState({ valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 });
    const [tesouroSelic, setTesouroSelic] = useState({ valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 });
    const [lciLca, setLciLca] = useState({ valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 });
    const [fundoDi, setFundoDi] = useState({ valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 });
    const [tesouroIpca, setTesouroIpca] = useState({ valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 });

    
    function calcularTotal(taxa: number, imposto: number) {

        // i = taxa de juros mensal
        const i = Math.pow( 1 + taxa, 1/12) - 1;

        // facilita organizacao formula
        const t = periodoMeses;

        // calcula o montante do dinheiro no fim do período sem imposto
        const totalSemImposto = (investimentoInicial * Math.pow(1 + i, t)) + investimentoMensal * ((Math.pow(1 + i, t) - 1) / i );

        // soma o valor do aporte inicial com o valor aportado mensalmente
        const valorAportado = (investimentoInicial + (investimentoMensal * t));

        // calcula quanto de fato a aplicação rendeu
        const rendimento = totalSemImposto - valorAportado;

        // calcula o total do dinheiro com impostos descontados
        const totalComImposto = totalSemImposto - (rendimento * imposto);

        return {
            semImposto: totalSemImposto,
            comImposto: totalComImposto,
            totalAportado: valorAportado
        };

        // getCdi("13/03/2025");
        // getSelic("18/03/2025");
        // getIpca("18/03/2025");
    }

    function getDataAtualFormatada() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }

    useEffect(() => {
        const dataAtual = getDataAtualFormatada();

        async function buscarTaxas() {
            selic.current = await getSelic(dataAtual);
            cdi.current = await getCdi(dataAtual);
            ipca.current = await getIpca(dataAtual);
        }

        buscarTaxas();
    }, []);

    function calculaCdb() {

        const taxaReal = cdi.current * (rentabilidadeCdb / 100);

        const total = calcularTotal(taxaReal, 0.1);

        setCdb({
            valorInvestido: total.totalAportado,
            valorTotalSemImposto: total.semImposto,
            valorTotalPosImposto: total.comImposto
          });
    }

    function calculaTesouroSelic() {

        const taxaReal = selic.current;

        const total = calcularTotal(taxaReal, 0.1);

        setTesouroSelic({
            valorInvestido: total.totalAportado,
            valorTotalSemImposto: total.semImposto,
            valorTotalPosImposto: total.comImposto
          });
    }
    
    function calculaLciLca() {

        const taxaReal = cdi.current * (rentabilidadeLciLca / 100);

        const total = calcularTotal(taxaReal, 0);

        setLciLca({
            valorInvestido: total.totalAportado,
            valorTotalSemImposto: total.semImposto,
            valorTotalPosImposto: total.comImposto
          });
    }

    function calculaTesouroIpca() {

        const taxaReal = ipca.current + juroRealIpca;

        const total = calcularTotal(taxaReal, 0.1);

        setTesouroIpca({
            valorInvestido: total.totalAportado,
            valorTotalSemImposto: total.semImposto,
            valorTotalPosImposto: total.comImposto
          });
    }

    function calculaFundoDI() {

        const taxaReal = ipca.current * (rentabilidadeFundoDi / 100);

        const total = calcularTotal(taxaReal, 0.1);

        setFundoDi({
            valorInvestido: total.totalAportado,
            valorTotalSemImposto: total.semImposto,
            valorTotalPosImposto: total.comImposto
          });
    }

    function calculoInvestimentos() {
        calculaCdb();
        calculaTesouroSelic();
        calculaLciLca();
        calculaFundoDI();
        calculaTesouroIpca();
    }

    return (
        <div className='pagina'>
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
                        <h3>Juro real do Tesouro IPCA</h3>
                        <div className='div-input'>
                            <input type="number" value={juroRealIpca} onChange={(evento)=>{setJuroRealIpca(evento.target.valueAsNumber)}} />
                            <span>%</span>
                        </div>
                        <h3>Rentabilidade da LCI/LCA</h3>
                        <div className='div-input'>
                            <input type="number" value={rentabilidadeLciLca} onChange={(evento)=>{setRentabilidadeLciLca(evento.target.valueAsNumber)}} />
                            <span>%</span>
                        </div>
                    </div>
                    <div className='linha2'>
                    <h3>Investimento Mensal</h3>
                        <div className='div-input'>
                            <span>R$</span>
                            <input type="number" value={investimentoMensal} onChange={(evento)=>{setInvestimentoMensal(evento.target.valueAsNumber)}} />
                        </div>
                        <h3>Rentabilidade do CDB</h3>
                        <div className='div-input'>
                            <input type="number" value={rentabilidadeCdb} onChange={(evento)=>{setRentabilidadeCdb(evento.target.valueAsNumber)}} />
                            <span>%</span>
                        </div>
                        <h3>Rentabilidade do Fundo DI</h3>
                        <div className='div-input'>
                            <input type="number" value={rentabilidadeFundoDi} onChange={(evento)=>{setRentabilidadeFundoDi(evento.target.valueAsNumber)}} />
                            <span>%</span>
                        </div>
                        <div className='div-botao'>
                            <button onClick={calculoInvestimentos} className='botao' >Calcular</button>
                        </div>
                    </div>
                </div>
                {/*<div className='resultado'>
                    <h3 className='valor-final'>Valor Final</h3>
                    <span>R${valorTotalPosImposto.toFixed(2)}</span>
                </div> */}
            </div>
            <Resumo valorInvestido={valorInvestido} valorTotal={valorTotalSemImposto} valorImposto={imposto}/>
        </div>
    )
}