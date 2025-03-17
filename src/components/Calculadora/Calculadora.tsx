import { useEffect, useRef, useState, useReducer } from 'react'
import './Calculadora.css'
import Resumo from '../Resumo_investimentos/Resumo';
import { getSelic } from '../../services/getSelic';
import { getCdi } from '../../services/getCdi';
import { getIpca } from '../../services/getIpca';


export type Investimento = {
    tipo: string;
    valorInvestido: number;
    valorTotalSemImposto: number;
    valorTotalPosImposto: number;
};

type Estado = {
    cdb: Investimento;
    tesouroSelic: Investimento;
    lciLca: Investimento;
    fundoDi: Investimento;
    tesouroIpca: Investimento;
};

const initialState: Estado = {
    cdb: { tipo: "CDB", valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 },
    tesouroSelic: { tipo: "cdb", valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 },
    lciLca: { tipo: "cdb", valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 },
    fundoDi: { tipo: "cdb", valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 },
    tesouroIpca: { tipo: "cdb", valorInvestido: 0, valorTotalSemImposto: 0, valorTotalPosImposto: 0 },
};

type Acao =
    | { type: 'SET_INVESTIMENTO'; investimento: keyof Pick<Estado, 'cdb' | 'tesouroSelic' | 'lciLca' | 'fundoDi' | 'tesouroIpca'>; payload: Investimento }

function reducer(state: Estado, action: Acao): Estado {
        switch (action.type) {
            case 'SET_INVESTIMENTO':
                return { ...state, [action.investimento]: action.payload };
            default:
                return state;
        }
    }

export default function Calculadora() {
    const [estado, dispatch] = useReducer(reducer, initialState);

    const selic = useRef(0);
    const cdi = useRef(0);
    const ipca = useRef(0);

    const [investimentoInicial, setInvestimentoInicial] = useState(0);
    const [investimentoMensal, setInvestimentoMensal] = useState(0);
    const [periodoMeses, setPeriodoAnos] = useState(0);
    const [rentabilidadeCdb, setRentabilidadeCdb] = useState(0);
    const [rentabilidadeFundoDi, setRentabilidadeFundoDi] = useState(0);
    const [rentabilidadeLciLca, setRentabilidadeLciLca] = useState(0);
    const [juroRealIpca, setJuroRealIpca] = useState(0);
    
    function calcularTotal(taxa: number, imposto: number) {

        // i = taxa de juros mensal
        const i = Math.pow( 1 + (taxa / 100), 1/12) - 1;

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

    function calculaInvestimento(tipo: keyof Estado, taxaReal: number, imposto: number) {
        const total = calcularTotal(taxaReal, imposto);

        dispatch({
            type: 'SET_INVESTIMENTO',
            investimento: tipo,
            payload: {
                tipo,
                valorInvestido: total.totalAportado,
                valorTotalSemImposto: total.semImposto,
                valorTotalPosImposto: total.comImposto
            }
        });
    }

    function calculoInvestimentos() {
        calculaInvestimento('cdb', cdi.current * (rentabilidadeCdb / 100), 0.1);
        calculaInvestimento('tesouroSelic', selic.current, 0.1);
        calculaInvestimento('lciLca', cdi.current * (rentabilidadeLciLca / 100), 0);
        calculaInvestimento('fundoDi', cdi.current * (rentabilidadeFundoDi / 100), 0.1);
        calculaInvestimento('tesouroIpca', ipca.current + juroRealIpca, 0.1);
    }
    
    //testes
        const investimentos = [
            { tipo: "CDB", valorInvestido: estado.cdb.valorInvestido, valorTotal: estado.cdb.valorTotalSemImposto, valorImposto: estado.cdb.valorTotalSemImposto - estado.cdb.valorTotalPosImposto },
            { tipo: "Tesouro Selic", valorInvestido: estado.tesouroSelic.valorInvestido, valorTotal: estado.tesouroSelic.valorTotalSemImposto, valorImposto: estado.tesouroSelic.valorTotalSemImposto - estado.tesouroSelic.valorTotalPosImposto },
            { tipo: "LCI/LCA", valorInvestido: estado.lciLca.valorInvestido, valorTotal: estado.lciLca.valorTotalSemImposto, valorImposto: estado.lciLca.valorTotalSemImposto - estado.lciLca.valorTotalPosImposto },
            { tipo: "Fundo DI", valorInvestido: estado.fundoDi.valorInvestido, valorTotal: estado.fundoDi.valorTotalSemImposto, valorImposto: estado.fundoDi.valorTotalSemImposto - estado.fundoDi.valorTotalPosImposto },
            { tipo: "Tesouro IPCA", valorInvestido: estado.tesouroIpca.valorInvestido, valorTotal: estado.tesouroIpca.valorTotalSemImposto, valorImposto: estado.tesouroIpca.valorTotalSemImposto - estado.tesouroIpca.valorTotalPosImposto }
        ];
        console.log("Detalhes dos Investimentos:");
        investimentos.forEach((investimento, index) => {
        console.log(`Investimento ${index + 1}:`);
        console.log(`Tipo: ${investimento.tipo}`);
        console.log(`Valor Investido: ${investimento.valorInvestido}`);
        console.log(`Valor Total: ${investimento.valorTotal}`);
        console.log(`Valor Imposto: ${investimento.valorImposto}`);
        console.log("----------------------");
    });

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
            </div>
            <Resumo 
                investimentos={[
                    { tipo: "CDB", valorInvestido: estado.cdb.valorInvestido, valorTotalSemImposto: estado.cdb.valorTotalSemImposto, valorTotalPosImposto: estado.cdb.valorTotalPosImposto },
                    { tipo: "Tesouro Selic", valorInvestido: estado.tesouroSelic.valorInvestido, valorTotalSemImposto: estado.tesouroSelic.valorTotalSemImposto, valorTotalPosImposto: estado.tesouroSelic.valorTotalPosImposto },
                    { tipo: "LCI/LCA", valorInvestido: estado.lciLca.valorInvestido, valorTotalSemImposto: estado.lciLca.valorTotalSemImposto, valorTotalPosImposto: estado.lciLca.valorTotalPosImposto },
                    { tipo: "Fundo DI", valorInvestido: estado.fundoDi.valorInvestido, valorTotalSemImposto: estado.fundoDi.valorTotalSemImposto, valorTotalPosImposto: estado.fundoDi.valorTotalPosImposto },
                    { tipo: "Tesouro IPCA", valorInvestido: estado.tesouroIpca.valorInvestido, valorTotalSemImposto: estado.tesouroIpca.valorTotalSemImposto, valorTotalPosImposto: estado.tesouroIpca.valorTotalPosImposto }
                ]}
            />
        </div>
    )
}