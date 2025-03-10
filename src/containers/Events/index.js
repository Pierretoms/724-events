import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";


const PER_PAGE = 9; 

const EventList = () => {
  const { data, error } = useData(); 
  const [type, setType] = useState(); 
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les événements en fonction du type sélectionné (ou afficher tous les événements si aucun type n'est sélectionné)
  const filteredEvents = (
    !type ? data?.events : data?.events.filter((event) => event.type === type)
  ) || [];

  // Pagination : sélection des événements à afficher pour la page actuelle
  const paginatedEvents = filteredEvents.filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index && 
      PER_PAGE * currentPage > index
    ) {
      return true; // L'événement appartient à la page actuelle
    }
    return false; // L'événement n'appartient pas à la page actuelle
  });

  // Fonction pour changer le type de filtrage
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Calcul du nombre total de pages pour la pagination
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  // Créer une liste des types d'événements uniques pour le sélecteur
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)} // Passer les types d'événements uniques comme options
            onChange={(value) => {
              // Mettre à jour le type sélectionné et filtrer les événements
              changeType(value || null);
            }}
          />
          <div id="events" className="ListContainer">
            {/* Afficher les événements filtrés et paginés */}
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // Créer un lien pour chaque page
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;