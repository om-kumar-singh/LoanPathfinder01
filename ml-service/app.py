import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request

ARTIFACTS = Path(__file__).resolve().parent.parent / 'artifacts'
FEATURES_PATH = ARTIFACTS / 'features.json'
LRS_PATH = ARTIFACTS / 'lrs_model.joblib'
APR_PATH = ARTIFACTS / 'apr_model.joblib'
APPROVAL_PATH = ARTIFACTS / 'approval_model.joblib'

FEATURE_LABELS = {
    'monthlyIncome': 'Monthly income',
    'monthlyDebtPayment': 'Monthly debt payment',
    'creditUtilization': 'Credit utilization',
    'savingsBalance': 'Savings buffer',
    'employmentYears': 'Employment stability',
    'existingLoans': 'Number of existing loans',
    'creditHistoryYears': 'Credit history length',
    'desiredLoanAmount': 'Desired loan amount',
}

app = Flask(__name__)


def _ensure_model_artifacts():
    if not (FEATURES_PATH.exists() and LRS_PATH.exists() and APR_PATH.exists() and APPROVAL_PATH.exists()):
        from train_model import train_models

        train_models(str(ARTIFACTS))


def _load_models():
    _ensure_model_artifacts()
    with open(FEATURES_PATH, 'r', encoding='utf-8') as f:
        features = json.load(f)

    lrs_model = joblib.load(LRS_PATH)
    apr_model = joblib.load(APR_PATH)
    approval_model = joblib.load(APPROVAL_PATH)
    return features, lrs_model, apr_model, approval_model


def _to_frame(profile, features):
    values = {f: float(profile.get(f, 0)) for f in features}
    return pd.DataFrame([values])


def _explain_local_contributions(model_pipeline, row_df, features):
    scaler = model_pipeline.named_steps['scaler']
    linear_model = model_pipeline.named_steps['model']

    standardized = scaler.transform(row_df)[0]
    coefs = linear_model.coef_

    explanations = []
    for idx, feature in enumerate(features):
        contribution = float(coefs[idx] * standardized[idx])
        impact_points = float(np.round(contribution, 2))
        direction = 'helped' if impact_points >= 0 else 'hurt'
        explanations.append(
            {
                'feature': FEATURE_LABELS.get(feature, feature),
                'impactPoints': impact_points,
                'direction': direction,
                'insight': f"{FEATURE_LABELS.get(feature, feature)} {direction} your readiness by {abs(impact_points):.2f} points.",
            }
        )

    explanations.sort(key=lambda x: abs(x['impactPoints']), reverse=True)
    return explanations[:6]


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'ok': True, 'service': 'loanpathfinder-ml'})


@app.route('/predict', methods=['POST'])
def predict():
    payload = request.get_json(force=True)
    features, lrs_model, apr_model, approval_model = _load_models()

    row = _to_frame(payload, features)
    lrs = float(np.clip(lrs_model.predict(row)[0], 300, 900))
    apr = float(np.clip(apr_model.predict(row)[0], 6.5, 30))
    approval_prob = float(approval_model.predict_proba(row)[0][1] * 100)

    explanation = _explain_local_contributions(lrs_model, row, features)

    return jsonify(
        {
            'lrs': round(lrs, 2),
            'aprEstimate': round(apr, 2),
            'approvalProbability': round(approval_prob, 2),
            'explanation': explanation,
        }
    )


@app.route('/simulate', methods=['POST'])
def simulate():
    payload = request.get_json(force=True)
    profile = payload.get('profile', {})
    adjustments = payload.get('adjustments', {})

    updated = dict(profile)
    for key, delta in adjustments.items():
        updated[key] = float(updated.get(key, 0)) + float(delta)

    features, lrs_model, apr_model, approval_model = _load_models()

    current = _to_frame(profile, features)
    future = _to_frame(updated, features)

    current_apr = float(np.clip(apr_model.predict(current)[0], 6.5, 30))
    future_apr = float(np.clip(apr_model.predict(future)[0], 6.5, 30))

    current_lrs = float(np.clip(lrs_model.predict(current)[0], 300, 900))
    future_lrs = float(np.clip(lrs_model.predict(future)[0], 300, 900))

    current_approval = float(approval_model.predict_proba(current)[0][1] * 100)
    future_approval = float(approval_model.predict_proba(future)[0][1] * 100)

    return jsonify(
        {
            'before': {
                'lrs': round(current_lrs, 2),
                'aprEstimate': round(current_apr, 2),
                'approvalProbability': round(current_approval, 2),
            },
            'after': {
                'lrs': round(future_lrs, 2),
                'aprEstimate': round(future_apr, 2),
                'approvalProbability': round(future_approval, 2),
            },
            'delta': {
                'lrs': round(future_lrs - current_lrs, 2),
                'aprEstimate': round(future_apr - current_apr, 2),
                'approvalProbability': round(future_approval - current_approval, 2),
            },
        }
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
