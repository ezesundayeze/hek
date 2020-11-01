const { Dispute } = require("../../models");
const response = require("../../utils/apiResponse");

const findOneDispute = async (verifiedToken, req, res, next) => {
  try {
    const { disputeId } = req.params;

    const dispute = await Dispute.findOne({ _id: disputeId }).or([
      { merchant: verifiedToken._id },
      { buyer: verifiedToken._id },
    ]);

    if (!dispute) {
      return res.status(404).json(response.error("No dispute found", 404));
    }
    return res.status(200).json(response.success("OK", dispute, 200));
  } catch (error) {
    next(error);
  }
};

const findAllDispute = async (verifiedToken, req, res, next) => {
  try {
    const dispute = await Dispute.find({})
      .or([{ merchant: verifiedToken._id }, { buyer: verifiedToken._id }])
      .populate({
        path: "author",
        model: "User",
        select: ["firstName", "lastName"],
      })
      .populate({
        path: "merchant",
        model: "User",
        select: ["firstName", "lastName"],
      })
      .populate({
        path: "buyer",
        model: "User",
        select: ["firstName", "lastName"],
      });

    if (dispute.length < 1) {
      return res.status(404).json(response.error("Dispute not found", 404));
    }
    return res.status(200).json(response.success("OK", dispute, 200));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findOneDispute,
  findAllDispute,
};
