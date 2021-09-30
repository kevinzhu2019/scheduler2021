import React from "react";
import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  let interviewerClass = "interviewers__item";
  if(props.selected) interviewerClass += "--selected";

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}