// app/api/subscribe-newsletter/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
// This ensures the API key is NEVER exposed to the client-side
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Handles POST requests for newsletter subscriptions.
 * This function receives the user's email, sends a notification
 * to your specified email address via Resend, and returns a JSON response.
 *
 * @param request The incoming Next.js Request object.
 * @returns A NextResponse object with a success or error message.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body as JSON to get the email
    const { email } = await request.json();

    // Basic validation for the email address
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }

    // Send the notification email using Resend
    const { data, error } = await resend.emails.send({
      // The 'from' address MUST be a verified domain/email in your Resend account.
      // For testing without a custom domain, 'onboarding@resend.dev' is used.
      from: 'Your Newsletter <onboarding@resend.dev>',
      // The 'to' address is where you want to receive the subscription notification.
      to: 'lennoxmathew@gmail.com',
      subject: 'New Newsletter Subscriber!',
      html: `
        <p>Hello Lennox,</p>
        <p>A new user has subscribed to your newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>You can now add them to your mailing list.</p>
      `,
    });

    // Handle any errors from the Resend API call
    if (error) {
      console.error('Resend email error:', error);
      // Return a generic error message to the client for security reasons
      return NextResponse.json({ message: 'Failed to send notification email.' }, { status: 500 });
    }

    // Log successful Resend data (visible in your server terminal)
    console.log('Resend success data:', data);

    // Return a success response to the frontend
    return NextResponse.json({ message: 'Successfully subscribed to the newsletter!' }, { status: 200 });

  } catch (error: any) {
    // Catch any unexpected errors during the API route execution
    console.error('Server-side subscription error:', error);
    // Return a generic internal server error message
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// If you need to handle other HTTP methods (e.g., GET, PUT, DELETE) for this route,
// you would export them as separate async functions (e.g., export async function GET() { ... }).
// For a newsletter signup, POST is typically the only method needed.
