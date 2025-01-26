import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import css from './App.css'  

const GestorGastos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [filtroGastos, setFiltroGastos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);

  // Fetch data on load
  useEffect(() => {
    obtenerDepartamentos();
    obtenerEmpleados();
    obtenerGastos();
  }, []);

  const obtenerDepartamentos = async () => {
    const response = await axios.get('http://localhost:8080/api/departamentos');
    setDepartamentos(response.data);
  };

  const obtenerEmpleados = async () => {
    const response = await axios.get('http://localhost:8080/api/empleados');
    setEmpleados(response.data);
  };

  const obtenerGastos = async () => {
    const response = await axios.get('http://localhost:8080/api/gastos/all');
    setGastos(response.data);
  };

  const filtrarGastos = async () => {
    if (!fechaInicio || !fechaFin) {
      setMensaje('Por favor, selecciona ambas fechas');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/gastos/filtrar`, {
        params: { fechaInicio, fechaFin },
      });
      setFiltroGastos(response.data);
      if (response.data.length === 0) {
        setMensaje('No hay datos que mostrar');
      } else {
        setMensaje('');
      }
    } catch (error) {
      setMensaje('Error al filtrar los datos');
    }
  };

  const agregarElemento = async (tipo, nombre) => {
    try {
      await axios.post(`http://localhost:8080/api/${tipo}/add`, { nombre });
      if (tipo === 'departamentos') obtenerDepartamentos();
      if (tipo === 'empleados') obtenerEmpleados();
      if (tipo === 'gastos') obtenerGastos();
    } catch (error) {
      console.error(`Error al agregar ${tipo}:`, error);
    }
  };

  const editarElemento = async (tipo, id, nombre) => {
    try {
      await axios.put(`http://localhost:8080/api/${tipo}/edit/${id}`, { nombre });
      if (tipo === 'departamentos') obtenerDepartamentos();
      if (tipo === 'empleados') obtenerEmpleados();
      if (tipo === 'gastos') obtenerGastos();
    } catch (error) {
      console.error(`Error al editar ${tipo}:`, error);
    }
  };

  const eliminarElemento = async (tipo, id) => {
    try {
      await axios.delete(`http://localhost:8080/api/${tipo}/${id}`);
      if (tipo === 'departamentos') obtenerDepartamentos();
      if (tipo === 'empleados') obtenerEmpleados();
      if (tipo === 'gastos') obtenerGastos();
    } catch (error) {
      console.error(`Error al eliminar ${tipo}:`, error);
    }
  };

  const abrirModal = (tipo, elemento = null) => {
    setElementoSeleccionado(elemento);
    setModoEdicion(tipo === 'editar');
    setModalAbierto(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">MINI CORE - Gestor de Gastos</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Tabla de Departamentos */}
        <div>
          <h2 className="text-center font-semibold mb-2">Departamentos</h2>
          <button
            onClick={() => abrirModal('departamentos')}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Agregar Departamento
          </button>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nombre}</td>
                  <td>
                    <button
                      className="text-blue-500"
                      onClick={() => abrirModal('editar', d)}
                    >
                      Editar
                    </button>{' '}
                    |
                    <button
                      className="text-red-500"
                      onClick={() => eliminarElemento('departamentos', d.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de Gastos */}
        <div>
          <h2 className="text-center font-semibold mb-2">Gastos</h2>
          <button
            onClick={() => abrirModal('gastos')}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Agregar Gasto
          </button>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>ID Empleado</th>
                <th>ID Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.fecha}</td>
                  <td>{g.descripcion}</td>
                  <td>{g.monto}</td>
                  <td>{g.empleado.id}</td>
                  <td>{g.departamento.id}</td>
                  <td>
                    <button
                      className="text-blue-500"
                      onClick={() => abrirModal('editar', g)}
                    >
                      Editar
                    </button>{' '}
                    |
                    <button
                      className="text-red-500"
                      onClick={() => eliminarElemento('gastos', g.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de Empleados */}
        <div>
          <h2 className="text-center font-semibold mb-2">Empleados</h2>
          <button
            onClick={() => abrirModal('empleados')}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Agregar Empleado
          </button>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>
                    <button
                      className="text-blue-500"
                      onClick={() => abrirModal('editar', e)}
                    >
                      Editar
                    </button>{' '}
                    |
                    <button
                      className="text-red-500"
                      onClick={() => eliminarElemento('empleados', e.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtrado de Gastos */}
      <div className="mb-4">
        <h2 className="text-center font-semibold mb-2">Filtrado de Gastos</h2>
        <div className="flex justify-center space-x-4 mb-2">
          <input
            type="date"
            className="border rounded p-2"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <button
            onClick={filtrarGastos}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Filtrar
          </button>
        </div>
        {mensaje && <p className="text-center text-red-500">{mensaje}</p>}
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th>Departamento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtroGastos.map((g, index) => (
              <tr key={index}>
                <td>{g.departamento}</td>
                <td>{g.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <Modal
          tipo={elementoSeleccionado ? elementoSeleccionado.tipo : ''}
          elemento={elementoSeleccionado}
          modoEdicion={modoEdicion}
          setModalAbierto={setModalAbierto}
          agregarElemento={agregarElemento}
          editarElemento={editarElemento}
        />
      )}
    </div>
  );
};

export default GestorGastos;

