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
  let interviewToReturn = {
    student: null,
    interviewer: null
  };
  interviewToReturn.student = interview.student;
  const interviewerID = interview.interviewer;
  interviewToReturn.interviewer = state.interviewers[interviewerID];
  return interviewToReturn;
}

function getInterviewersForDay(state, day) {
  const interviewersForDay = [];
  for(const oneDay of state.days) {
    if(oneDay.name === day) {
      for(const interviewer of oneDay.interviewers) {
        interviewersForDay.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewersForDay;
}

function getSpotsForDay(state, day) {
  for(let i = 0; i < state.days.length; i++) {
    if(day === state.days[i].name) {
      return state.days[i].spots;
    }
  }
}

export {getAppointmentsForDay, getInterview, getInterviewersForDay, getSpotsForDay}
/**
 * 注意第15行，新建一个专门用于返回的interview Obj，千万不能直接把传入的interview参数改掉，会造成crash，
 * 具体表现：点击一个day，再点击另一个day，然后回到第一个day，React crash
 * 
 * 因为在Application component里，当原始数据写到local之后，会用appointmentList function做一些transformation，然后在appointmentList的map里，把每个appoinetment里的interview object作为interview参数给到第二个getInterview函数，如果我们直接把这个作为raw data的appointment.interview改了，具体就是把interviewer的ID换成了detail的interviewer的info，这样第一次正常显示没问题，如果要再reload这一天的appointment的话就会发生interviewer ID找不到的错误（因为应该是id的地方被改成了interviewer的detail了）
 * 例如：interview: { student: "Archie Cohen", interviewer: 2 }，interview obj作为参数传入getInterviewer，里面的interviewer是个id，如果直接改掉的话在下一次reload就会找不到id而crash
 * 此时如果检查state.appointments data,就会发现这个被改掉的appointments.interview.interviewer
 */