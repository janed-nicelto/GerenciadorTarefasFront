import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader, Toast } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';


function App() {
  const baseUrl = "https://localhost:7079/api/Tarefa";

//get todas as tarefas
const [data, setData] = useState([]);

const [updateData, setUpdateData] = useState(true);

const [modalIcluir, setModalIncluir] = useState(false);

const [modalEditar, setModalEditar] = useState(false);

const [modalExcluir, setModalExcluir] = useState(false);

const abrirFecharModalIncluir = () => {
  setModalIncluir(!modalIcluir)
}

const abrirFecharModalEditar = () => {
  setModalEditar(!modalEditar)
}

const abrirFecharModalExcluir = () => {
  setModalExcluir(!modalExcluir)
}

const handleChange = e => {
  const { name, value } = e.target;
  setTarefaSelecionada({
    ...tarefaSelecionada, [name]: value
  });
  console.log(tarefaSelecionada);
}

const [tarefaSelecionada, setTarefaSelecionada] = useState({
  id: '',
  titulo: '',
  descricao: '',
  //data_de_Criacao:'',
  data_de_Conclusao: '',
  status: ''
})

const pedidosGet = async () => {
  await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    })
}

const pedidosPost = async () => {
  delete tarefaSelecionada.id;
  await axios.post(baseUrl, tarefaSelecionada)
    .then(response => {
      setData(data.concat(response.data));
      setUpdateData(true);
      abrirFecharModalIncluir();
    }).catch(error => {
      console.log(error);
    })
}

const pedidosPut = async () => {
  await axios.put(baseUrl + "/" + tarefaSelecionada.id, tarefaSelecionada)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliares = data;
      dadosAuxiliares.map(tarefa => {
        if (tarefa.id === tarefaSelecionada.id) {
          tarefa.titulo = resposta.titulo;
          tarefa.descricao = resposta.descricao;
          tarefa.data_de_Conclusao = resposta.data_de_Conclusao;
          tarefa.status = resposta.status;
        }
      });
      setUpdateData(true);
      abrirFecharModalEditar();
    }).catch(error => {
      console.log(error);
    })
}

const pedidosDelete = async () => {
  await axios.delete(baseUrl + "/" + tarefaSelecionada.id)
    .then(response => {
      setData(data.filter(tarefa => tarefa.id !== response.data));
      setUpdateData(true);
      abrirFecharModalExcluir();
    }).catch(error => {
      console.log(error);
    })
}

useEffect(() => {
  if (updateData) {
    pedidosGet();
    setUpdateData(false);
  }
}, [updateData])

const selecionarTarefa = (tarefa, opcao) => {
  setTarefaSelecionada(tarefa);
  (opcao === "Editar") ?
    abrirFecharModalEditar() : abrirFecharModalExcluir();
}

const datah = new Date();
const dia = String(datah.getDate()).padStart(2, '0')
const mes = String(datah.getMonth() + 1).padStart(2, '0')
const ano = datah.getFullYear()
const time = datah.getHours().toString().padStart(2, '0') + ':' + datah.getMinutes().toString().padStart(2, '0');
const dataAtual = `${dia}/${mes}/${ano} ${time}`


return (
  <div className="tarefa-container">
    <br />
    <h1>Gerenciamento de Tarefas</h1>
    <header className="App-header">
      <img src={logoCadastro} alt="Cadastro" />
      <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()} >Incluir Nova Tarefa</button>
    </header>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Id</th>
          <th>Título</th>
          <th>Descrição</th>
          <th>Data de Criação</th>
          <th>Data de Conclusão</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(tarefa => (
          <tr key={tarefa.id}>
            <td>{tarefa.id}</td>
            <td>{tarefa.titulo}</td>
            <td>{tarefa.descricao}</td>
            <td>{tarefa.data_de_Criacao}</td>
            <td>{tarefa.data_de_Conclusao}</td>
            <td>{tarefa.status}</td>
            <td>
              <button className="btn btn-primary" onClick={() => selecionarTarefa(tarefa, "Editar")}>Editar</button>{" "}
              <button className="btn btn-primary" onClick={() => selecionarTarefa(tarefa, "Excluir")}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Modal isOpen={modalIcluir}>
      <ModalHeader>Criar Tarefas</ModalHeader>
      <ModalBody>
        <div className='form-group'>
          <label>Título:</label>
          <br />
          <input type='text' id='titulo' className='form-control' placeholder="* Título Obrigatório" name='titulo' required onChange={handleChange} />
          <br />
          <label>Descrição:</label>
          <br />
          <input type='text' className='form-control' placeholder="Descrição" name='descricao' onChange={handleChange} />
          <br />
          <label>Data de Criação:</label>
          <br />
          <input type='text' className='form-control' value={dataAtual} readOnly />
          <br />
          <label>Data de Conclusão:</label>
          <br />
          <input type='datetime-local' className='form-control' name='data_de_Conclusao' onChange={handleChange} />
          <br />
          <label>Status:</label>
          <br />
          <form>
            <select name="status" required="required" onChange={handleChange}>
              <option value="0">Pendente</option>
              <option value="1">Em Progresso</option>
              <option value="2">Concluída</option>
            </select>
          </form>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-primary' onClick={() => pedidosPost()} >Incluir</button>{"  "}
        <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalEditar}>
      <ModalHeader>Atualizar Tarefa</ModalHeader>
      <ModalBody>
        <div className='form-group'>
          <label>Id:</label>
          <input type='text' className='form-control' value={tarefaSelecionada && tarefaSelecionada.id} readOnly />
          <br />
          <label>Título:</label>
          <br />
          <input type='text' className='form-control' name="titulo" onChange={handleChange}
            value={tarefaSelecionada && tarefaSelecionada.titulo} />
          <br />
          <label>Descrição:</label>
          <br />
          <input type='text' className='form-control' name="descricao" onChange={handleChange}
            value={tarefaSelecionada && tarefaSelecionada.descricao} />
          <br />
          <label>Data de Criação:</label>
          <input type='datetime' className='form-control'
            readOnly value={tarefaSelecionada && tarefaSelecionada.data_de_Criacao} />
          <br />
          <label>Data de Conclusão:</label>
          <br />
          <input type='datetime-local' className='form-control' name='data_de_Conclusao' onChange={handleChange}
            value={tarefaSelecionada && tarefaSelecionada.data_de_Conclusao} />
          <br />
          <label>Status:</label>
          <br />
          <form>
            <select name="status" required="required" onChange={handleChange}>
              <option value="0">Pendente</option>
              <option value="1">Em Progresso</option>
              <option value="2">Concluída</option>
            </select>
          </form>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-primary' onClick={() => pedidosPut()}>Editar</button>{"  "}
        <button className='btn btn-danger' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalExcluir}>
      <ModalHeader> Deletar Tarefa </ModalHeader>
      <ModalBody>
        Confirma a exclusão desta tarefa: {tarefaSelecionada && tarefaSelecionada.id} ?
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-danger' onClick={() => pedidosDelete()}> Sim </button>
        <button className='btn btn-secondary' onClick={() => abrirFecharModalExcluir()}> Não </button>
      </ModalFooter>
    </Modal>
  </div>
);
}

export default App;
