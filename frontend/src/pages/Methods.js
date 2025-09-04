import React from 'react';
import styled from 'styled-components';
import Card from '../components/shared/Card';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

const Paragraph = styled.p`
  color: #374151;
  line-height: 1.6;
`;

const List = styled.ul`
  margin: 0 0 0 18px;
  color: #374151;
`;

const CodeBlock = styled.pre`
  background: #0b1020;
  color: #e5e7eb;
  border-radius: 8px;
  padding: 14px;
  overflow-x: auto;
  font-size: 0.9rem;
`;

const Methods = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Methods</PageTitle>
      </PageHeader>

      <Section>
                  <Card title="Data Sources and Preparation" subtitle="Simple steps">
          <Paragraph>
            We combine three worksheets (Event Characteristics, Event POS, Stand POS), standardize dates/times,
            and create per-capita KPIs. Event Characteristics joins with Event POS at the date-venue grain to form
            the modeling table.
          </Paragraph>
          <List>
            <li>Collect: import three tabs and validate columns</li>
            <li>Clean: parse dates/times, fix types, remove obvious anomalies</li>
            <li>Join: link Event Characteristics to Event POS by venue and date</li>
            <li>Engineer: day-of-week, month, hour, weekend, and per-capita KPIs</li>
            <li>Check: spot-check ranges and missing values</li>
          </List>
        </Card>
      </Section>

      <Section>
                  <Card title="Modeling Strategy" subtitle="Step-by-step, per model">
          <List>
            <li><strong>Linear Regression</strong>: establishes a simple baseline; fast and interpretable. We used it to sanity-check directionality and effect sizes.</li>
            <li><strong>Random Forest</strong>: captures non-linearities and interactions without heavy tuning. We used feature importance to verify attendance and calendar fields dominate.</li>
            <li><strong>Gradient Boosting</strong>: strongest event-level accuracy in our tests; selected when it achieved the highest held-out R².</li>
            <li><strong>Selection rule</strong>: for each target (transactions, sales, units, POS), we pick the model with the best held-out R², then compute per-attendee KPIs from the predictions.</li>
          </List>
        </Card>
      </Section>

      <Section>
                  <Card title="March 5 Forecasting" subtitle="Step by step">
          <List>
            <li>Set assumptions: attendance 10,000; Sunday; 2 PM; opponent average</li>
            <li>Assemble inputs: attendance + encoded calendar/opponent fields</li>
            <li>Score models: get predictions for transactions, sales, units, POS</li>
            <li>Derive KPIs: transactions/attendee, sales/attendee, sales/transaction</li>
            <li>Cross-check: compare to historical NBA averages and weekend/daytime patterns</li>
          </List>
        </Card>
      </Section>

      <Section>
        <Card title="Stand-Level Staffing" subtitle="Allocation using historical share and service rates">
          <Paragraph>
            We allocate predicted transactions across stand groups in proportion to their historical share,
            then size POS terminals using empirically observed transactions-per-POS efficiency by stand type.
            This yields both per-stand POS counts and total cashier counts.
          </Paragraph>
          <List>
            <li>Share model: stand_share = stand_transactions / total_transactions</li>
            <li>Capacity: POS_needed = ceil(predicted_transactions_for_stand / avg_trans_per_pos)</li>
            <li>Outputs: per-stand POS, total POS, qualitative priority guidance</li>
          </List>
        </Card>
      </Section>

      <Section>
        <Card title="Risk, Assumptions, and Limitations" subtitle="What to watch and how to mitigate">
          <List>
            <li>Data drift between seasons and roster changes can shift per-capita behavior.</li>
            <li>Static opponent encoding approximates opponent effect; richer context could improve this.</li>
            <li>Weather and promotions are not modeled explicitly; consider adding exogenous regressors.</li>
            <li>Mitigation: dynamic POS activation plan and real-time queue monitoring.</li>
          </List>
        </Card>
      </Section>

      <Section>
        <Card title="Performance and Deployment" subtitle="Caching, fast API, and local dev">
          <Paragraph>
            To ensure a responsive UI, we pre-compute analysis into a compact JSON cache and serve it via a
            lightweight Flask app. This avoids training or heavy aggregation at request time and makes local
            operation stable and fast.
          </Paragraph>
          <CodeBlock>{`# Generate cache once
python backend/cache_results.py

# Serve cached API
ython backend/app_fast.py  # bound to http://localhost:5001

# Frontend dev server
cd frontend && npm start  # proxy configured for port 5001`}</CodeBlock>
        </Card>
      </Section>
    </PageContainer>
  );
};

export default Methods; 