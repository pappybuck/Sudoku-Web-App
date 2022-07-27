import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Album from '../components/Album'

const Home: NextPage = () => {
  return (    
    <div className="App">
      <div>This is the frontend</div>
      <header className="App-header">
        <Album path='http://localhost:3001/' key='1'/>
      </header>
    </div>
  );
}

export default Home
