import React from "react";
import "components/DayListItem.scss"

export default function DayListItem(props) {

  let dayListItemClass = "day-list__item";
  if(props.selected) dayListItemClass += "--selected";//should include a space otherwise some effects will lost
  if(props.spots === 0) dayListItemClass += "--full";
  console.log("className of DayListItem:", dayListItemClass)

  const spotsInfo = props.spots === 0 ? "no spots remaining" : (props.spots === 1 ? "1 spot remaining" : `${props.spots} spots remaining`);

  return (
    <li className={dayListItemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{spotsInfo}</h3>
    </li>
  );
}