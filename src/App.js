import React, { useState, useEffect } from 'react';

const UsingFetch = () => {
  const [data, setData] = useState([])

  const fetchData = () => {
      fetch("http://localhost:4000/data")
      .then(response => {
          return response.json()
      })
      .then(data => {
          setData(data)
      })
  }

  useEffect(() =>{
          fetchData()
  }, [])

  return(
      <div>
         <h2>Wearable Health Data</h2>

{data ? ( // Check if data is available
<div className="data">
  <div className="data-box">
    <p>Heart Rate: {data.heartRate} BPM</p>
  </div>
  <div className="data-box">
    <p>Temperature: {data.temperature} °C</p>
  </div>
  <div className="data-box">
    <p>
      Location: Lat {data.location?.lat}, Lng {data.location?.lng}
    </p>
  </div>
</div>
) : (
<p>Loading health d...</p> // Display a loading message until the data is fetched
)}
      </div>
  )

}

export default UsingFetch;
