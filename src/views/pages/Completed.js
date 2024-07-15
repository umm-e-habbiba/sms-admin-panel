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
const Completed = () => {
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
  const [groupNames, setGroupNames] = useState([])
  const [groupName, setGroupName] = useState('')
  const [showFilteredResult, setShowFilteredResult] = useState(false)
  const [filteredUser, setFilteredUser] = useState([])
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getAllUsers()
      // getAllGroupNames()
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
  const getAllUsers = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'users', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          if (result.Users?.length > 0) {
            setallUsers(result.Users?.filter((user) => user.status == 'Unsubscribed'))
            getAllGroupNames(result.Users?.filter((user) => user.status == 'Unsubscribed'))
          } else {
            setLoader(false)
          }
        } else {
          setLoader(false)
        }
      })
      .catch((error) => console.error(error))
  }
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
          setAddModal(false)
          setSpinner(false)
          getAllUsers()
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
  const getAllGroupNames = (dataArray) => {
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
          if (result.uniqueGroupNames.length > 0) {
            setGroupNames(result.uniqueGroupNames)
            setGroupName(result.uniqueGroupNames[0])
            getFilteredUsers(result.uniqueGroupNames[0], dataArray)
            // setShowFilteredResult(true)
          }
        }
      })
      .catch((error) => console.error(error))
  }
  const getFilteredUsers = (value, usersArray) => {
    // console.log('step', filterUsmle, 'category', filterCategory)
    let filtered_result = []
    filtered_result = usersArray.filter((user) => user.groupName == value)
    setShowFilteredResult(true)
    setFilteredUser(filtered_result)
    setLoader(false)
  }
  return (
    <DefaultLayout>
      <CCard className="mb-3">
        <CCardHeader className="flex justify-between items-center bg-[#323a49] text-white">
          <span className="font-bold">Opt-Out Users ({allUsers.length})</span>
          <div className="flex justify-start items-center ">
            <span className="font-bold">Select your desired list: </span>
            <CFormSelect
              aria-label="Default select example"
              value={groupName}
              onChange={(e) => {
                getFilteredUsers(e.target.value, allUsers)
                setGroupName(e.target.value)
              }}
              className="ml-3 w-52 font-bold"
            >
              <option value="">Select List name</option>
              {groupNames && groupNames.length > 0
                ? groupNames.map((name, index) => (
                    <option value={name} key={index}>
                      {name}
                    </option>
                  ))
                : ''}
            </CFormSelect>
          </div>
        </CCardHeader>
        <CCardBody>
          {loader ? (
            <center className="mt-4">
              <CSpinner color="primary" variant="grow" />
            </center>
          ) : (
            <>
              {groupName && (
                <h1 className="text-center mb-3 font-bold ">
                  <span className="uppercase underline ">{groupName}</span> Total Opt-Out Users :{' '}
                  <span className="text-red-400">{filteredUser.length}</span>
                </h1>
              )}
              <CTable striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" className="text-center">
                      #
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[115px]">
                      First name
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[115px]">
                      Last name
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Phone
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[135px]">
                      Home Phone
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Phone2
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Phone3
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Phone4
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Phone5
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[340px]">
                      Address
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[155px]">
                      Messages sent
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center w-[155px]">
                      Status
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" className="text-center">
                      Date
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">
                      Time
                    </CTableHeaderCell> */}
                    {/* <CTableHeaderCell scope="col">Actions</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {showFilteredResult ? (
                    filteredUser && filteredUser.length > 0 ? (
                      filteredUser
                        .sort((a, b) => {
                          return new Date(b.date).getTime() - new Date(a.date).getTime()
                        })
                        .map((user, i) => (
                          <CTableRow key={i}>
                            <CTableDataCell scope="row" className="text-center align-middle">
                              {i + 1}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.firstName}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.lastName}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneOne}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneHome}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneTwo}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneThree}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneFour}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.phoneFive}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle w-auto">
                              {user.homeAddress}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              {user.numberOfMessages}
                            </CTableDataCell>
                            <CTableDataCell className="text-center align-middle">
                              <span className="text-yellow-400 font-bold">Opt-out</span>
                            </CTableDataCell>
                            {/* <CTableDataCell className="text-center align-middle">
                      {moment(user.date).format('Do MMMM YYYY')}
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      {moment(user.date).format('h:mm a')}
                    </CTableDataCell> */}
                            {/* <CTableDataCell>
                      <CButton
                        color="danger"
                        className="text-white py-2 my-2"
                        onClick={(e) => {
                          setDeleteModal(true)
                          setSmsId(x._id)
                          setError(false)
                          setErrorMsg('')
                        }}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell> */}
                          </CTableRow>
                        ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={14} className="text-center">
                          No SMS Sent in this list
                        </CTableDataCell>
                      </CTableRow>
                    )
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={14} className="text-center">
                        No list added yet
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CCardBody>
      </CCard>
      {/* add modal */}
      <CModal
        alignment="center"
        visible={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add User</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit(addUser)}>
          <CModalBody>
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
                        className="mb-2"
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
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAddModal(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit" disabled={spinner ? true : false}>
              {spinner ? <CSpinner color="light" size="sm" /> : 'Add'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </DefaultLayout>
  )
}
export default Completed
