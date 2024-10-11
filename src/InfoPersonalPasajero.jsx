// InfoPersonalPasajero.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

const InfoPersonalPasajero = ({ idPassenger, refresh }) => {
  const [passengerData, setPassengerData] = useState(null);

  const getDecryptedToken = () => {
    const token = localStorage.getItem("tkjscvee");
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(token, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchData = async () => {
      const decryptedToken = getDecryptedToken();
      const API_URL_DATOS_PASAJERO = `${import.meta.env.VITE_BACKEND_URL}/buscarPasajero/${idPassenger}`;
      
      try {
        const { data } = await axios.get(API_URL_DATOS_PASAJERO, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });
        setPassengerData(data);
      } catch (error) {
        console.error("Error al obtener datos del pasajero:", error);
        toast.error("Error al obtener datos del pasajero.");
      }
    };

    if (idPassenger) {
      fetchData();
    }
  }, [idPassenger, refresh]); // Agrega refresh a las dependencias

  return (
    <div>
      {passengerData ? (
        <div>
          <h4>Información del Pasajero</h4>
          <p>ID: {passengerData.idPassenger}</p>
          <p>Nombre: {passengerData.namePassenger}</p>
          {/* Agrega más campos según sea necesario */}
        </div>
      ) : (
        <p>Cargando información del pasajero...</p>
      )}
    </div>
  );
};

export default InfoPersonalPasajero;
