const router = require("express").Router();
const verify = require('../private');
const User = require("../../model/User");
const List = require("../../model/List");
const {listCreateValidation, itemUpdateValidation, itemDeleteValidation} = require('../../validation');
const {successHandler,errorHandler} = require('../../log/configLogger');
const logger = require('../../log/logger')

router.get("/", successHandler,errorHandler, verify, async (req, res) => {
  
  // Finding the listItems for a UserID
  try{
    const list = await List.find({userId: req.user._id}).exec();
    if(!list) return res.sendStatus(404);
    //log
    logger.info('list fetched for user:'+ req.user._id);
    res.json(list)
  } catch(err){
    //log
    logger.error('list fetched failed:'+ err);
    res.status(400).send(err);
  }
});
router.post("/create", successHandler,errorHandler,verify, async (req, res) => {

  // Validate the data
  const {error} = listCreateValidation(req.body);

  if(error) return res.status(400).send(error.details[0].message);

  // Creating new item
  const listItem = new List({
    userId: req.user._id,
    itemTitle: req.body.itemTitle,
    itemDescription: req.body.itemDescription,
  });
  try {
    const savedItem = await listItem.save();
    //log
    logger.info('new item created for user:'+ req.user._id);

    res.json(savedItem);
  } catch (err) {

    //log
    logger.error('new item failed for user:'+ req.user._id);
    res.status(400).send(err);
  }
});

router.put("/updateStatus", successHandler,errorHandler, verify, async (req, res) => {
  // Validate the data
  const {error} = itemUpdateValidation(req.body);

  if(error) return res.status(400).send(error.details[0].message);

  // Updating the item(toggling the current status)
  try {
    const updateRes = await List.updateOne({_id: req.body.itemId}, {completed: !req.body.completed});
    //log
    logger.info('list item status changed for item:'+ req.body.itemId);

    res.json({status: true});
  } catch (err) {
    //log
    logger.info('list item status change falied:'+ err);
    res.status(400).send(err);
  }
});

router.delete("/deleteItem", successHandler,errorHandler,verify, async (req, res) => {
  // Validate the data
  const {error} = itemDeleteValidation(req.body);

  if(error) return res.status(400).send(error.details[0].message);

  // Deleting the item
  try {
    const item = await List.findByIdAndDelete(req.body.itemId);
    if (!item) return res.sendStatus(404);

    //log
    logger.info('item deleted for id:'+ req.body.itemId);

    res.status(200).json(item);
  } catch (err) {
    //log
    logger.error('deleting item failed for:'+ req.body.itemId);
    res.status(400).send(err);
  }
});

module.exports = router;
