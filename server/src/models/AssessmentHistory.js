import mongoose from 'mongoose';

const assessmentHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lrs: { type: Number, required: true },
    approvalProbability: { type: Number, required: true },
    aprEstimate: { type: Number, required: true },
    explanation: [
      {
        feature: String,
        impactPoints: Number,
        direction: String,
        insight: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('AssessmentHistory', assessmentHistorySchema);
