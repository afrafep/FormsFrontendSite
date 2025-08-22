import React, { useEffect, useState } from "react";
import "./styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";

interface Dependent {
  nome: string;
  dataNascimento: string;
  estadoCivil: string;
  cpf: string;
  rg: string;
  uf_rg: string;
  uf_emissor_rg: string;
  cartaoSus: string;
  sexoDependent: string;
  nomeMae: string;
  parentesco: string;
  telefones: string;
  email: string;
}

interface Beneficiario {
  beneficiario_matricula: string;
  CD_BENEFICIARIO: string;
  beneficiario_nome: string;
  beneficiario_cpf: string;
  DT_NASCIMENTO: string;
  CD_CNS: string;
  NM_MAE: string;
  CELULAR: string;
  EMAIL: string;
  CD_FORMA_PAGAMENTO: string;
  DS_TIPO_DEPENDENTE: string;
  CD_PLANO_INTERNO: string;
  DS_SITUACAO_BENEFICIARIO: string;
  codigo: string;
  matricula: string;
  nome: string;
  dtNascimento: string;
  cns: string;
  nmMae: string;
  celular: string;
  telefone: string;
  email: string;
  sexo: string;
  rg: string;
  orgaoRg: string;
  formaEnvio: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  bairro: string;
  uf: string;
  cep: string;
  formaPagamento: string;
  tipoDependente: string;
  planoInterno: string;
  situacao: string;
}

// Interfaces para erros de validação
interface ValidationErrors {
  titular?: string;
  dtNascimento?: string;
  estadoCivil?: string;
  cpf?: string;
  rg?: string;
  uf_rg?: string;
  uf_emissor_rg?: string;
  cartaosus?: string;
  matricula?: string;
  nomeMae?: string;
  endereco?: string;
  numeroCasa?: string;
  complement?: string;
  bairro?: string;
  cidade?: string;
  cidade_uf?: string;
  cep?: string;
  telefones?: string;
  email?: string;
  portabilidade?: string;
  sexoTitular?: string;
  pagamento?: string;
  envioBoleto?: string;
  agencia?: string;
  conta?: string;
  banco?: string;
}

interface DependentValidationErrors {
  [index: number]: {
    nome?: string;
    dataNascimento?: string;
    estadoCivil?: string;
    cpf?: string;
    rg?: string;
    uf_rg?: string;
    uf_emissor_rg?: string;
    cartaoSus?: string;
    sexoDependent?: string;
    nomeMae?: string;
    parentesco?: string;
    telefones?: string;
    email?: string;
  };
}

