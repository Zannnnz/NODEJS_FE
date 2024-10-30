import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { io } from 'socket.io-client';
import { getUserAPI } from '../utils/fetchFromAPI';

// Tạo đối tượng client cho FE
const socket = io("ws://localhost:8080");

const Footer = () => {

    const showChat = (show) => {
        document.querySelector("#formChat").style.display = show;
    }
    const [drawer, setDrawer] = useState(0);
    const [user, setUser] = useState([]);
    const [toUserId, setToUserId] = useState(0);
    const [dataChat, setDataChat] = useState([]);

    // Nhận event từ server
    useEffect(() => {
        getUserAPI()
            .then((result) => {
                setUser(result);
            })
            .catch();

    }, [])

    useEffect(() => {
        socket.on("sv-send-mess", ({ user_id, content }) => {
            let newData = [...dataChat];
            newData.push({ user_id, content });
            setDataChat(newData);
        })
    }, [dataChat]);

    return (
        <div>
            <button className="open-button" style={{ bottom: 50 }} onClick={() => setDrawer(250)}>
                <i className="fa fa-users" aria-hidden="true" />
            </button>

            <div className="chat-popup" id="formChat">
                <div className="chatHead">
                    <p className="chatName" onClick={() => setDrawer(250)}>
                        <i className='fa fa-users'></i> List friend
                    </p>
                    <button type="button" className="chatClose" aria-label="Close" onClick={() => showChat("none")}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <ol className="discussion" id="chat-noiDung">
                    {dataChat?.map((item) => {
                        // Lấy token từ local storage
                        let userLogin = localStorage.getItem("LOGIN_USER");

                        // Decode token để lấy user_id
                        let userInfo = userLogin ? jwtDecode(userLogin) : null;
                        let user_id = userInfo?.payload?.userId;

                        if (user_id === item.user_id) {
                            return (
                                <li className="self">
                                    <div className="avatar">
                                        <img src="http://dergipark.org.tr/assets/app/images/buddy_sample.png" alt="avatar"/>
                                    </div>
                                    <div className="messages">
                                        {item.content}
                                        <br />
                                        <time dateTime="2009-11-13T20:14">2/2/2022 22:22</time>
                                    </div>
                                </li>
                            );
                        } else {
                            return (
                                <li className="other">
                                    <div className="avatar">
                                        <img src="http://dergipark.org.tr/assets/app/images/buddy_sample.png" alt="avatar"/>
                                    </div>
                                    <div className="messages">
                                        {item.content}
                                        <br />
                                        <time dateTime="2009-11-13T20:00">2/2/2022 22:22</time>
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ol>
                <div className="chatBottom">
                    <input id="txt-chat" className="sentText" type="text" placeholder="Your Text" 
                        style={{ flex: 1, border: '1px solid #0374d8', borderRadius: 20, padding: '0 20px' }} />

                    <button id="btn-send" onClick={() => {
                        let userLogin = localStorage.getItem("LOGIN_USER");

                        let userInfo = userLogin ? jwtDecode(userLogin) : null;
                        console.log(userInfo);

                        let user_id = userInfo?.payload?.userId;
                        let content = document.getElementById("txt-chat").value;

                        socket.emit("send-mess", { user_id, content });
                    }} type="button" className="sendbtn" aria-label="Close">
                        <span aria-hidden="true"><i className="fa-regular fa-paper-plane"></i></span>
                    </button>
                </div>
            </div>

            <div style={{ width: drawer }} className='sidenav'>
                <a href="javascript:void(0)" className="closebtn" onClick={() => setDrawer(0)}>×</a>
                {user.map(item => (
                    <a key={item.userId} href="#" onClick={() => showChat("block")}>
                        <img
                            width={40}
                            src={item.avatar && item.avatar.startsWith('http://')
                                ? item.avatar
                                : `http://localhost:8080/${item.avatar || 'default_avatar.png'}`}
                            alt={item.full_name}
                            style={{ marginRight: 10 }}
                        />
                        {item.full_name}
                    </a>
                ))}
                <hr />
            </div>
        </div>
    );
}

export default Footer;
