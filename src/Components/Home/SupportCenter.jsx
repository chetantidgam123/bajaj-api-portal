import React, { useEffect } from 'react'
import Header from "../user/layout/Header"
import FooterHome from "./FooterHome"
import { scrollToTop } from '../../Utils'

const SupportCenter = () => {

useEffect(() => {
  scrollToTop()
}, [])

  return (
    <div>
           <Header />
      <section className='support-bg'>
       <div className='container'>
         <div className='row justify-content-center support-center'>
<h1 className='text-white text-center'>Support Center</h1>
        </div>
       </div>
      </section>
      <section>
<div className='container  margin-top-100px'>
<div className='row justify-content-center'>
<div className='col-12 mt-4'>
<div className="chat-container">
    <div className="chat-box">
      <div className="message bot">
        <div className="assistant-label">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" className="avatar" alt=""/>
          AI Assistant
        </div>
        <div className="bubble">👋 Hi, I’m your virtual assistant! How can I help you?</div>
        <div className="timestamp">05:30 PM, 3 October</div>
      </div>

      <div className="message user">
      <div className='d-flex justify-content-end align-items-center'>
        <p className='pe-3 mb-0'>Ashwini</p>
        <div className='user-img'>
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" className="user-img  w-100" alt=""/>
        </div>
      </div>
        <div className="bubble mt-2">What is an API and how does it work?</div>
        <div className="timestamp">05:30 PM, 3 October</div>
      </div>

      <div className="message bot">
        <div className="assistant-label">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" className="avatar" alt="" />
          AI Assistant
        </div>
        <div className="bubble">
          An API (Application Programming Interface) allows applications to communicate with each other.
          It exposes endpoints that developers can use to send or retrieve data.
        </div>
        <div className="timestamp">05:30 PM, 3 October</div>
      </div>
        <div className="chat-input-container mt-5">
    <input type="text" placeholder="Type a message"/>
    <label className="upload-label" title="Attach file">
     <i className="fas fa-paperclip"></i>
    </label>
    <input id="file-upload" type="file"/>
    <button className="send-btn">
      <i>↑</i>
    </button>
  </div>
    </div>

  

  </div>
</div>
</div>
</div>
      </section>
               <FooterHome />
    </div>
  )
}

export default SupportCenter