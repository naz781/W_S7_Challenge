import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}
const formSchema = yup.object().shape({
  fullName: yup.string()
    .trim()
    .required(validationErrors.fullNameRequired)
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup.string()
    .required(validationErrors.sizeRequired)
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
  toppings: yup.array().of(yup.string())
})

// 👇 Here you will create your schema.

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [formValues, setFormValues] = useState({ "fullName": "", "size": "", "toppings": [] })
  const [errors, setErrors] = useState({ "fullName": "", "size": "" })
  const [success, setSuccess] = useState(false)
  const [failure,setFailure] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const validate = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }))
  }
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
        const updatedToppings = checked
          ? [...formValues.toppings, value]
          : formValues.toppings.filter((topping) => topping !== value);
        setFormValues({ ...formValues, toppings: updatedToppings });
      }
    else {
      setFormValues({ ...formValues, [name]: value });
      validate(name, value)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:9009/api/order', formValues)
      .then((res) => {
        setFormValues({ "fullName": "", "size": "", "toppings": [] })
        setErrors({ "fullName": "", "size": "" })
        setSuccess(res.data.message)
        setFailure(false)
        setSubmitDisabled(true)
      })
      .catch((err) => {
        console.log(err)
        setFailure(err.response?.data?.message||"Something went wrong")
        setSuccess(false)
      })
  }
  useEffect(() => {
    if (formSchema) {
      formSchema.isValid(formValues).then(valid =>
        setSubmitDisabled(!valid))
    }
  }, [formValues])

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formValues.fullName}
            onChange={handleChange}
            />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size"
            name="size"
            value={formValues.size}
            onChange={handleChange} >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            {/* Fill out the missing options */}
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
          <div key={topping.topping_id}>
            <label>
              <input
                name="toppings"
                type="checkbox"
                value={topping.topping_id}
                checked={formValues.toppings.includes(topping.topping_id)}
                onChange={handleChange}
              />
              {topping.text}<br />
            </label>
          </div>
        ))}

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={submitDisabled} value="submit" />
    </form>
  )
}