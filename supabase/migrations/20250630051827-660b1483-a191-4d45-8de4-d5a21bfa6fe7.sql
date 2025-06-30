
-- Create the pdfs storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO UPDATE SET
public = true;

-- Create policy to allow anyone to select files in the pdfs bucket
CREATE POLICY "Allow public read access to pdfs" ON storage.objects
FOR SELECT USING (bucket_id = 'pdfs');

-- Create policy to allow anyone to insert files in the pdfs bucket (for your n8n workflow)
CREATE POLICY "Allow public insert access to pdfs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pdfs');
