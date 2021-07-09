// Validation
const Joi = require("joi");

//register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(5).required(),
    });
    return schema.validate(data);
};
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(5).required(),
    });
    return schema.validate(data);
};
const listCreateValidation = (data) => {
    const schema = Joi.object({
        itemTitle: Joi.string().min(1).max(600).required(),
        itemDescription: Joi.string().min(1).max(600).required(),
    });
    return schema.validate(data);
};

const itemUpdateValidation = (data) => {
    const schema = Joi.object({
        itemId: Joi.string().min(6).max(600).required(),
        completed: Joi.boolean().required()
    });
    return schema.validate(data);
};
const itemDeleteValidation = (data) => {
    const schema = Joi.object({
        itemId: Joi.string().min(6).max(600).required(),
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.listCreateValidation = listCreateValidation;
module.exports.itemUpdateValidation = itemUpdateValidation;
module.exports.itemDeleteValidation = itemDeleteValidation;