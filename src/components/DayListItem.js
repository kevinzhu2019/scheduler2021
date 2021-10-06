import React from "react";
import "components/DayListItem.scss"

export default function DayListItem(props) {

  let dayListItemClass = "day-list__item";
  if(props.selected) dayListItemClass += "--selected";
  if(props.spots === 0) dayListItemClass += "--full";

  const spotsInfo = props.spots === 0 ? "no spots remaining" : (props.spots === 1 ? "1 spot remaining" : `${props.spots} spots remaining`);

  return (
    <li className={dayListItemClass} onClick={(event) => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{spotsInfo}</h3>
    </li>
  );
}