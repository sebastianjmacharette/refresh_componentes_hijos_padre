// AbrirCuentaCorrientePasajero.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

function AbrirCuentaCorrientePasajero({ idPassenger, idTravel, onModalClose = () => {} }) {
  const [formData, setFormData] = useState({
    totalTravel: "",
    interest: "",
    totalQuotas: 1,
    deposit: "",
    typePassenger: "",
  });

  const getDecryptedToken = () => {
    const token = localStorage.getItem("tkjscvee");
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(token, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const API_URL_ABRIR_CTA_CTE = `${import.meta.env.VITE_BACKEND_URL}/nuevaCuenta/${idPassenger}/${idTravel}`;

  const fetchDatosPasajero = async (idPassenger) => {
    const decryptedToken = getDecryptedToken();
    if (!decryptedToken) {
      throw new Error("Token no disponible o inválido");
    }

    const API_URL_DATOS_PASAJERO = `${import.meta.env.VITE_BACKEND_URL}/buscarPasajero/${idPassenger}`;

    try {
      const { data } = await axios.get(API_URL_DATOS_PASAJERO, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error en la solicitud a la API:", error);
      throw error;
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const datos = await fetchDatosPasajero(idPassenger);
        setFormData((prevData) => ({
          ...prevData,
          typePassenger: datos.qualityPassenger,
        }));
      } catch (error) {
        toast.error("Error al obtener los datos del pasajero.");
      }
    };

    if (idPassenger) {
      obtenerDatos();
    }
  }, [idPassenger]);

  const handleModalClose = () => {
    const modal = document.getElementById("abrir_cuenta_corriente_pasajero");
    modal.close();
    onModalClose(); // Llamar a la función directamente
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const decryptedToken = getDecryptedToken();

    try {
      await axios.post(
        API_URL_ABRIR_CTA_CTE,
        {
          totalTravel: formData.totalTravel,
          interest: formData.interest,
          totalQuotas: formData.totalQuotas,
          deposit: formData.deposit,
          typePassenger: formData.typePassenger,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      toast.success("Cuenta corriente creada exitosamente");
      handleModalClose(); // Cerrar el modal al completar el envío
    } catch (error) {
      toast.error("Error al crear la cuenta corriente");
      console.error("Error en la solicitud a la API:", error);
    }
  };

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() =>
          document.getElementById("abrir_cuenta_corriente_pasajero").showModal()
        }
      >
        Abrir Cuenta Corriente
      </button>
      <dialog id="abrir_cuenta_corriente_pasajero" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose} // Cerrar modal manualmente
              type="button"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Abrir cuenta corriente pasajero</h3>
            <p>ID del pasajero recibido: {idPassenger}</p>
            <p>ID del viaje recibido: {idTravel}</p>

            <label>Total del viaje:</label>
            <input
              type="number"
              value={formData.totalTravel}
              onChange={(e) =>
                setFormData({ ...formData, totalTravel: e.target.value })
              }
              required
            />

            <label>Interés (%):</label>
            <input
              type="number"
              value={formData.interest}
              onChange={(e) =>
                setFormData({ ...formData, interest: e.target.value })
              }
              required
            />

            <label>Cuotas:</label>
            <select
              value={formData.totalQuotas}
              onChange={(e) =>
                setFormData({ ...formData, totalQuotas: e.target.value })
              }
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
            </select>

            <label>Depósito inicial:</label>
            <input
              type="number"
              value={formData.deposit}
              onChange={(e) =>
                setFormData({ ...formData, deposit: e.target.value })
              }
              required
            />

            <label>Tipo de pasajero:</label>
            <input
              type="text"
              value={formData.typePassenger}
              readOnly
            />

            <button type="submit" className="btn">Crear Cuenta</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default AbrirCuentaCorrientePasajero;
