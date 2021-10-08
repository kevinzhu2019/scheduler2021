import React, {useState, useEffect} from "react";
import axios from "axios";

import "./Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import {getAppointmentsForDay, getInterview, getInterviewersForDay, getSpotsForDay} from "helpers/selectors";

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

  const bookInterview = async (id, interview) => {
    const appointment = {...state.appointments[id], interview: interview};
    const appointments = {...state.appointments, [id]: appointment};
    setState(prev => ({...prev, appointments: appointments}));
    // console.log(state.appointments[id]) 这里用consolelog看不到update，因为useState是异步调用
    await axios.put(`/api/appointments/${id}`, {interview});
  }

  const cancelInterview = async id => {
    const deletedAppointment = {
      ...state.appointments[id], interview: null
    }
    // const appointments = {
    //   ...state.appointments, [id]: deletedAppointment
    // }
    // setState(prev => ({...prev, appointments: appointments}))//这次看看需不需要刷state
    await axios.delete(`/api/appointments/${id}`, deletedAppointment);
  }

  const setSpots = (day, newSpots) => {
    const newDays = [...state.days];
    for(let i = 0; i < newDays.length; i++) {
      if(day === newDays[i].name) {
        newDays[i] = {
          ...newDays[i], spots: newSpots
        }
      }
    }
    setState(prev => ({...prev, days: newDays}));
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

  const dailySpots = getSpotsForDay(state, state.day);

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
        cancelInterview={cancelInterview}
        dailySpots={dailySpots}
        day={state.day}
        setSpots={setSpots}
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

/**
 * 在cancelInterview里，当一个interview被delete以后，不需要对本地的state重写，设想在error handling状态下，api server写入失败，这样close error message以后应该能回到之前的状态，如果在delete是刷写了state，那么在close error message 以后系统会找不到props而crash
 */
