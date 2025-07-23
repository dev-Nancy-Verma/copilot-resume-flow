import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Resume generation request received');
    
    // Parse the request body
    const resumeData = await req.json();
    console.log('Resume data:', JSON.stringify(resumeData, null, 2));

    // Forward the request to the external webhook
    const webhookUrl = 'https://platform.copilotgigs.com/webhook/600c6682-6936-4147-93f2-bc533422574a';
    
    console.log('Forwarding request to webhook:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });

    console.log('Webhook response status:', response.status);
    
    if (!response.ok) {
      console.error('Webhook request failed:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate resume',
          status: response.status,
          statusText: response.statusText 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await response.text();
    console.log('Webhook response:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Resume generation started' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-resume function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});