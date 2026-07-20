-- V1__init_schema.sql: Production-Grade Schema for AI Resume Builder SaaS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    plan_type VARCHAR(50) NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- 2. SaaS Plans Table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    max_generations_per_day INT NOT NULL DEFAULT 1,
    max_improvements_per_day INT NOT NULL DEFAULT 2,
    max_ats_checks_per_day INT NOT NULL DEFAULT 2,
    price_cents INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO plans (name, max_generations_per_day, max_improvements_per_day, max_ats_checks_per_day, price_cents)
VALUES 
    ('FREE', 1, 2, 2, 0),
    ('PRO', 50, 200, 200, 1900),
    ('ENTERPRISE', 1000, 5000, 5000, 9900)
ON CONFLICT (name) DO NOTHING;

-- 3. Resumes Table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    content_json JSONB NOT NULL,
    ats_score INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at DESC);

-- 4. Resume Versions Table
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);

-- 5. Daily Usage Records Table
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    generation_count INT NOT NULL DEFAULT 0,
    improvement_count INT NOT NULL DEFAULT 0,
    ats_check_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_user_usage_date UNIQUE (user_id, usage_date)
);

CREATE INDEX idx_usage_records_user_date ON usage_records(user_id, usage_date);

-- 6. AI Request Logs Table
CREATE TABLE ai_request_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    provider_name VARCHAR(50) NOT NULL,
    model_name VARCHAR(100),
    endpoint VARCHAR(100) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    latency_ms BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_logs_user_id ON ai_request_logs(user_id);
CREATE INDEX idx_ai_logs_provider ON ai_request_logs(provider_name);
CREATE INDEX idx_ai_logs_created_at ON ai_request_logs(created_at DESC);

-- 7. Security Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
