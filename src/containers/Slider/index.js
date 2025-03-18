import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateDesc =
    data?.focus?.sort((evtA, evtB) =>
      new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
    ) || []; // ordre croissant malgré "desc"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [index, byDateDesc.length]);

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event) => {
        const key = event.id || `${event.title}-${event.date}`; // Clé stable
        return (
          <div
            key={key}
            className={`SlideCard SlideCard--${
              byDateDesc[index] === event ? "display" : "hide"
            }`} // compare directement l'objet event avec bydatedesc 
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event) => {
            const key = event.id || `${event.title}-${event.date}`; // Clé stable
            return (
              <input
                key={`radio-${key}`}
                type="radio"
                name="radio-button"
                checked={byDateDesc[index] === event}
                readOnly
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;
