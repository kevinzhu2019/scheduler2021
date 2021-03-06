import React from "react";
import "./styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {

  // console.log("props from Appointment:", props.interview)

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  const onAdd = () => {
    transition(CREATE);
  }

  const onCancel = () => {
    back();
  }

  const save = (name, interviewer) => {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    }
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
      props.setSpots(props.day, props.dailySpots - 1);
    })
    .catch(error => {
      transition(ERROR_SAVE, true);
    });
  }

  const deleteInterview = (id) => {
    transition(DELETING, true)
    props.cancelInterview(id)
    .then(res => {
      transition(EMPTY);
      props.setSpots(props.day, props.dailySpots + 1);
    })
    .catch(() => transition(ERROR_DELETE, true));
  }

  const confirm = () => {
    transition(CONFIRM);
  }

  const edit = () => {
    transition(EDIT);
  }

  const onClose = () => {
    back();
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && (
        <Empty 
          onAdd={onAdd}
        />
      )}
      {mode === SHOW && (
        <Show
          id={props.id} 
          student={props.interview.student} 
          interviewer={props.interview.interviewer}
          confirm={confirm}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status 
          message={"Now Saving..."}
        />
      )}
      {mode === DELETING && (
        <Status 
          message={"Now Deleting..."}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message={"Are you sure to delete the appointment?"}
          onCancel={onCancel}
          deleteInterview={deleteInterview}
          id={props.id}
        />
      )}
      {mode === EDIT && (
        <Form
          id={props.id}
          student={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}//?????????????????????id??????????????????interviewer obj
          onCancel={onCancel}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message={"Could not save the new appointment, try again later!"}
          onClose={onClose}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message={"Could not delete the appointment, try again later!"}
          onClose={onClose}
        />
      )}
    </article>
  )
}

/**
 * ????????????api writing??????????????????mode transition????????????call???bookInterview???????????????.then??????transition??????
 * The one-second delay has been added to the server so that it is easier to test the status functionality. Normally this response will come back within milliseconds.
 * API server????????????????????????delay???????????????status change????????????saving?????????deleting??????????????????????????????????????????1????????????status component??????????????????
 */
