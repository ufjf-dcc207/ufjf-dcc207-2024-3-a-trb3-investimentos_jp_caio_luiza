import Calculadora from './components/Calculadora/Calculadora';
import Footer from './components/Footer'
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Calculadora />
      <Footer />
    </div>
  );
}