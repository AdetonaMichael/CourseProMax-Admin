import { NextRequest, NextResponse } from 'next/server'
import { getLoginError } from '@/lib/login-error'

export async function GET(request: NextRequest) {
  try {
    const errorData = getLoginError()
    const response = {
      error: errorData?.message || null,
      statusCode: errorData?.statusCode || null,
      fieldErrors: errorData?.fieldErrors || null,
    }
    console.log('[LoginError Route] Returning:', JSON.stringify(response))
    return NextResponse.json(response)
  } catch (err) {
    console.error('[LoginError Route] Error:', err)
    return NextResponse.json({ error: null, statusCode: null, fieldErrors: null }, { status: 200 })
  }
}

