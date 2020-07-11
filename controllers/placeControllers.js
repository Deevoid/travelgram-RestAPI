const throwError = require("../models/throwError");
const { v4: uuidv4 } = require("uuid");

const Place = require("../models/placedb");

const getPlaces = async (req, res, next) => {
  let result;
  try {
    result = await Place.find().exec();
  } catch (error) {
    return next(new throwError("Could not find any data", 404));
  }
  res.json({
    result: result.map((r) => r.toObject({ getters: true })),
  });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new throwError("Could not find Place by that id", 404));
  }

  if (!place) {
    return next(new throwError("Could not find Place by that ID", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const userID = req.params.uid;
  let userPlaces;
  try {
    userPlaces = await Place.find({ uid: userID }).exec();
  } catch (error) {
    return next(new throwError("Could not find places for that user", 404));
  }
  if (userPlaces.length <= 0) {
    return next(new throwError("Could not find places for that user", 404));
  }
  res.json({
    userPlaces: userPlaces.map((u) => u.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const { title, description, uid } = req.body;
  const createdPlace = new Place({
    title,
    description,
    uid,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    return next(new throwError("Could not save to DB", 500));
  }
  res.status(200).json(createdPlace);
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(placeId, {
      title,
      description,
    });
  } catch (error) {
    return next(new throwError("Could not update data", 500));
  }
  res.status(200).json({ message: "updated successfully", updatedPlace });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findByIdAndDelete(placeId);
  } catch (error) {
    return next(new throwError("Could not delete data", 500));
  }

  if (place.length <= 0) {
    throw new throwError("no place found ", 404);
  }
  res.status(200).json({ message: "deleted successfully" });
};

module.exports = {
  getPlaces: getPlaces,
  getPlaceById: getPlaceById,
  getPlaceByUserId: getPlaceByUserId,
  createPlace: createPlace,
  updatePlace: updatePlace,
  deletePlace: deletePlace,
};
