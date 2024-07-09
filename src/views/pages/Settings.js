import React, { useState, useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormTextarea,
  CSpinner,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import { API_URL } from '../../../src/store'

const Settings = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [smsLoading, setSmsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [textMessage, setTextMessage] = useState('')
  const [groupName, setGroupName] = useState('')
  const [textMessageError, setTextMessageError] = useState('')
  const [groupNameError, setGroupNameError] = useState('')
  const [callError, setCallError] = useState(false)
  const [callErrorMsg, setCallErrorMSg] = useState('')
  const [groupNames, setGroupNames] = useState([])

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      getAllUsers()
    } else {
      navigate('/login')
    }
  }, [])
  const getAllUsers = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'all-groupnames', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.status == 'success') {
          // setallUsers(result.Users?.filter((user) => user.status == 'Failed'))
          setGroupNames(result.uniqueGroupNames)
        }
      })
      .catch((error) => console.error(error))
  }
  const sendSMS = () => {
    setError(false)
    setErrorMsg('')
    setTextMessageError('')
    setGroupNameError('')
    setSmsLoading(true)
    if (textMessage != '' && groupName != '') {
      const myHeaders = new Headers()
      myHeaders.append('Authorization', token)
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        smsText: textMessage,
        groupName: groupName,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(API_URL + 'send-sms', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log(result)
          setSmsLoading(false)
          if (result.status == 'success') {
            setSuccess(true)
            setTextMessage('')
            setSuccessMsg(result.message)
            getSMSSettings()
            setTimeout(() => {
              setSuccess(false)
              setSuccessMsg('')
            }, 3000)
          } else {
            setTextMessageError(result.message)
          }
        })
        .catch((error) => {
          console.error(error)
          setSmsLoading(false)
        })
    } else {
      if (textMessage == '') {
        setTextMessageError('SMS is required')
      }
      if (groupName == '') {
        setGroupNameError('Group name is required')
      }
      setSmsLoading(false)
    }
  }
  return (
    <DefaultLayout>
      <CCard className="mb-3">
        <CCardHeader>SMS Settings</CCardHeader>
        <CCardBody>
          <CFormSelect
            aria-label="Default select example"
            label="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-3"
          >
            <option>Select group name</option>
            {groupNames && groupNames.length > 0
              ? groupNames.map((name, index) => (
                  <option value={name} key={index}>
                    {name}
                  </option>
                ))
              : ''}
          </CFormSelect>
          {groupNameError && <div className="text-red-400 my-3">{groupNameError}</div>}
          <CFormTextarea
            rows={5}
            placeholder="Enter Message Here..."
            className="mb-3"
            label="Message"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
          />
          {textMessageError && <span className="text-red-400 mt-3">{textMessageError}</span>}
          <center>
            <CButton
              color="primary"
              type="submit"
              className="px-4 mt-3 mb-5"
              disabled={smsLoading ? true : false}
              onClick={sendSMS}
            >
              {smsLoading ? <CSpinner color="light" size="sm" /> : 'Send'}
            </CButton>
          </center>
        </CCardBody>
      </CCard>
      {success && (
        <CAlert color="success" className="success-alert uppercase">
          {successMsg}
        </CAlert>
      )}
      {callError && (
        <CAlert color="danger" className="success-alert uppercase">
          {callErrorMsg}
        </CAlert>
      )}
    </DefaultLayout>
  )
}
export default Settings
