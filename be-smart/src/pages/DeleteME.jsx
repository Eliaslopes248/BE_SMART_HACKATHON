import React from 'react'
import TextToSpeech from '../components/custom-input/TextToSpeech'
import SpeechToText from '../components/custom-input/SpeechToText'
import GoogleAuthButton from '../components/auth/GoogleAuthButton'
import { useContext } from 'react'
import { UserContext } from '../components/global-context/context_provider'

export default function DeleteME() {


  // =================== examples ==================
  /**
   * to access the users context
   * import { useContext } from 'react'
    import { UserContext } from '../components/global-context/context_provider'
    const {user, setUser}   = useContext(UserContext);

   */
  const {user, setUser}   = useContext(UserContext);

  return (
    <>

        <div className=''>Testing....</div>
        <TextToSpeech/> 
        <SpeechToText/> 
        <GoogleAuthButton/>
        
    </>
   
  )
}