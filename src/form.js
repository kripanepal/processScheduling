import React, { useEffect, useState } from "react";
import "./form.css";
import Fcfs from "./fcfs";

function Form() {
  const [type, setType] = useState();
  const [method, setMethod] = useState();
  const [processes, setProcesses] = useState([]);
  const [show, setShow] = useState(false);
  const [timeSlice, setTimeSlice] = useState(1);
  const [preemptiveMethod, setPreemptiveMethod] = useState("back");

  const [number, setNumber] = useState(1);

  useEffect(() => {
    // const arr = [];

    // arr.push(
    //   { process: 0, arrivalTime: 0, bustTime: 8 ,priority:1,deadline:15},
    //   { process: 1, arrivalTime: 1, bustTime: 1 ,priority:4,deadline:99999},
    //   { process: 2, arrivalTime: 1, bustTime: 5 ,priority:3,deadline:10},
    //   { process: 3, arrivalTime: 2, bustTime: 3 ,priority:2,deadline:18},
    //   { process: 4, arrivalTime: 3, bustTime: 1 ,priority:3,deadline:4},
    //   // { process: 5, arrivalTime:0, bustTime: 5,priority:2 }
    // );
    const arr = [];
    for (var i = 0; i < number; i++) {
      arr.push({ process: i, arrivalTime: i + 1, bustTime: i + 3 });
    }
    setProcesses(arr);
  }, []);

  const handleChange = (e) => {
    const { name, value, className } = e.target;
    const newProcess = [...processes];
    console.log(processes.length, number);

    for (var i = processes.length; i < number; i++) {
      newProcess.push({ process: i, arrivalTime: i + 1, bustTime: i + 3 });
    }

    newProcess[name][className] = value;
    setProcesses(newProcess);
  };

  const initialTable = () => {
    var toReturn = [];
    toReturn.push(
      <>
        <input
          className="fieldInput"
          type="text"
          disabled={true}
          placeholder="Process"
        />
        <input
          className="fieldInput"
          type="text"
          disabled={true}
          placeholder="Arrival time"
        />
        <input
          className="fieldInput"
          type="text"
          disabled={true}
          placeholder="CPU burst"
        />
        {type === "priority" ? (
          <input
            className="fieldInput"
            type="text"
            disabled={true}
            placeholder="Priority"
          />
        ) : null}
        {type === "deadline" ? (
          <input
            className="fieldInput"
            type="text"
            disabled={true}
            placeholder="deadline"
          />
        ) : null}
        <br />
      </>
    );
    for (let i = 0; i < number; i++) {
      toReturn.push(
        <>
          <input
            type="text"
            name={i}
            className="process"
            onChange={(e) => handleChange(e)}
          />
          <input
            className="arrivalTime"
            type="number"
            name={i}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="number"
            name={i}
            className="bustTime"
            onChange={(e) => handleChange(e)}
          />
          {type === "priority" ? (
            <input
              type="number"
              name={i}
              className="priority"
              onChange={(e) => handleChange(e)}
            />
          ) : null}
          {type === "deadline" ? (
            <input
              maxLength="3"
              type="number"
              name={i}
              className="deadline"
              onChange={(e) => handleChange(e)}
            />
          ) : null}
          <br />
        </>
      );
    }

    return (
      <>
        <form></form>
        {toReturn}
      </>
    );
  };

  const assignType = (e) => {
    setType(e.target.value);
  };
  const assignMethod = (e) => {
    setMethod(e.target.value);
  };
  const follow = () => {
    return (
      <Fcfs
        data={processes}
        method={method}
        type={type}
        timeslice={timeSlice}
        preemptiveMethod={preemptiveMethod}
      />
    );
  };
  const showTypes = () => {
    return (
      <>
        <input
          type="radio"
          name="type"
          value="fcfs"
          onClick={(e) => assignType(e)}
        />
        <label>FCFS</label>
        <br />
        <input
          type="radio"
          name="type"
          value="sjn"
          onClick={(e) => assignType(e)}
        />
        <label>SJN</label>
        <br />

        <input
          type="radio"
          name="type"
          value="priority"
          onClick={(e) => assignType(e)}
        />
        <label>Priority</label>
        <br />
        <input
          type="radio"
          name="type"
          value="deadline"
          onClick={(e) => assignType(e)}
        />
        <label>Deadline</label>
        <br />
        <input
          type="radio"
          name="type"
          value="roundRobin"
          onClick={(e) => assignType(e)}
        />
        <label>Round Robin</label>
        {type === "roundRobin" ? (
          <div>
            <input
              type="number"
              onChange={(e) => {
                setTimeSlice(e.target.value);
              }}
              style={{ width: "50px" }}
            />{" "}
            timeSlice
          </div>
        ) : null}
        <br />

        {/* Pre or non pre */}
 

        <br />
        <input
          type="radio"
          name="method"
          value="non"
          onClick={(e) => assignMethod(e)}
        />
        <label>Non-Preemptive</label>
        <br />

        <input
          type="radio"
          name="method"
          value="pre"
          onClick={(e) => assignMethod(e)}
        />

        <label>Preemptive </label>

        <br />
        <br />
        {method === "pre" ? (
          <div>
            <br />
            Which process gets priority if there is one entering the Ready queue
            and other leaving the CPU at the same time?
            <br />
            <input
              type="radio"
              value="front"
              name="queuePosition"
              onChange={(e) => {
                setPreemptiveMethod(e.target.value);
              }}
            />{" "}
            Process leaving the CPU
            <br />
            <input
              type="radio"
              value="back"
              name="queuePosition"
              defaultChecked={true}
              onChange={(e) => {
                setPreemptiveMethod(e.target.value);
              }}
            />{" "}
            Process Entering the Ready queue
            <br />
          </div>
        ) : null}

        {/* <button onClick={()=>follow()}>submit</button> */}
      </>
    );
  };
  return (
    <div className="App">
      <h2>Processes</h2>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      {initialTable()}
      {showTypes()}

      <input type="button" value="Calculate" onClick={() => setShow(true)} />
      {show ? follow() : null}
    </div>
  );
}

export default Form;
