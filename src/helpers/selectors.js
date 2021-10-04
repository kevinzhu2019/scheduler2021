function getAppointmentsForDay(state, day) {
  const appointmentsForDay = [];
  for(const oneDay of state.days) {
    if(oneDay.name === day) {
      for(const appointment of oneDay.appointments) {
        appointmentsForDay.push(state.appointments[appointment]);
      }
    }
  }
  return appointmentsForDay;
}

function getInterview(state, interview) {
  if(!interview) return null;
  const interviewerID = interview.interviewer;
  interview.interviewer = state.interviewers[interviewerID];
  return interview;
}

export {getAppointmentsForDay, getInterview}