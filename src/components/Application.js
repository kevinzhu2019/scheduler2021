import React, {useState, useEffect} from "react";
import axios from "axios";

import "./Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import {getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";

export default function Application() {

  const[state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })
  // const[day, setDay] = useState("Monday");
  // const[days, setDays] = useState([]);

  const setDay = newDay => setState(prev => ({...prev, day: newDay}));
  // const setDays = newDays => setState(prev => ({...prev, days: newDays}));

  const bookInterview = (id, interview) => {
    const appointment = {...state.appointments[id], interview: interview};
    const appointments = {...state.appointments, [id]: appointment};
    setState(prev => ({...prev, appointments: appointments}));
    // console.log(state.appointments[id]) 这里用consolelog看不到update，因为useState是异步调用
    axios.put(`/api/appointments/${id}`, {interview});
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const appointmentList = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        key={appointment.id}  
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
      />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={state.days}
            day={state.day}
            setDay={setDay}//useState's set function
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
