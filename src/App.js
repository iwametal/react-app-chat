import React, { useRef, useState } from 'react';

// Stylesheet
import './App.css';

// Database
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Icons
import signout_icon from './assets/icons/logout.png'
import signin_icon from './assets/icons/login.png'

firebase.initializeApp({
  apiKey: "AIzaSyA5se0ppA0ncnPn8hYoQOWqR2OWJbJsKzE",
  authDomain: "app-chat-ecbcd.firebaseapp.com",
  projectId: "app-chat-ecbcd",
  storageBucket: "app-chat-ecbcd.appspot.com",
  messagingSenderId: "480244476668",
  appId: "1:480244476668:web:f7d91b6b478b7a94614579",
  measurementId: "G-ER4N5FGELF"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

if (process.env.NODE_ENV !== 'production') {
  analytics.disabled();
}

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>🪬🦊</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <img className='sign-in-img' onClick={signInWithGoogle} src={signin_icon}/>
    </>
  )

}

function SignOut() {
  // return auth.currentUser && (
  //   <button className="sign-out" onClick={() => auth.signOut()}><img src={signout_icon} className='sign-out-img'/>サインアウト</button>
  // )
  return auth.currentUser && (
    <img src={signout_icon} className='sign-out-img' onClick={() => auth.signOut()}/>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="メッセージを入力" />

      <button type="generic-button submit send-msg" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
      <p>{process.env.NODE_ENV}</p>
    </div>
  </>)
}


export default App;