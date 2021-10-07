import React from "react";
import "./styles.scss";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
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
    .then((res) => transition(SHOW));
  }

  const deleteInterview = (id) => {
    transition(DELETING)
    props.cancelInterview(id)
    .then((res) => transition(EMPTY))
  }

  const confirm = () => {
    transition(CONFIRM);
  }

  const edit = () => {
    transition(EDIT);
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
          interviewer={props.interview.interviewer.id}//此处要传递的是id，而不是整个interviewer obj
          onCancel={onCancel}
          onSave={save}
        />
      )}
    </article>
  )
}

/**
 * 要求是在api writing完成以后再左mode transition，因此在call完bookInterview方法以后用.then调用transition函数
 * The one-second delay has been added to the server so that it is easier to test the status functionality. Normally this response will come back within milliseconds.
 * API server已经加上了一秒的delay，为了表现status change的间隔（saving。。。deleting。。。），如果没有人为加入的1秒间隔，status component就很难看得到
 */
