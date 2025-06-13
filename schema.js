const joi = require("joi");

const ListingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().min(0).required(),
    image: joi.string().allow("", null)
});

const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required()
});

module.exports = { ListingSchema ,reviewSchema};