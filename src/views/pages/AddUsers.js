import React, { useState, useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardTitle,
  CCardBody,
  CButton,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { API_URL } from '../../store'
import { useForm } from 'react-hook-form'
import moment from 'moment'
const AddUsers = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loader, setLoader] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [allUsers, setallUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [addModal, setAddModal] = useState(false)
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      status: '',
    },
  })
  const addUser = (data) => {
    console.log('adduser function called', data)
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      phone: data.phone,
      status: data.status,
    })

    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-user', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setSpinner(false)
          reset({})
          setSuccess(true)
          setSuccessMsg(result.message)
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setSpinner(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setSpinner(false)
      })
  }
  return (
    <DefaultLayout>
      <CCard className="mb-3">
        <CCardHeader className="flex justify-between items-center">
          <span>Add User</span>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(addUser)}>
            <CForm>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>Phone</CFormLabel>
                  <CRow>
                    <CCol md={12}>
                      <CFormInput
                        placeholder="Phone Number"
                        type="number"
                        {...register('phone', { required: true })}
                        feedback="Phone number is required"
                        invalid={errors.phone ? true : false}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    label="Status"
                    aria-label="status"
                    id="status"
                    defaultValue={getValues('status')}
                    options={[
                      { label: 'Select Status', value: '' },
                      { label: 'Pending', value: 'Pending' },
                      { label: 'Answered', value: 'Answered' },
                      { label: 'Failed', value: 'Failed' },
                    ]}
                    {...register('status', { required: true })}
                    feedback="Status is required"
                    invalid={errors.status ? true : false}
                  />
                </CCol>
              </CRow>
            </CForm>
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            <CButton color="primary" type="submit" disabled={spinner ? true : false}>
              {spinner ? <CSpinner color="light" size="sm" /> : 'Add User'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </DefaultLayout>
  )
}
export default AddUsers
