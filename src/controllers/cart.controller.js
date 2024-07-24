"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const { addToCartService, updateCartService, deleteUserCartService, getListUserCartService } = require("../services/cart.service");
const addToCart = async (req, res, next) => {
    console.log("req::", req.body)
  new CREATED({
    message: "cart created",
    metadata: await addToCartService({
      userId: req.user.userId,
      ...req.body
    }),
  }).send(res);
};


const updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "cart updated",
      metadata: await updateCartService({
        userId: req.user.userId,
        ...req.body
      }),
    }).send(res);
  };
const deleteCart = async(req, res, next) => {
    new SuccessResponse({
        message: 'deleted products',
        metadata: await deleteUserCartService({
            userId: req.user.userId,
           ...req.body
        })
    }).send(res)
}

const getListUserCart = async (req,res, next)=> {
    new SuccessResponse({
        message: 'cart list',
        metadata: await getListUserCartService({
            userId: req.user.userId,
        })
    }).send(res)
}

module.exports= {
    addToCart,
    updateCart,
    deleteCart,
    getListUserCart,
 
}