const Tabela: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  // Estados para os campos do formulário
  const [titular, setTitular] = useState(() => {
    return localStorage.getItem("Titular") || "";
  });
  const [dtNascimento, setDtNascimento] = useState(() => {
    return localStorage.getItem("Data de Nascimento") || "";
  });
  const [estadoCivil, setEstadoCivil] = useState<string>(() => {
    return localStorage.getItem("Estado Civil") || "";
  });
  const [cpf, setCpf] = useState(() => {
    return localStorage.getItem("CPF") || "";
  });
  const [rg, setRg] = useState(() => {
    return localStorage.getItem("RG") || "";
  });
  const [cartaosus, setCartaoSus] = useState(() => {
    return localStorage.getItem("Cartão do SUS") || "";
  });
  const [matricula, setMatricula] = useState(() => {
    return localStorage.getItem("Matricula") || "";
  });
  const [nomeMae, setNomeMae] = useState(() => {
    return localStorage.getItem("Nome da Mãe") || "";
  });
  const [endereco, setEndereco] = useState(() => {
    return localStorage.getItem("Endereço") || "";
  });
  const [numeroCasa, setNumeroCasa] = useState(() => {
    return localStorage.getItem("Número da Casa") || "";
  });
  const [complement, setComplement] = useState(() => {
    return localStorage.getItem("Complemento") || "";
  });
  const [bairro, setBairro] = useState(() => {
    return localStorage.getItem("Bairro") || "";
  });
  const [cidade, setCidade] = useState(() => {
    return localStorage.getItem("Cidade") || "";
  });
  const [cidade_uf, setCidade_Uf] = useState(() => {
    return localStorage.getItem("UF") || "";
  });
  const [cep, setCep] = useState(() => {
    return localStorage.getItem("CEP") || "";
  });
  const [telefones, setTelefones] = useState(() => {
    return localStorage.getItem("Telefones") || "";
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("Email") || "";
  });
  const [portabilidade, setPortabilidade] = useState(() => {
    return localStorage.getItem("Portabilidade") || "";
  });
  const [sexoTitular, setSexoTitular] = useState(() => {
    return localStorage.getItem("Sexo Titular") || "M";
  });
  const [dependents, setDependents] = useState<Dependent[]>(() => {
    const savedDependents = localStorage.getItem("dependents");
    return savedDependents ? JSON.parse(savedDependents) : [];
  });
  const [envioBoleto, setEnvioBoleto] = useState(() => {
    return localStorage.getItem("EnvioBoleto") || "";
  });
  const [pagamento, setPagamento] = useState(() => {
    return localStorage.getItem("Pagamento") || "";
  });
  const [agencia, setAgencia] = useState(() => {
    return localStorage.getItem("Agencia") || "";
  });
  const [conta, setConta] = useState(() => {
    return localStorage.getItem("Conta") || "";
  });
  const [banco, setBanco] = useState(() => {
    return localStorage.getItem("Banco") || "";
  });
  const [uf_rg, setUf_rg] = useState(() => {
    return localStorage.getItem("UF_RG") || "";
  });
  const [uf_emissor_rg, setUf_Emissor_rg] = useState(() => {
    return localStorage.getItem("Emissor do RG") || "";
  });
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(() => {
    return localStorage.getItem("opcaoSelecionada") || "";
  });

  // Estados para erros de validação
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [dependentErrors, setDependentErrors] =
    useState<DependentValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const opcaoSelecionada2 = localStorage.getItem("opcaoSelecionada");

  // Atualiza o localStorage sempre que a opção mudar
  useEffect(() => {
    if (opcaoSelecionada) {
      localStorage.setItem("opcaoSelecionada", opcaoSelecionada);
    }
  }, [opcaoSelecionada]);

  // Opcional: se quiser garantir que ao carregar, puxe do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("opcaoSelecionada");
    if (stored) setOpcaoSelecionada(stored);
  }, []);

  // Funções de validação
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const validateDate = (date: string): boolean => {
    if (!date) return false;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const inputDate = new Date(date);
    const today = new Date();

    // Verifica se a data é válida e não é no futuro
    return (
      inputDate instanceof Date &&
      !isNaN(inputDate.getTime()) &&
      inputDate <= today
    );
  };

  const validatePhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\D/g, "");
    return cleanedPhone.length >= 10 && cleanedPhone.length <= 11;
  };

  const validateCEP = (cep: string): boolean => {
    const cleanedCEP = cep.replace(/\D/g, "");
    return cleanedCEP.length === 8;
  };

  const validateRG = (rg: string): boolean => {
    const cleanedRG = rg.replace(/\D/g, "");
    return cleanedRG.length >= 5; // RG geralmente tem entre 7-10 dígitos, mas pode variar
  };

  const validateCartaoSUS = (cartao: string): boolean => {
    const cleanedCartao = cartao.replace(/\D/g, "");
    return cleanedCartao.length === 15;
  };

  // Função para validar todos os campos do titular
  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!titular.trim()) newErrors.titular = "Nome completo é obrigatório";

    if (!validateDate(dtNascimento))
      newErrors.dtNascimento = "Data de nascimento inválida";

    if (!estadoCivil.trim())
      newErrors.estadoCivil = "Estado civil é obrigatório";

    if (!validateCPF(cpf)) newErrors.cpf = "CPF inválido";

    if (!validateRG(rg)) newErrors.rg = "RG inválido";

    if (!uf_rg.trim()) newErrors.uf_rg = "UF do RG é obrigatório";

    if (!uf_emissor_rg.trim())
      newErrors.uf_emissor_rg = "Órgão emissor do RG é obrigatório";

    if (!validateCartaoSUS(cartaosus))
      newErrors.cartaosus = "Cartão SUS deve ter 15 dígitos";

    if (!matricula.trim()) newErrors.matricula = "Matrícula é obrigatória";

    if (!nomeMae.trim()) newErrors.nomeMae = "Nome da mãe é obrigatório";

    if (!endereco.trim()) newErrors.endereco = "Endereço é obrigatório";

    if (!numeroCasa.trim()) newErrors.numeroCasa = "Número é obrigatório";

    if (!bairro.trim()) newErrors.bairro = "Bairro é obrigatório";

    if (!cidade.trim()) newErrors.cidade = "Cidade é obrigatória";

    if (!cidade_uf.trim()) newErrors.cidade_uf = "UF é obrigatória";

    if (!validateCEP(cep)) newErrors.cep = "CEP inválido";

    if (!validatePhone(telefones)) newErrors.telefones = "Telefone inválido";

    if (!validateEmail(email)) newErrors.email = "E-mail inválido";

    if (!portabilidade.trim())
      newErrors.portabilidade = "Portabilidade é obrigatória";

    if (!sexoTitular.trim()) newErrors.sexoTitular = "Sexo é obrigatório";

    if (pagamento === "DEBITO") {
      if (!banco.trim())
        newErrors.banco = "Banco é obrigatório para débito em conta";
      if (!agencia.trim())
        newErrors.agencia = "Agência é obrigatória para débito em conta";
      if (!conta.trim())
        newErrors.conta = "Conta é obrigatória para débito em conta";
    }

    if (!envioBoleto.trim())
      newErrors.envioBoleto = "Forma de envio do boleto é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para validar um dependente específico
  const validateDependent = (index: number): boolean => {
    const dependent = dependents[index];
    const newErrors: DependentValidationErrors = { ...dependentErrors };

    if (!dependent) return false;

    newErrors[index] = {};

    if (!dependent.nome.trim())
      newErrors[index].nome = "Nome completo é obrigatório";

    if (!validateDate(dependent.dataNascimento))
      newErrors[index].dataNascimento = "Data de nascimento inválida";

    if (!dependent.estadoCivil.trim())
      newErrors[index].estadoCivil = "Estado civil é obrigatório";

    if (!validateCPF(dependent.cpf)) newErrors[index].cpf = "CPF inválido";

    if (!validateRG(dependent.rg)) newErrors[index].rg = "RG inválido";

    if (!dependent.uf_rg.trim())
      newErrors[index].uf_rg = "UF do RG é obrigatório";

    if (!dependent.uf_emissor_rg.trim())
      newErrors[index].uf_emissor_rg = "Órgão emissor do RG é obrigatório";

    if (dependent.cartaoSus && !validateCartaoSUS(dependent.cartaoSus)) {
      newErrors[index].cartaoSus = "Cartão SUS deve ter 15 dígitos";
    }

    if (!dependent.sexoDependent.trim())
      newErrors[index].sexoDependent = "Sexo é obrigatório";

    if (!dependent.nomeMae.trim())
      newErrors[index].nomeMae = "Nome da mãe é obrigatório";

    if (!dependent.parentesco.trim())
      newErrors[index].parentesco = "Parentesco é obrigatório";

    if (dependent.telefones && !validatePhone(dependent.telefones)) {
      newErrors[index].telefones = "Telefone inválido";
    }

    if (dependent.email && !validateEmail(dependent.email)) {
      newErrors[index].email = "E-mail inválido";
    }

    setDependentErrors(newErrors);
    return Object.keys(newErrors[index] || {}).length === 0;
  };

  // Função para validar todos os dependentes
  const validateAllDependents = (): boolean => {
    let allValid = true;
    dependents.forEach((_, index) => {
      if (!validateDependent(index)) {
        allValid = false;
      }
    });
    return allValid;
  };

  // Função para verificar se o formulário completo é válido
  useEffect(() => {
    const titularValid = validateAllFields();
    const dependentsValid = validateAllDependents();
    setIsFormValid(titularValid && dependentsValid);
  }, [
    titular,
    dtNascimento,
    estadoCivil,
    cpf,
    rg,
    uf_rg,
    uf_emissor_rg,
    cartaosus,
    matricula,
    nomeMae,
    endereco,
    numeroCasa,
    complement,
    bairro,
    cidade,
    cidade_uf,
    cep,
    telefones,
    email,
    portabilidade,
    sexoTitular,
    pagamento,
    envioBoleto,
    agencia,
    conta,
    banco,
    dependents,
  ]);

  // Função para obter a classe do campo com base na validação
  const getFieldClass = (fieldName: keyof ValidationErrors): string => {
    return errors[fieldName] ? "border-red-500" : "border-slate-300";
  };

  // Função para obter a classe do campo do dependente com base na validação
  const getDependentFieldClass = (index: number, fieldName: string): string => {
    if (
      dependentErrors[index] &&
      dependentErrors[index][fieldName as keyof Dependent]
    ) {
      return "border-red-500";
    }
    return "border-slate-300";
  };

  const addDependent = () => {
    setDependents([
      ...dependents,
      {
        nome: "",
        dataNascimento: "",
        estadoCivil: "",
        cpf: "",
        rg: "",
        uf_rg: "",
        uf_emissor_rg: "",
        cartaoSus: "",
        sexoDependent: "",
        nomeMae: "",
        parentesco: "",
        telefones: "",
        email: "",
      },
    ]);
  };

  const DependentRemoved = () => {
    toast.success("Dependente removido com sucesso.", {
      position: "top-center",
      autoClose: 5500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      theme: "dark",
    });
  };

  const DependentInfo = () => {
    toast.info("Remoção cancelada..", {
      position: "top-center",
      autoClose: 5500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      theme: "dark",
    });
  };

  const removeDependent = async (index: number) => {
    const dependentToRemove = dependents[index];

    const result = await Swal.fire({
      title: "Você realmente deseja remover este dependente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      // Verifica se o dependente já foi salvo no banco (tem CPF e RG válidos)
      const isSaved =
        dependentToRemove.cpf &&
        dependentToRemove.cpf.length >= 11 &&
        dependentToRemove.rg &&
        dependentToRemove.rg.length >= 5;

      if (isSaved) {
        try {
          // Só tenta excluir via API se o dependente já foi salvo
          const response = await fetch(
            `https://api.afrafepsaude.com.br/forms/adesao/${dependentToRemove.cpf}/${dependentToRemove.rg}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const newDependents = dependents.filter((_, i) => i !== index);
            setDependents(newDependents);
            DependentRemoved();
          } else {
            const errorData = await response.json();
            Swal.fire({
              icon: "error",
              title: "Erro!",
              text:
                errorData.message || "Não foi possível remover o dependente.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro de conexão com a API.",
          });
        }
      } else {
        // Apenas remove localmente se não foi salvo ainda
        const newDependents = dependents.filter((_, i) => i !== index);
        setDependents(newDependents);
        DependentRemoved();
      }
    } else {
      DependentInfo();
    }
  };

  const handleTitularChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoTitular2 = event.target.value;
    setTitular(novoTitular2);
    validateAllFields();
  };

  const handleDtNascimentoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue2 = event.target.value;
    const dateParts = rawValue2.split("-");
    if (dateParts.length === 3) {
      const year = dateParts[0];
      if (year.length <= 4) {
        setDtNascimento(rawValue2);
        validateAllFields();
      }
    }
  };

  const formatDate = (value: string) => {
    if (value.length <= 8) {
      return value
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2");
    }
    return value;
  };

  const handleEstadoCivilChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const novoEstadoCivil = event.target.value;
    setEstadoCivil(novoEstadoCivil);
    validateAllFields();
  };

  const formatCpf = (value: string) => {
    if (value.length <= 11) {
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleUfRgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoUf_Rg = event.target.value;
    setUf_rg(novoUf_Rg);
    validateAllFields();
  };

  const handleUfEmissorRgChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novo_emissor_rg = event.target.value;
    setUf_Emissor_rg(novo_emissor_rg);
    validateAllFields();
  };

  const handleRgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatRg(rawValue);
    setRg(formattedValue);
    validateAllFields();
  };

  const formatRg = (value: string) => {
    if (value.length <= 9) {
      return value
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleCartaoSusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCartaoSus(rawValue);
    setCartaoSus(formattedValue);
    validateAllFields();
  };

  const formatCartaoSus = (value: string) => {
    return value.substring(0, 15);
  };

  const handleMatriculaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novoMatricula = event.target.value;
    if (/^\d{0,7}$/.test(novoMatricula)) {
      setMatricula(novoMatricula);
      validateAllFields();

      try {
        const response = await axios.get(
          `https://api.afrafepsaude.com.br/forms/adesao/beneficiarios/${novoMatricula}`
        );
      } catch (error) {}
    }
  };

  const handleNomeMaeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoNomeMae = event.target.value;
    setNomeMae(novoNomeMae);
    validateAllFields();
  };

  const handleEnderecoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoEndereco = event.target.value;
    setEndereco(novoEndereco);
    validateAllFields();
  };

  const handleNumeroCasaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novoNumeroCasa = event.target.value;
    setNumeroCasa(novoNumeroCasa);
    validateAllFields();
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const novoCasa = event.target.value;
    setComplement(novoCasa);
    validateAllFields();
  };

  const handleCidadeUfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoBairro = event.target.value;
    setCidade(novoBairro);
    validateAllFields();
  };

  const handleBairroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoCidadeUf = event.target.value;
    setBairro(novoCidadeUf);
    validateAllFields();
  };

  const validDDDs = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ];

  const formatTelefones = (value: string): string => {
    if (value.length < 11) return value;
    return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const handleTelefonesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatTelefones(rawValue);
    setTelefones(formattedValue);
    validateAllFields();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoEmail = event.target.value;
    setEmail(novoEmail);
    validateAllFields();
  };

  const handleOpcaoChange = (value: string) => {
    setPortabilidade(value);
    validateAllFields();
  };

  const handleSexoTitularChange = (value: string) => {
    setSexoTitular(value);
    validateAllFields();
  };

  const handleDependentesChange = (
    index: number,
    field: keyof Dependent,
    value: string
  ) => {
    const newDependents = [...dependents];
    newDependents[index][field] = value;
    setDependents(newDependents);
    validateDependent(index);
  };

  const handlePagamentoChange = (value: string) => {
    setPagamento(value);
    if (value !== "DEBITO") {
      setAgencia("");
      setConta("");
      setBanco("");
      localStorage.removeItem("Agencia");
      localStorage.removeItem("Conta");
      localStorage.removeItem("Banco");
    }
    validateAllFields();
  };

  const handleAgenciaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgencia(event.target.value);
    validateAllFields();
  };

  const handleContaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConta(event.target.value);
    validateAllFields();
  };

  const handleBancoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBanco(event.target.value);
    validateAllFields();
  };

  const handleEnvioChange = (value: string) => {
    setEnvioBoleto(value);
    validateAllFields();
  };

  const isValidCPF = (cpf: string) => {
    if (cpf.length !== 11) return false;
    const allDigitsSame = /^(\d)\1{10}$/.test(cpf);
    if (allDigitsSame) return false;

    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf[i - 1]) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
  };

  const format2CPF = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formattedValue = cleanedValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
    return formattedValue;
  };

  const format2RG = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 12);
  };

  const format2CartaoSUS = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const handleTelefoneChange = (index: number, value: string) => {
    const telefones = value.split(",").map((telefone) => telefone.trim());
    const telefonesFormatados = telefones.map((telefone) => {
      const cleaned = telefone.replace(/\D/g, "");
      return format2PhoneNumber(telefone);
    });

    handleDependentesChange(index, "telefones", telefonesFormatados.join(", "));
  };

  const format2PhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handleCepChange = async (event: { target: { value: string } }) => {
    const novoCep = event.target.value.replace(/\D/g, "");
    setCep(novoCep);
    validateAllFields();

    if (novoCep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${novoCep}/json/`
        );
        const data = response.data;

        if (!data.erro) {
          setEndereco(data.logradouro);
          setBairro(data.bairro);
          setCidade(`${data.localidade}`);
          setCidade_Uf(`${data.uf}`);
        } else {
          alert("CEP não encontrado!");
          clearFields();
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar informações do CEP.");
      }
    } else {
      clearFields();
    }
  };

  const clearFields = () => {
    setEndereco("");
    setBairro("");
    setCidade("");
    setCidade_Uf("");
    localStorage.removeItem("Endereco");
    localStorage.removeItem("Bairro");
    localStorage.removeItem("Cidade");
    localStorage.removeItem("UF");
  };

  const MenssagemApiOK = () =>
    toast.success("Dados salvos com sucesso!", {
      position: "top-center",
      autoClose: 5500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      theme: "dark",
    });

  const MenssagemApiNotOK = (p0: string) => {
    toast.error("Por favor, preencha todos os campos obrigatórios.", {
      position: "top-center",
      autoClose: 5500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
      theme: "dark",
    });
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Validar todos os campos antes do envio
    const titularValid = validateAllFields();
    const dependentsValid = validateAllDependents();

    if (!titularValid || !dependentsValid) {
      toast.error(
        "Por favor, corrija os erros no formulário antes de enviar.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      return;
    }

    const isValidDependent = (dependent: any) => {
      return (
        dependent.nome &&
        dependent.dataNascimento &&
        dependent.estadoCivil &&
        dependent.cpf &&
        dependent.rg
      );
    };

    const validDependents = dependents.filter(isValidDependent);
    const dtAdesaoAoPlano = `${new Date().toLocaleDateString(
      "pt-BR"
    )} às ${new Date().toLocaleTimeString("pt-BR", { hour12: false })}`;
    const opcaoSelecionada = localStorage.getItem("opcaoSelecionada");

    const dataToSend: any = {
      titular,
      dtNascimento,
      estadoCivil,
      cpf,
      rg,
      uf_rg,
      uf_emissor_rg,
      cartaosus,
      matricula,
      nomeMae,
      endereco,
      numeroCasa,
      complement,
      bairro,
      sexoTitular,
      pagamento,
      envioBoleto,
      agencia,
      conta,
      banco,
      cidade,
      cidade_uf,
      cep,
      telefones,
      email,
      portabilidade,
      dtAdesaoAoPlano,
      opcaoSelecionada: opcaoSelecionada || "A",
    };

    if (validDependents.length > 0) {
      dataToSend.dependents = validDependents;
    }

    const camposObrigatorios = Object.entries(dataToSend).filter(
      ([key, value]) => !value && !["agencia", "conta", "banco"].includes(key)
    );

    if (camposObrigatorios.length > 0) {
      const camposNomes = camposObrigatorios
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        .join(", ");
      MenssagemApiNotOK(
        `Por favor, preencha todos os campos obrigatórios: ${camposNomes}.`
      );
      return;
    }

    try {
      const response = await fetch(
        "https://api.afrafepsaude.com.br/forms/adesaoExterno/salvar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        MenssagemApiOK();
        setIsSubmitted(true);

        setTitular("");
        setDtNascimento("");
        setEstadoCivil("");
        setCpf("");
        setRg("");
        setCartaoSus("");
        setMatricula("");
        setNomeMae("");
        setEndereco("");
        setNumeroCasa("");
        setComplement("");
        setBairro("");
        setCidade("");
        setCidade_Uf("");
        setCep("");
        setTelefones("");
        setEmail("");
        setPortabilidade("");
        setSexoTitular("");
        setDependents([]);
        setEnvioBoleto("");
        setPagamento("");
        setAgencia("");
        setConta("");
        setBanco("");
        setUf_rg("");
        setUf_Emissor_rg("");
        setOpcaoSelecionada("");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Erro ao salvar os dados no banco de dados");
      }
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      MenssagemApiNotOK("Ocorreu um erro ao salvar os dados.");
    }
  };

  const [dados, setDados] = useState<Beneficiario | null>(null);

  const handleCpf2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCpf(raw);
    validateAllFields();
  };

  useEffect(() => {
    const buscarDados = async () => {
      if (cpf.length === 11) {
        try {
          const response = await axios.get(
            `https://api.afrafepsaude.com.br/forms/adesaoDepentendeParaTitular/${cpf}`
          );
          setDados(response.data.data);
        } catch (error) {}
      }
    };

    buscarDados();
  }, [cpf]);

  return (
    <div className="max-x-auto">
      <div className=" p-4 sm:p-6 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-8"
        >
          {/* Seção Titular */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    colSpan={2}
                    className="px-6 py-3 text-lg font-semibold text-gray-800 tracking-wider text-center"
                  >
                    DADOS DO TITULAR DO PLANO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="titular-nome"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome Completo
                    </label>
                    <input
                      id="titular-nome"
                      type="text"
                      value={dados?.nome || titular}
                      onChange={handleTitularChange}
                      maxLength={45}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "titular"
                      )}`}
                      required
                    />
                    {errors.titular && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.titular}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="titular-nascimento"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de Nascimento
                    </label>
                    <input
                      id="titular-nascimento"
                      type="date"
                      value={dados?.dtNascimento || dtNascimento}
                      onChange={handleDtNascimentoChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "dtNascimento"
                      )}`}
                      required
                    />
                    {errors.dtNascimento && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dtNascimento}
                      </p>
                    )}
                  </td>
                </tr>

                <tr className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="estadoCivil"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado Civil
                    </label>
                    <select
                      id="estadoCivil"
                      value={estadoCivil}
                      onChange={handleEstadoCivilChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "estadoCivil"
                      )}`}
                      required
                    >
                      <option value="-">-</option>
                      <option value="Solteiro">Solteiro</option>
                      <option value="Casado">Casado</option>
                      <option value="Viuvo">Viúvo</option>
                      <option value="Separado">Separado</option>
                    </select>
                    {errors.estadoCivil && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.estadoCivil}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="cpf"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CPF
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      value={cpf}
                      onChange={handleCpf2Change}
                      maxLength={14}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "cpf"
                      )}`}
                      required
                    />
                    {errors.cpf && (
                      <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="rg"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      RG / Órgão / UF
                    </label>
                    <div className="flex items-center gap-3 md:ml-[-50px]">
                      <input
                        id="rg"
                        type="text"
                        value={dados?.rg || rg}
                        onChange={handleRgChange}
                        maxLength={11}
                        placeholder="RG"
                        className={`w-28 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                          "rg"
                        )}`}
                        required
                      />
                      <input
                        type="text"
                        value={dados?.orgaoRg || uf_emissor_rg}
                        onChange={handleUfEmissorRgChange}
                        maxLength={3}
                        placeholder="Órgão"
                        className={`w-12 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                          "uf_emissor_rg"
                        )}`}
                        required
                      />
                      <input
                        type="text"
                        value={dados?.uf || uf_rg}
                        onChange={handleUfRgChange}
                        maxLength={2}
                        placeholder="UF"
                        className={`w-10 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                          "uf_rg"
                        )}`}
                        required
                      />
                    </div>
                    {(errors.rg || errors.uf_emissor_rg || errors.uf_rg) && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.rg || errors.uf_emissor_rg || errors.uf_rg}
                      </p>
                    )}
                  </td>
                </tr>

                <tr className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="sus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cartão SUS
                    </label>
                    <input
                      id="sus"
                      type="text"
                      value={dados?.cns || cartaosus}
                      onChange={handleCartaoSusChange}
                      maxLength={15}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "cartaosus"
                      )}`}
                      required
                    />
                    {errors.cartaosus && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cartaosus}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="matricula"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Matrícula
                    </label>
                    <input
                      id="matricula"
                      value={dados?.codigo || matricula}
                      onChange={handleMatriculaChange}
                      maxLength={7}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "matricula"
                      )}`}
                      required
                    />
                    {errors.matricula && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.matricula}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Sexo
                    </label>
                    <div className="flex items-center space-x-4 mt-2 md:ml-[-38px]">
                      <div
                        onClick={() => handleSexoTitularChange("M")}
                        className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 text-sm font-medium ${
                          sexoTitular === "M"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getFieldClass("sexoTitular")}`}
                      >
                        Masculino
                      </div>
                      <div
                        onClick={() => handleSexoTitularChange("F")}
                        className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 text-sm font-medium ${
                          sexoTitular === "F"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getFieldClass("sexoTitular")}`}
                      >
                        Feminino
                      </div>
                    </div>
                    {errors.sexoTitular && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.sexoTitular}
                      </p>
                    )}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className="px-6 py-4">
                    <label
                      htmlFor="nome-mae"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome da Mãe
                    </label>
                    <input
                      id="nome-mae"
                      type="text"
                      maxLength={60}
                      value={dados?.nmMae || nomeMae}
                      onChange={handleNomeMaeChange}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "nomeMae"
                      )}`}
                      required
                    />
                    {errors.nomeMae && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nomeMae}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Seção Endereço */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    colSpan={2}
                    className="px-6 py-3 text-lg font-semibold text-gray-800 tracking-wider text-center"
                  >
                    ENDEREÇO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CEP
                    </label>
                    <input
                      id="cep"
                      type="text"
                      value={dados?.cep || cep}
                      onChange={handleCepChange}
                      maxLength={9}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "cep"
                      )}`}
                      required
                    />
                    {errors.cep && (
                      <p className="text-red-500 text-xs mt-1">{errors.cep}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 md:col-span-2">
                    <label
                      htmlFor="endereco"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Endereço
                    </label>
                    <input
                      id="endereco"
                      type="text"
                      value={dados?.logradouro || endereco}
                      onChange={handleEnderecoChange}
                      maxLength={40}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "endereco"
                      )}`}
                      required
                    />
                    {errors.endereco && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.endereco}
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="numero"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nº
                    </label>
                    <input
                      id="numero"
                      type="text"
                      value={dados?.numero || numeroCasa}
                      onChange={handleNumeroCasaChange}
                      maxLength={10}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "numeroCasa"
                      )}`}
                      required
                    />
                    {errors.numeroCasa && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.numeroCasa}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="complemento"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      type="text"
                      value={dados?.complemento || complement}
                      onChange={handleComplementChange}
                      maxLength={30}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "complement"
                      )}`}
                    />
                    {errors.complement && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.complement}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="bairro"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bairro
                    </label>
                    <input
                      id="bairro"
                      type="text"
                      value={dados?.bairro || bairro}
                      onChange={handleBairroChange}
                      maxLength={30}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "bairro"
                      )}`}
                      required
                    />
                    {errors.bairro && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bairro}
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                  <td className="px-6 py-4 md:col-span-2">
                    <label
                      htmlFor="cidade"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade / UF
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="cidade"
                        type="text"
                        value={dados?.cidade || cidade}
                        onChange={handleCidadeUfChange}
                        className={`block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                          "cidade"
                        )}`}
                        required
                      />
                      <input
                        type="text"
                        value={dados?.uf || cidade_uf}
                        onChange={handleCidadeUfChange}
                        maxLength={2}
                        className={`block w-16 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                          "cidade_uf"
                        )}`}
                        required
                      />
                    </div>
                    {(errors.cidade || errors.cidade_uf) && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cidade || errors.cidade_uf}
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <td className="px-6 py-4">
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone (com DDD)
                    </label>
                    <input
                      id="telefone"
                      type="text"
                      value={dados?.celular || telefones}
                      onChange={handleTelefonesChange}
                      maxLength={15}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "telefones"
                      )}`}
                      required
                    />
                    {errors.telefones && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.telefones}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={dados?.email || email}
                      onChange={handleEmailChange}
                      maxLength={30}
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                        "email"
                      )}`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-6 py-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Portabilidade
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div
                        onClick={() => handleOpcaoChange("1")}
                        className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 text-sm font-medium ${
                          portabilidade === "1"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getFieldClass("portabilidade")}`}
                      >
                        Sim
                      </div>
                      <div
                        onClick={() => handleOpcaoChange("0")}
                        className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 text-sm font-medium ${
                          portabilidade === "0"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getFieldClass("portabilidade")}`}
                      >
                        Não
                      </div>
                    </div>
                    {errors.portabilidade && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.portabilidade}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Seção Pagamento */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    colSpan={2}
                    className="px-6 py-3 text-lg font-semibold text-gray-800 tracking-wider text-center"
                  >
                    FORMA DE PAGAMENTO
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2} className="px-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opção de Pagamento
                      </label>
                      <div className="flex items-center space-x-4">
                        <div
                          onClick={() => handlePagamentoChange("BOLETO")}
                          className={`cursor-pointer flex-1 text-center border rounded-md py-2 px-4 text-sm font-medium ${
                            pagamento === "BOLETO"
                              ? "bg-sky-500 border-sky-500 text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          } ${getFieldClass("pagamento")}`}
                        >
                          Boleto Bancário
                        </div>
                        <div
                          onClick={() => handlePagamentoChange("DEBITO")}
                          className={`cursor-pointer flex-1 text-center border rounded-md py-2 px-4 text-sm font-medium ${
                            pagamento === "DEBITO"
                              ? "bg-sky-500 border-sky-500 text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          } ${getFieldClass("pagamento")}`}
                        >
                          Débito em Conta
                        </div>
                      </div>
                      {errors.pagamento && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pagamento}
                        </p>
                      )}
                    </div>

                    {pagamento === "DEBITO" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <label
                            htmlFor="banco"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Banco
                          </label>
                          <input
                            id="banco"
                            type="text"
                            value={banco}
                            onChange={handleBancoChange}
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                              "banco"
                            )}`}
                          />
                          {errors.banco && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.banco}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="agencia"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Agência
                          </label>
                          <input
                            id="agencia"
                            type="text"
                            maxLength={8}
                            value={agencia}
                            onChange={handleAgenciaChange}
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                              "agencia"
                            )}`}
                          />
                          {errors.agencia && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.agencia}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="conta"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Conta
                          </label>
                          <input
                            id="conta"
                            type="text"
                            maxLength={12}
                            value={conta}
                            onChange={handleContaChange}
                            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getFieldClass(
                              "conta"
                            )}`}
                          />
                          {errors.conta && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.conta}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-6 py-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envio de Boleto
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <div
                        onClick={() => handleEnvioChange("CORREIO")}
                        className="flex items-center cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                            envioBoleto === "CORREIO"
                              ? "border-sky-500 bg-sky-500"
                              : "border-red-400"
                          } ${getFieldClass("envioBoleto")}`}
                        >
                          {envioBoleto === "CORREIO" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Correio</span>
                      </div>
                      <div
                        onClick={() => handleEnvioChange("EMAIL")}
                        className="flex items-center cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                            envioBoleto === "EMAIL"
                              ? "border-sky-500 bg-sky-500"
                              : "border-red-400"
                          } ${getFieldClass("envioBoleto")}`}
                        >
                          {envioBoleto === "EMAIL" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Email</span>
                      </div>
                      <div
                        onClick={() => handleEnvioChange("CORREIO_EMAIL")}
                        className="flex items-center cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                            envioBoleto === "CORREIO_EMAIL"
                              ? "border-sky-500 bg-sky-500"
                              : "border-red-400"
                          } ${getFieldClass("envioBoleto")}`}
                        >
                          {envioBoleto === "CORREIO_EMAIL" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          Correio e Email
                        </span>
                      </div>
                    </div>
                    {errors.envioBoleto && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.envioBoleto}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Seção Dependentes */}
          {dependents.map((dependent, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-100 px-6 py-3">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  DADOS DO DEPENDENTE - {String(index + 1).padStart(2, "0")}
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`dep-nome-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome Completo
                    </label>
                    <input
                      id={`dep-nome-${index}`}
                      type="text"
                      maxLength={40}
                      value={dependent.nome}
                      onChange={(e) =>
                        handleDependentesChange(index, "nome", e.target.value)
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "nome"
                      )}`}
                      required
                    />
                    {dependentErrors[index]?.nome && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.nome}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor={`dep-nome-mae-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome da Mãe
                    </label>
                    <input
                      id={`dep-nome-mae-${index}`}
                      type="text"
                      maxLength={55}
                      value={dependent.nomeMae}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "nomeMae",
                          e.target.value
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "nomeMae"
                      )}`}
                      required
                    />
                    {dependentErrors[index]?.nomeMae && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.nomeMae}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-nascimento-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de Nascimento
                    </label>
                    <input
                      id={`dep-nascimento-${index}`}
                      type="date"
                      value={dependent.dataNascimento}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "dataNascimento",
                          formatDate(e.target.value)
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "dataNascimento"
                      )}`}
                      required
                    />
                    {dependentErrors[index]?.dataNascimento && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.dataNascimento}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-parentesco-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Parentesco com o Titular
                    </label>
                    <select
                      id={`dep-parentesco-${index}`}
                      value={dependent.parentesco}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "parentesco",
                          e.target.value
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "parentesco"
                      )}`}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Pai">Pai</option>
                      <option value="Mae">Mãe</option>
                      <option value="Filho">Filho</option>
                      <option value="Filha">Filha</option>
                      <option value="Irmao">Irmão</option>
                      <option value="Irma">Irmã</option>
                      <option value="Cônjuge">Cônjuge</option>
                    </select>
                    {dependentErrors[index]?.parentesco && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.parentesco}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-cpf-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      CPF
                    </label>
                    <input
                      id={`dep-cpf-${index}`}
                      type="text"
                      maxLength={14}
                      value={dependent.cpf}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "cpf",
                          format2CPF(e.target.value)
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "cpf"
                      )}`}
                      required
                    />
                    {dependentErrors[index]?.cpf && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.cpf}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-rg-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      RG / Órgão / UF
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id={`dep-rg-${index}`}
                        type="text"
                        value={dependent.rg}
                        onChange={(e) =>
                          handleDependentesChange(
                            index,
                            "rg",
                            format2RG(e.target.value)
                          )
                        }
                        maxLength={11}
                        className={`block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                          index,
                          "rg"
                        )}`}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Órgão"
                        value={dependent.uf_emissor_rg}
                        onChange={(e) =>
                          handleDependentesChange(
                            index,
                            "uf_emissor_rg",
                            e.target.value
                          )
                        }
                        maxLength={3}
                        className={`block w-20 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                          index,
                          "uf_emissor_rg"
                        )}`}
                        required
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        value={dependent.uf_rg}
                        onChange={(e) =>
                          handleDependentesChange(
                            index,
                            "uf_rg",
                            e.target.value
                          )
                        }
                        maxLength={2}
                        className={`block w-16 px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                          index,
                          "uf_rg"
                        )}`}
                        required
                      />
                    </div>
                    {(dependentErrors[index]?.rg ||
                      dependentErrors[index]?.uf_emissor_rg ||
                      dependentErrors[index]?.uf_rg) && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.rg ||
                          dependentErrors[index]?.uf_emissor_rg ||
                          dependentErrors[index]?.uf_rg}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-estado-civil-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado Civil
                    </label>
                    <select
                      id={`dep-estado-civil-${index}`}
                      value={dependent.estadoCivil}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "estadoCivil",
                          e.target.value
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "estadoCivil"
                      )}`}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                      <option value="separado">Separado(a)</option>
                    </select>
                    {dependentErrors[index]?.estadoCivil && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.estadoCivil}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sexo
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div
                        onClick={() =>
                          handleDependentesChange(index, "sexoDependent", "M")
                        }
                        className={`cursor-pointer flex-1 text-center border rounded-md py-2 px-4 text-sm font-medium ${
                          dependent.sexoDependent === "M"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getDependentFieldClass(index, "sexoDependent")}`}
                      >
                        Masculino
                      </div>
                      <div
                        onClick={() =>
                          handleDependentesChange(index, "sexoDependent", "F")
                        }
                        className={`cursor-pointer flex-1 text-center border rounded-md py-2 px-4 text-sm font-medium ${
                          dependent.sexoDependent === "F"
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        } ${getDependentFieldClass(index, "sexoDependent")}`}
                      >
                        Feminino
                      </div>
                    </div>
                    {dependentErrors[index]?.sexoDependent && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.sexoDependent}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-sus-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cartão SUS
                    </label>
                    <input
                      id={`dep-sus-${index}`}
                      type="text"
                      maxLength={15}
                      value={dependent.cartaoSus}
                      onChange={(e) =>
                        handleDependentesChange(
                          index,
                          "cartaoSus",
                          format2CartaoSUS(e.target.value)
                        )
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "cartaoSus"
                      )}`}
                    />
                    {dependentErrors[index]?.cartaoSus && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.cartaoSus}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`dep-tel-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone (com DDD)
                    </label>
                    <input
                      id={`dep-tel-${index}`}
                      type="text"
                      maxLength={15}
                      value={dependent.telefones}
                      onChange={(e) =>
                        handleTelefoneChange(index, e.target.value)
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "telefones"
                      )}`}
                    />
                    {dependentErrors[index]?.telefones && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.telefones}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor={`dep-email-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      E-mail
                    </label>
                    <input
                      id={`dep-email-${index}`}
                      type="email"
                      maxLength={40}
                      value={dependent.email}
                      onChange={(e) =>
                        handleDependentesChange(index, "email", e.target.value)
                      }
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${getDependentFieldClass(
                        index,
                        "email"
                      )}`}
                    />
                    {dependentErrors[index]?.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {dependentErrors[index]?.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeDependent(index)}
                  className="bg-red-100 text-red-700 hover:bg-red-200 font-medium rounded-md text-sm px-4 py-2"
                >
                  Excluir Dependente
                </button>
              </div>
            </div>
          ))}

          <ToastContainer />
        </form>
      </div>

      <div className="flex justify-between mt-4">
        {!isSubmitted ? (
          <>
            {/* Botão "Adicionar Dependente" só aparece se opcaoSelecionada === "B" */}
            {opcaoSelecionada2 === "C" && (
              <button
                id="addDependentButton"
                className={`hide-print text-white px-4 py-2 transition duration-300 rounded ${
                  !titular.trim() ||
                  !dtNascimento.trim() ||
                  !estadoCivil.trim() ||
                  !cpf.trim() ||
                  !rg.trim() ||
                  !uf_rg.trim() ||
                  !uf_emissor_rg.trim() ||
                  !cartaosus.trim() ||
                  !matricula.trim() ||
                  !nomeMae.trim() ||
                  !endereco.trim() ||
                  !numeroCasa.trim() ||
                  !complement.trim() ||
                  !bairro.trim() ||
                  !cidade.trim() ||
                  !cidade_uf.trim() ||
                  !cep.trim() ||
                  !telefones.trim() ||
                  !email.trim() ||
                  !portabilidade.trim() ||
                  dependents.length >= 5
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={addDependent}
                disabled={
                  !titular.trim() ||
                  !dtNascimento.trim() ||
                  !estadoCivil.trim() ||
                  !cpf.trim() ||
                  !rg.trim() ||
                  !uf_rg.trim() ||
                  !uf_emissor_rg.trim() ||
                  !cartaosus.trim() ||
                  !matricula.trim() ||
                  !nomeMae.trim() ||
                  !endereco.trim() ||
                  !numeroCasa.trim() ||
                  !complement.trim() ||
                  !bairro.trim() ||
                  !cidade.trim() ||
                  !cidade_uf.trim() ||
                  !cep.trim() ||
                  !telefones.trim() ||
                  !email.trim() ||
                  !portabilidade.trim() ||
                  dependents.length >= 5
                }
              >
                Adicionar Dependente
              </button>
            )}

            {/* Botão de Enviar sempre na direita */}
            <div className="ml-auto">
              <button
                id="submitButton"
                className={`hide-print text-white px-4 py-2 transition duration-300 rounded ${
                  !titular.trim() ||
                  !dtNascimento.trim() ||
                  !estadoCivil.trim() ||
                  !cpf.trim() ||
                  !rg.trim() ||
                  !uf_rg.trim() ||
                  !uf_emissor_rg.trim() ||
                  !cartaosus.trim() ||
                  !matricula.trim() ||
                  !nomeMae.trim() ||
                  !endereco.trim() ||
                  !numeroCasa.trim() ||
                  !bairro.trim() ||
                  !cidade.trim() ||
                  !cidade_uf.trim() ||
                  !cep.trim() ||
                  !telefones.trim() ||
                  !email.trim() ||
                  !portabilidade.trim()
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSubmit}
                disabled={
                  !titular.trim() ||
                  !dtNascimento.trim() ||
                  !estadoCivil.trim() ||
                  !cpf.trim() ||
                  !rg.trim() ||
                  !uf_rg.trim() ||
                  !uf_emissor_rg.trim() ||
                  !cartaosus.trim() ||
                  !matricula.trim() ||
                  !nomeMae.trim() ||
                  !endereco.trim() ||
                  !numeroCasa.trim() ||
                  !bairro.trim() ||
                  !cidade.trim() ||
                  !cidade_uf.trim() ||
                  !cep.trim() ||
                  !telefones.trim() ||
                  !email.trim() ||
                  !portabilidade.trim()
                }
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end mt-4">
            <button></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabela;
