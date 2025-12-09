-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_leads_meeting_date ON leads(meeting_date);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for upcoming meetings
CREATE OR REPLACE VIEW upcoming_meetings AS
SELECT
    id,
    name,
    phone,
    meeting_date,
    meeting_time,
    status,
    notes,
    created_at
FROM leads
WHERE meeting_date >= CURRENT_DATE
    AND status IN ('pending', 'confirmed')
ORDER BY meeting_date, meeting_time;

COMMENT ON TABLE leads IS 'Stores consultation booking requests';
COMMENT ON COLUMN leads.status IS 'Booking status: pending, confirmed, or cancelled';
COMMENT ON COLUMN leads.calendar_event_id IS 'Google Calendar event ID for syncing';
