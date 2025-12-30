-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'member', 'organization');
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE membership_interest AS ENUM ('Health', 'Environment', 'Education', 'Arts+Culture', 'Housing', 'Other');
CREATE TYPE approval_status AS ENUM ('to_review', 'completed', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE approval_decision AS ENUM ('approved', 'rejected');
CREATE TYPE payment_transaction_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status NOT NULL DEFAULT 'pending',
    orgName VARCHAR(255),
    orgContactTitle VARCHAR(255),
    orgWebsite VARCHAR(255),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications_individual table
CREATE TABLE applications_individual (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dateSubmitted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    membershipInterest membership_interest NOT NULL,
    memershipReason TEXT NOT NULL,
    approvalStatus approval_status NOT NULL DEFAULT 'to_review',
    paymentStatus payment_status NOT NULL DEFAULT 'pending',
    reviewedBy1 VARCHAR(255),
    reviewedBy2 VARCHAR(255),
    approvedDate TIMESTAMP WITH TIME ZONE
);

-- Create applications_organization table
CREATE TABLE applications_organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dateSubmitted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    membershipInterest membership_interest NOT NULL,
    memershipReason TEXT NOT NULL,
    programsOrServices TEXT[],
    paymentStatus payment_status NOT NULL DEFAULT 'pending',
    reviewedBy1 VARCHAR(255),
    reviewedBy2 VARCHAR(255),
    approvedDate TIMESTAMP WITH TIME ZONE
);

-- Create approvals table
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicationId UUID NOT NULL,
    approverId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signatureUri VARCHAR(500),
    decision approval_decision NOT NULL,
    decisionDate TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comments TEXT
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripeSessionId VARCHAR(255),
    stripePaymentIntentId VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status payment_transaction_status NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAT TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_applications_individual_userId ON applications_individual(userId);
CREATE INDEX idx_applications_individual_approvalStatus ON applications_individual(approvalStatus);
CREATE INDEX idx_applications_individual_paymentStatus ON applications_individual(paymentStatus);
CREATE INDEX idx_applications_organization_userId ON applications_organization(userId);
CREATE INDEX idx_applications_organization_paymentStatus ON applications_organization(paymentStatus);
CREATE INDEX idx_approvals_applicationId ON approvals(applicationId);
CREATE INDEX idx_approvals_approverId ON approvals(approverId);
CREATE INDEX idx_payments_userId ON payments(userId);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripeSessionId ON payments(stripeSessionId);
