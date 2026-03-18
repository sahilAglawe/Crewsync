import React, { useEffect, useState } from "react";
import API from "./api";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/students")
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>Students List</h2>
      {students.map((s) => (
        <p key={s.id}>{s.name}</p>
      ))}
    </div>
  );
}

export default Students;