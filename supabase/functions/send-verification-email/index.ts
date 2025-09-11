import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

console.log('Starting send-verification-email function')

Deno.serve(async (req) => {
  console.log(`Request received: ${req.method}`)
  
  if (req.method !== 'POST') {
    console.log('Method not allowed')
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Processing webhook payload...')
    
    // If no hook secret is configured, skip webhook verification for development
    let verifiedData
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      verifiedData = wh.verify(payload, headers)
    } else {
      console.log('No webhook secret configured, parsing payload directly')
      verifiedData = JSON.parse(payload)
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = verifiedData as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log(`Sending verification email to: ${user.email}`)
    console.log(`Email action type: ${email_action_type}`)

    const html = await renderAsync(
      React.createElement(VerificationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to,
        email_action_type,
        user_email: user.email,
      })
    )

    const { error } = await resend.emails.send({
      from: 'Visa Solutions <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Verify your email address - Visa Solutions',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully')
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-verification-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})