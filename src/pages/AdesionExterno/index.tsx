import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Tabela from "../../components/TabelaAdesionExterno";
import Logo from "../../images/afrafep.png";
// Interface para os dados dos dependentes
interface Dependent {
  nome: string;
  dataNascimento: string;
  estadoCivil: string;
  cpf: string;
  rg: string;
  cartaoSus: string;
  sexoDependent: string;
  nomeMae: string;
  parentesco: string;
  telefones: string;
  email: string;
}

// Interface para as props do componente SelectionOption
interface SelectionOptionProps {
  value: string;
  label: string;
  children: React.ReactNode;
}

function App() {
  // Estado para armazenar o nome do titular, buscando do localStorage
  const [titular, setTitular] = useState<string>(() => {
    return localStorage.getItem("Titular") || "";
  });

  // Estado para a opção de adesão (B ou C), buscando do localStorage
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(() => {
    const storedOption = localStorage.getItem("opcaoSelecionada");
    if (storedOption === null) {
      localStorage.setItem("opcaoSelecionada", "B");
      return "B";
    }
    return storedOption;
  });

  // Atualiza o estado e o localStorage quando o nome do titular muda
  const handleTitularChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoTitular = event.target.value;
    setTitular(novoTitular);
    localStorage.setItem("Titular", novoTitular);
  };

  // Atualiza a opção de adesão selecionada
  const handleOpcaoChange = (value: string) => {
    setOpcaoSelecionada(value);
    localStorage.setItem("opcaoSelecionada", value);
  };

  // Componente reutilizável para as opções de seleção com tipagem explícita
  const SelectionOption = ({
    value,
    label,
    children,
  }: SelectionOptionProps) => (
    <div
      onClick={() => handleOpcaoChange(value)}
      className={`
        p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start space-x-4
        ${
          opcaoSelecionada === value
            ? "border-sky-500 bg-sky-50 shadow-md"
            : "border-gray-300 bg-white hover:border-sky-400 hover:bg-sky-50/50"
        }
      `}
    >
      {/* Círculo de seleção personalizado */}
      <div
        className={`
        flex-shrink-0 w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center
        ${
          opcaoSelecionada === value
            ? "border-sky-600 bg-sky-600"
            : "border-gray-400"
        }
      `}
      >
        {opcaoSelecionada === value && (
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
        )}
      </div>
      {/* Texto da opção */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{label}</span>
        <p className="text-sm text-gray-600">{children}</p>
      </div>
    </div>
  );

  return (
    // Container principal da página com fundo cinza claro
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      {/* Card principal com conteúdo */}
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
          <img src={Logo} alt="" className="mb-4" />
          Termo de Adesão ao Plano de Saúde
        </h1>
        <div className="flex flex-row gap-6 mb-10">
          <SelectionOption value="B" label="Adesão Individual">
            <span className="text-black">
              Quero solicitar apenas a minha adesão ao plano de saúde.
            </span>
          </SelectionOption>
          <SelectionOption value="C" label="Adesão Familiar">
            <span className="text-black">
              Quero solicitar a minha adesão e a dos meus dependentes.
            </span>
          </SelectionOption>
        </div>

        {/* A tabela de dados será renderizada aqui */}
        <Tabela />
      </div>
    </div>
  );
}

export default App;
