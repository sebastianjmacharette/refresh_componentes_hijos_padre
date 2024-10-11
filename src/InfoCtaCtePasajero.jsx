// InfoCtaCtePasajero.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

const InfoCtaCtePasajero = ({ idPassenger, refresh, onModalClose = () => {} }) => {
  const [accountData, setAccountData] = useState(null);

  const getDecryptedToken = () => {
    const token = localStorage.getItem("tkjscvee");
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(token, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchData = async () => {
      const decryptedToken = getDecryptedToken();
      const API_URL_CTA_CTE = `${import.meta.env.VITE_BACKEND_URL}/encontrarCuenta/${idPassenger}`;
      
      try {
        const { data } = await axios.get(API_URL_CTA_CTE, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });
        setAccountData(data);
      } catch (error) {
        console.error("Error al obtener datos de la cuenta:", error);
        toast.error("Error al obtener datos de la cuenta.");
      }
    };

    if (idPassenger) {
      fetchData();
    }
  }, [idPassenger, refresh]); // Agrega refresh a las dependencias

  return (
    <div>
      {accountData ? (
        <div>
          <h4>Información de la Cuenta Corriente</h4>
          <p>ID de la Cuenta: {accountData.idAccount}</p>
          <p>Saldo: {accountData.balance}</p>
          {/* Agrega más campos según sea necesario */}
        </div>
      ) : (
        <p>Cargando información de la cuenta corriente...</p>
      )}
    </div>
  );
};

export default InfoCtaCtePasajero;
