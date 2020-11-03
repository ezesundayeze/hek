const { Dispute, Transaction } = require("../../models");
const response = require("../../utils/apiResponse");
const { ObjectId } = require("mongoose").Types;

const updateDispute = async (verifyToken, req, res, next) => {
  try {
    const payload = req.params;
    const doc = req.body;

    const findDispute = await Dispute.findOne({
      _id: payload.disputeId,
      author: verifyToken._id,
    });

    if (!findDispute) {
      return res
        .status(401)
        .json(
          response.error("you are not authorize to update this dispute.", 401)
        );
    }

    const dispute = await Dispute.findOneAndUpdate(
      { _id: findDispute._id },
      { status: doc.status },
      { new: true }
    );

    return res.status(200).json(response.success("Ok", dispute, 200));
  } catch (error) {
    next(error);
  }
};

module.exports = { updateDispute };
