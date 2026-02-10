import FinancialProfile from '../models/FinancialProfile.js';

export const upsertProfile = async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };

  const profile = await FinancialProfile.findOneAndUpdate(
    { userId: req.user.id },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.json(profile);
};

export const getProfile = async (req, res) => {
  const profile = await FinancialProfile.findOne({ userId: req.user.id });
  if (!profile) {
    return res.status(404).json({ message: 'Financial profile not found' });
  }

  return res.json(profile);
};
