import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  // Add CORS headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    console.log("Contact form submission received");
    console.log("Event headers:", event.headers);
    console.log("Event body:", event.body);

    // Parse form data
    const contentType = event.headers["content-type"] || "";
    let formData: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse URL-encoded form data
      const body = event.body || "";
      const params = new URLSearchParams(body);
      params.forEach((value, key) => {
        formData[key] = value;
      });
    } else if (contentType.includes("application/json")) {
      // Parse JSON data
      formData = JSON.parse(event.body || "{}");
    } else {
      throw new Error("Unsupported content type");
    }

    console.log("Form data received:", Object.keys(formData));

    // Extract and validate form fields
    const { name, email, subject, message, "bot-field": botField, "form-name": formName } = formData;

    // Check honeypot field for spam protection
    if (botField) {
      console.log("Spam detected - honeypot field filled");
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Spam detected" }),
      };
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log("Missing required fields");
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid email format" }),
      };
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim().replace(/[<>]/g, ''),
      email: email.trim().replace(/[<>]/g, ''),
      subject: subject.trim().replace(/[<>]/g, ''),
      message: message.trim().replace(/[<>]/g, '')
    };

    console.log("Data sanitized and validated successfully");
    console.log("Contact details:", {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      messageLength: sanitizedData.message.length
    });

    // Submit to Netlify Forms so it appears in the Netlify dashboard
    const siteUrl = process.env.URL || event.headers.origin || 'https://allwebsd.com';

    // Prepare form data for Netlify Forms submission
    const netlifyFormData = new URLSearchParams({
      "form-name": "contact",
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      message: sanitizedData.message
    });

    console.log("Submitting to Netlify Forms at:", `${siteUrl}/contact.html`);

    // Submit to Netlify Forms using the static HTML form page
    const netlifyResponse = await fetch(`${siteUrl}/contact.html`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: netlifyFormData.toString()
    });

    console.log("Netlify Forms response status:", netlifyResponse.status);

    if (!netlifyResponse.ok) {
      const responseText = await netlifyResponse.text();
      console.log("Netlify Forms response:", responseText);
      // Don't throw error - just log it and continue
      console.warn(`Netlify Forms submission failed: ${netlifyResponse.status}`);
    } else {
      console.log("Form submitted successfully to Netlify Forms");
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Thank you for your message! I'll get back to you soon."
      }),
    };

  } catch (error) {
    console.error("Contact form submission error:", error);

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to submit form. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
    };
  }
};
