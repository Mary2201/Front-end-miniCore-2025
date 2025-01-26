import React, { useState, useEffect } from 'react';

const Modal = ({ tipo, elemento, modoEdicion, setModalAbierto, agregarElemento, editarElemento }) => {
  const [nombre, setNombre] = useState(elemento ? elemento.nombre : '');

  useEffect(() => {
    if (elemento && modoEdicion) {
      setNombre(elemento.nombre);
    }
  }, [elemento, modoEdicion]);

  const handleSubmit = async () => {
    if (modoEdicion) {
      await editarElemento(tipo, elemento.id, nombre);
    } else {
      await agregarElemento(tipo, nombre);
    }
    setModalAbierto(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">{modoEdicion ? `Editar ${tipo}` : `Agregar ${tipo}`}</h2>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2 mb-4"
          placeholder="Nombre"
          disabled={modoEdicion} // Desactivar el campo en modo editar
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            {modoEdicion ? 'Actualizar' : 'Agregar'}
          </button>
          <button
            onClick={() => setModalAbierto(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
