import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42
FEATURES = [
    'monthlyIncome',
    'monthlyDebtPayment',
    'creditUtilization',
    'savingsBalance',
    'employmentYears',
    'existingLoans',
    'creditHistoryYears',
    'desiredLoanAmount',
]


def generate_synthetic_data(size=5000):
    rng = np.random.default_rng(RANDOM_STATE)
    monthly_income = rng.normal(70000, 25000, size).clip(18000, 250000)
    debt_payment = rng.normal(15000, 9000, size).clip(500, 90000)
    credit_util = rng.uniform(5, 95, size)
    savings = rng.normal(180000, 120000, size).clip(0, 1000000)
    employment_years = rng.uniform(0.5, 20, size)
    existing_loans = rng.integers(0, 6, size)
    credit_history = rng.uniform(0.5, 25, size)
    desired_loan = rng.normal(350000, 180000, size).clip(25000, 1500000)

    dti = debt_payment / monthly_income

    readiness_raw = (
        740
        + monthly_income / 1500
        - dti * 300
        - credit_util * 2.1
        + savings / 12000
        + employment_years * 4.5
        - existing_loans * 12
        + credit_history * 2.4
        - desired_loan / 30000
        + rng.normal(0, 25, size)
    )
    lrs = readiness_raw.clip(300, 900)

    apr = (
        21
        - (lrs - 300) / 65
        + dti * 7
        + existing_loans * 0.5
        + (desired_loan / monthly_income) * 0.06
        + rng.normal(0, 0.7, size)
    ).clip(6.5, 30)

    approved = (lrs > 620).astype(int)

    df = pd.DataFrame(
        {
            'monthlyIncome': monthly_income,
            'monthlyDebtPayment': debt_payment,
            'creditUtilization': credit_util,
            'savingsBalance': savings,
            'employmentYears': employment_years,
            'existingLoans': existing_loans,
            'creditHistoryYears': credit_history,
            'desiredLoanAmount': desired_loan,
            'lrs': lrs,
            'apr': apr,
            'approved': approved,
        }
    )
    return df


def train_models(output_dir='artifacts'):
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    df = generate_synthetic_data()

    X = df[FEATURES]
    y_lrs = df['lrs']
    y_apr = df['apr']
    y_approval = df['approved']

    X_train, X_test, y_lrs_train, y_lrs_test = train_test_split(X, y_lrs, test_size=0.2, random_state=RANDOM_STATE)
    _, _, y_apr_train, y_apr_test = train_test_split(X, y_apr, test_size=0.2, random_state=RANDOM_STATE)
    _, _, y_approval_train, y_approval_test = train_test_split(X, y_approval, test_size=0.2, random_state=RANDOM_STATE)

    lrs_model = Pipeline([('scaler', StandardScaler()), ('model', LinearRegression())])
    apr_model = Pipeline([('scaler', StandardScaler()), ('model', LinearRegression())])
    approval_model = Pipeline([('scaler', StandardScaler()), ('model', LogisticRegression(max_iter=1000))])

    lrs_model.fit(X_train, y_lrs_train)
    apr_model.fit(X_train, y_apr_train)
    approval_model.fit(X_train, y_approval_train)

    metrics = {
        'lrs_r2': float(lrs_model.score(X_test, y_lrs_test)),
        'apr_r2': float(apr_model.score(X_test, y_apr_test)),
        'approval_accuracy': float(approval_model.score(X_test, y_approval_test)),
    }

    joblib.dump(lrs_model, f'{output_dir}/lrs_model.joblib')
    joblib.dump(apr_model, f'{output_dir}/apr_model.joblib')
    joblib.dump(approval_model, f'{output_dir}/approval_model.joblib')

    with open(f'{output_dir}/features.json', 'w', encoding='utf-8') as f:
        json.dump(FEATURES, f)

    with open(f'{output_dir}/metrics.json', 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

    print('Model training complete', metrics)


if __name__ == '__main__':
    train_models()
