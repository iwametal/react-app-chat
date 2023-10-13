import React from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/> }
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithGoogle(provider);
  }

  return (
    <button onCLick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  // const 

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form>
        <input/>

        <button type="submit">➡️</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, picURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={picURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
