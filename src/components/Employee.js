import React, { useState, useEffect } from 'react';
import CaptureImage from './CaptureImage'

const defaultImageSrc = '/img/image_placeholder.png'

const initialFieldValues = {
    id: 0,
    name: '',
    email: '',
    managerName:'',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null
}

export default function Employee(props) {

    const { addOrEdit, recordForEdit } = props

    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (recordForEdit != null)
            setValues(recordForEdit);
    }, [recordForEdit])

    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }

    const validate = () => {
        let temp = {}
        temp.name = values.name == "" ? false : true;
        temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
        setErrors(temp)
        return Object.values(temp).every(x => x == true)
    }

    const resetForm = () => {
        setValues(initialFieldValues)
        document.getElementById('image-uploader').value = null;
        setErrors({})
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const formData = new FormData()
            formData.append('id', values.id)
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('imageName', values.imageName)
            formData.append('imageFile', values.imageFile)
            formData.append('managerName', values.managerName)
            addOrEdit(formData, resetForm)
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '')

    return (
        <>
            <div className="container text-center">
                <p className="lead">Employee Registration for Attendance</p>
            </div>
            <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} className="card-img-top" />
                    <div className="card-body">
                        <div className="form-group">
                            <CaptureImage type="file" accept="image/*" className={"form-control-file" + applyErrorClass('imageSrc')}
                                onChange={showPreview} id="image-uploader" />
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applyErrorClass('name')} placeholder="Employee Name" name="name"
                                value={values.name}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applyErrorClass('email')} placeholder="Email" name="email"
                                value={values.email}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applyErrorClass('managerName')} placeholder="Manager Name" name="managerName"
                                value={values.managerName}
                                onChange={handleInputChange} />
                        </div>
                        
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
