import React, {useState} from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {

  const[name, setName] = useState(props.name || "");
  const[interviewer, setInterviewer] = useState(props.interviewer || null)

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={e => setName(e.target.value)}//Value和onChange可以理解为在原来的useState外面再套一层，value = something, onChange={setSomething},然后Value就被onChange监控，一旦改变就渲染页面.Value and onChange have to be used on pair, CANNOT be used alone!!!
            onSubmit={e => e.preventDefault()}
          />
        </form>
        {/* <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} /> */}
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={props.onSave}>Save</Button>
        </section>
      </section>
    </main>
  )
}