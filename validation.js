//VALIDATION
const Joi = require('@hapi/joi');


//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name:Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().min(1).required(),
    })
    
return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    
return schema.validate(data)
}

//Ticket Validation
const ticketValidation = (data) => {
    const schema = Joi.object({
        name:Joi.string().min(1).required(),
        deptName:Joi.string().min(1).required(),
        price:Joi.string().min(1).required(),
        start:Joi.string().min(1).required(),
        dest:Joi.string().min(1).required(),
        departureTime:Joi.string().min(1).required(),
        arrivalTime:Joi.string().min(1).required(),
        duration:Joi.string().min(1),
        company:Joi.string().min(1),
        quota:Joi.string().min(1).required()
        
    })
    
return schema.validate(data)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.ticketValidation = ticketValidation;
