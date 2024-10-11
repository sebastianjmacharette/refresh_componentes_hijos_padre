// EstadoContablePasajero.js
import React, { useEffect, useState } from "react";
import InfoPersonalPasajero from "./InfoPersonalPasajero";
import AbrirCuentaCorrientePasajero from "./AbrirCuentaCorrientePasajero";
import InfoCtaCtePasajero from "./InfoCtaCtePasajero";

const App = () => {
  const [idPassenger, setIdPassenger] = useState(null);
  const [idTravel, setIdTravel] = useState(null);
  const [refresh, setRefresh] = useState(0); // Estado para refresco

  // Recuperar el idPassenger y idTravel del localStorage cuando el componente se monte
  useEffect(() => {
    const storedIdPassenger = localStorage.getItem("selectedPasengerId");
    const storedIdTravel = localStorage.getItem("selectedTravelId");

    if (storedIdPassenger) {
      setIdPassenger(storedIdPassenger); // Guardar el ID en el estado
    }

    if (storedIdTravel) {
      setIdTravel(storedIdTravel); // Guardar el ID de viaje en el estado
    }
  }, []); // Solo se ejecuta cuando el componente se monta

  const handleUpdate = () => {
    console.log("Modal cerrado, actualizar el estado contable del pasajero");
    setRefresh((prev) => prev + 1); // Incrementar el contador de refresco
  };

  return (
    <div className="bg-purple-100 h-screen">
      <div className="divider mx-10 divider-secondary divider-start font-semibold text-xl m-0 pt-10">
        Estado Contable
      </div>

      <div className="mt-4">
        <InfoPersonalPasajero idPassenger={idPassenger} refresh={refresh} />
      </div>

      <AbrirCuentaCorrientePasajero 
        idPassenger={idPassenger}
        idTravel={idTravel}
        onModalClose={handleUpdate} // Llama a handleUpdate al cerrar el modal
      />
      <InfoCtaCtePasajero 
        idPassenger={idPassenger} 
        refresh={refresh}
        onModalClose={handleUpdate} // Puedes usar el mismo callback si es necesario
      />
    </div>
  );
};

export default App;
