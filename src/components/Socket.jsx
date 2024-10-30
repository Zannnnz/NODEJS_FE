import React from 'react'
import {io} from 'socket.io-client';


// tạo đối tượng client cho front end
const socket= io.connect("http://localhost:8080");
socket.on("send-number",(data) => {
   //data: number
  document.getElementById("noiDung").innerHTML =data;
})
export default function Socket() {
  return (
    <div className='text-white'>
      <button onClick={() => {
        socket.emit("send-click","");
      }}>Click</button>
      <p id='noiDung'>0</p>
      <button onClick={(params) => {
        socket.emit("send-click-reduce","")
      }
      }>
         Click Reduce
      </button>
    </div>
  )
}
