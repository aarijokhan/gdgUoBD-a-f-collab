import { NextResponse } from 'next/server';

// Updated SOLUTIONS with "Chained" Hints
const SOLUTIONS = {
  // Stage 1: Solve for 50 shares
  stage1: { 
    answer: 50, 
    flag: "FLAG{NEXT_TARGET_IS_PORTFOLIO_PAGE}" // Guides them to /portfolio
  },
  
  // Stage 2: Solve for the 50,000 accounting error (after they reach this page)
  stage2: { 
    answer: 50000, 
    flag: "FLAG{ADMIN_USER_IS_KWEST}" // Guides them to the login page (Stage 3)
  },

  // Stage 3: Login with "kwest" credentials
  stage3: { 
    role: "compliance_officer", // This is not directly used in API, but for logic clarity
    flag: "FLAG{CHECK_OPTIONS_VALUATION}" // Guides them to the admin options page (Stage 4)
  },

  // Stage 4: Intrinsic Value Floor
  // Stock (150) - Strike (100) = 50.
  stage4: { 
    answer: 50, 
    flag: "FLAG{AUTHORIZE_WIRE_TRANSFER_NOW}" 
  },

  // Stage 5: Solve for 500,000 wire amount (final flag)
  stage5: { 
    answer: 500000, 
    flag: "FLAG{SYSTEM_SECURED_YOU_WIN}" // The final victory flag
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stage, input } = body;

    console.log(`Received submission for ${stage}: ${input}`);

    // --- Verification Logic for Each Stage ---
    if (stage === 'stage1' && Number(input) === SOLUTIONS.stage1.answer) {
      return NextResponse.json({ success: true, flag: SOLUTIONS.stage1.flag });
    }

    if (stage === 'stage2' && Number(input) === SOLUTIONS.stage2.answer) {
      return NextResponse.json({ success: true, flag: SOLUTIONS.stage2.flag });
    }
    
    // Note: Stage 3 (Login) is handled client-side via redirect, 
    // but the flag can be shown on success of login in client-side toast.
    // If you wanted a server-side flag for login, you'd add similar logic here.

    if (stage === 'stage4' && Number(input) === SOLUTIONS.stage4.answer) {
      return NextResponse.json({ success: true, flag: SOLUTIONS.stage4.flag });
    }

    if (stage === 'stage5' && Number(input) === SOLUTIONS.stage5.answer) {
      return NextResponse.json({ success: true, flag: SOLUTIONS.stage5.flag });
    }

    // Default incorrect response
    return NextResponse.json({ success: false, message: "Incorrect value. Please re-evaluate." });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, message: "Invalid request body or server error." }, { status: 400 });
  }
}