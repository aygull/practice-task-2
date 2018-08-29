"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as express from "express";
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
let goods = [];
let Product = [];
let balance;
balance = 0;
let Saled = [];
app.post("/product", (req, res) => {
    for (let field in req.body) {
        if ((field !== "name") && (field !== "price") && (field !== "manufacturer"))
            return res.status(400).send({
                message: "Not all fields are fulled"
            });
    }
    if ((isNaN(req.body.price)) || (req.body.price < 0)) {
        return res.status(400).send({
            message: "Price is not a number or number<0"
        });
    }
    for (let i of Product) {
        if (i.name === req.body.name) {
            return res.status(400).send({
                message: "This product already used"
            });
        }
    }
    Product.push({ name: req.body.name, price: Number(req.body.price), manufacturer: req.body.manufacturer, number_sales: 0 });
    goods.push(req.body.name);
    return res.send("OK");
});
app.get("/product", (req, res) => {
    if (req.query.name === undefined || req.query.name === "") {
        return res.status(400).send({
            message: "Incorrect enter"
        });
    }
    for (let i of Product) {
        if (req.query.name === i.name) {
            return res.send({
                manufacturer: i.manufacturer,
                price: i.price,
                number_sales: i.number_sales
            });
        }
    }
    return res.status(400).send({
        message: "This object not found"
    });
});
app.delete("/product", (req, res) => {
    if (req.query.name === undefined || req.query.name === "") {
        return res.status(400).send({
            message: "The field is empty"
        });
    }
    for (let i of Product) {
        if (i.name === req.query.name) {
            Product.splice(Product.indexOf(i), 1);
            goods.splice(goods.indexOf(i.name), 1);
            return res.status(200).send({
                message: "OK"
            });
        }
    }
    return res.status(400).send({
        message: "This object not found"
    });
});
app.post("/order", (req, res) => {
    if (req.query.name === undefined || req.query.name === "") {
        return res.status(400).send({
            message: "The field is empty"
        });
    }
    for (let i of Product) {
        if (i.name === req.query.name) {
            balance += i.price;
            i.number_sales++;
            Saled.push({ name: i.name, price: Number(i.price), date: String(new Date()) });
            return res.status(200).send({});
        }
    }
    return res.status(400).send({
        message: "This object not found"
    });
});
app.get("/order", (req, res) => {
    return res.send(Saled);
});
app.get("/goods", (req, res) => {
    if (goods.length === 0) {
        return res.status(400).send({
            message: "Objects are empty"
        });
    }
    return res.send(goods);
});
app.get("/balance", (req, res) => {
    res.send({
        balance: balance
    });
});
app.listen(3000, () => console.log("started"));
