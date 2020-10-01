import React, { useEffect, useState } from "react";
import "./styles.css";
function Fcfs(props) {
  const [results, setResult] = useState([]);

  var done = [];
  var line = [];
  var pastProcess = {};
  useEffect(() => {
    {
      console.log(props.data);
      calculate();
    }
  }, [props]);

  const insideCpu = (queue, currentTime, readyQueue) => {
    const currentProcess = queue.shift()[0];
    if (!currentProcess) return 0;
    if (props.method === "pre") {
      if (props.type === "roundRobin") {
        console.log(
          currentProcess.process,
          pastProcess.process,
          currentProcess.process === pastProcess.process,
          currentProcess.count
        );

        if (currentProcess.process === pastProcess.process) {
          if (currentProcess.count >= 1) {
            console.log("timesliced");
            currentProcess.count = -1;
            var add = true;
            readyQueue.map((element, i) => {
              if (element.arrivalTime === currentTime) {
                console.log(element);
                console.log("conflict");
                add = false;

                if (props.preemptiveMethod === "front") {
                  readyQueue.splice(i, 0, currentProcess);
                } else {
                  readyQueue.push(currentProcess);
                }
              }
            });

            if (add) {
              console.log("pusging");
              readyQueue.push(currentProcess);
            }
            return parseInt(0);
          }
        } else {
          pastProcess = currentProcess;
        }
      }

      if (currentProcess.remaining) {
        currentProcess.remaining--;
        currentProcess.count++;
      } else {
        // console.log("first time");
        currentProcess.remaining = currentProcess.bustTime - 1;
        currentProcess.count = 0;
      }
      if (currentProcess.remaining === 0) {
        currentProcess.outTime = parseInt(currentTime) + 1;
        done.push(currentProcess);
        return parseInt(1);
      } else {
        currentProcess.outTime = parseInt(currentTime) + 1;
        if (props.preemptiveMethod === "front") {
          readyQueue.splice(0, 0, currentProcess);
        } else {
          readyQueue.push(currentProcess);
        }

        return parseInt(1);
      }
    } else {
      const timeNeeded = parseInt(currentProcess.bustTime);
      currentProcess.outTime = parseInt(currentTime) + timeNeeded;
      done.push(currentProcess);
      console.log(done);
      return parseInt(timeNeeded);
    }
  };

  const reArrangeReadyQueue = (readyQueue) => {
    return readyQueue.sort(function (a, b) {
      if (props.type === "fcfs") {
        return a.arrivalTime - b.arrivalTime;
      }

      if (props.type === "sjn") {
        return a.bustTime - b.bustTime;
      }

      if (props.type === "priority") {
        if (a.priority === b.priority) {
          return a.process - b.process;
        }
        return a.priority - b.priority;
      }
      if (props.type === "deadline") {
        if (a.deadline === b.deadline) {
          return a.process - b.process;
        }
        return a.deadline - b.deadline;
      }
    });
  };

  const longTermScheduler = (
    time,
    originalQueue,
    pusheedToReadyStateQueue,
    readyQueue
  ) => {
    originalQueue.map((element, i) => {
      if (!pusheedToReadyStateQueue.includes(element)) {
        if (element.arrivalTime <= time) {
          readyQueue.push(element);

          pusheedToReadyStateQueue.push(element);
        }
      }
    });
  };

  const calculate = () => {
    var time = 0;
    const runningState = [];
    const processQueue = [...props.data];
    const readyQueue = [];
    const pusheedToReadyStateQueue = [];

    do {
      longTermScheduler(
        time,
        processQueue,
        pusheedToReadyStateQueue,
        readyQueue
      );
      //console.log(readyQueue.slice());
      if (props.type !== "roundRobin") {
        reArrangeReadyQueue(readyQueue);
      }

      if (readyQueue.length == 0) {
        line.push("none");

        time++;
      } else {
        const pushedElement = readyQueue.splice(0, 1);
        runningState.push(pushedElement);

        const timeTaken = insideCpu(runningState, time, readyQueue);
        for (let i = 0; i < timeTaken; i++) {
          line.push(pushedElement[0].process);
        }
        time += timeTaken;

        if (timeTaken != 0) {
          console.log(time);
        }
      }
      console.log(readyQueue.slice());
    } while (done.length !== props.data.length);
    console.log(line);
    setResult(done);
  };

  const showResults = () => {
    results.sort(function (a, b) {
      return a.process - b.process;
    });

    const toReturn = results.map((each) => {
      return (
        <>
          <tr>
            <td>P{each.process}</td>
            <td>{each.arrivalTime}</td>
            <td>{each.bustTime}</td>
            <td>{each.outTime}</td>
            <td>{each.outTime - each.arrivalTime}</td>
            <td>{each.outTime - each.arrivalTime - each.bustTime}</td>
          </tr>
        </>
      );
    });

    return (
      <div>
        <div>
          Type = {props.type}
          <br />
          Method={props.method}
        </div>

        <div>
          <table>
            <tr>
              <th>Process</th>
              <th>arrival time</th>
              <th>bust time </th>
              <th>out time</th>
              <th>turn around time</th>
              <th>wait time</th>
            </tr>
            {toReturn}
          </table>
        </div>
      </div>
    );
  };
  if (props.type === "fcfs" && props.method === "pre") {
    return <div>Can't process</div>;
  }

  if (props.type === "roundRobin" && props.method !== "pre") {
    return <div>Can't process</div>;
  }
  return <div>{showResults()} </div>;
}

export default Fcfs;
