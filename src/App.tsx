import Footer from './components/Footer'
import Navbar from './components/Navbar';
import Resumo from './Resumo_investimentos/Resumo';

export default function App() {
  return (
    <div className="app"> 
      <Navbar />
      <Resumo valorInvestido={1000} valorTotal={1100} valorImposto={0.10}/>
      <Footer />
    </div>
  );
}