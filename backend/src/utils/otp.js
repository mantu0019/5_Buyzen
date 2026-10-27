export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHTML(otp) {
  const digits = String(otp).split("");

  const otpTiles = digits
    .map(
      (digit) => `
        <td style="padding:0 4px;">
          <div style="
            width:42px;
            height:52px;
            background:#fff7ed;
            border:1px solid #fed7aa;
            border-radius:10px;
            color:#111827;
            font-size:25px;
            font-weight:700;
            font-family:'Courier New',monospace;
            text-align:center;
            line-height:52px;
          ">
            ${digit}
          </div>
        </td>
      `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buyzen Email Verification</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f5f4;
  font-family:Arial,Helvetica,sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background:#f5f5f4;padding:35px 12px;"
  >
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table
          width="560"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
            max-width:560px;
            width:100%;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.07);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background:#111111;
                background-image:linear-gradient(135deg,#111111,#292018,#9a3412);
                padding:35px 20px;
              "
            >
              <div style="
                font-size:35px;
                font-weight:800;
                letter-spacing:-1px;
                color:#ffffff;
              ">
                Buy<span style="color:#f97316;">zen</span>
              </div>

              <p style="
                margin:8px 0 0;
                color:#fed7aa;
                font-size:12px;
                letter-spacing:2px;
              ">
                SHOP SMART · LIVE BETTER
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:35px 25px 15px;">

              <div style="
                width:58px;
                height:58px;
                line-height:58px;
                margin:0 auto 18px;
                text-align:center;
                border-radius:16px;
                background:#fff7ed;
                font-size:28px;
              ">
                🔐
              </div>

              <h1 style="
                margin:0 0 14px;
                text-align:center;
                color:#111827;
                font-size:25px;
                font-weight:750;
              ">
                Verify your email
              </h1>

              <p style="
                margin:0 auto 28px;
                max-width:400px;
                text-align:center;
                color:#6b7280;
                font-size:14px;
                line-height:24px;
              ">
                Welcome to Buyzen! Use the verification code below
                to verify your email address and secure your account.
              </p>

              <!-- OTP -->
              <table
                align="center"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="margin:0 auto 25px;"
              >
                <tr>
                  ${otpTiles}
                </tr>
              </table>

              <!-- Expiry -->
              <table
                align="center"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="margin:0 auto 28px;"
              >
                <tr>
                  <td style="
                    background:#fff7ed;
                    border-radius:30px;
                    padding:10px 17px;
                    color:#c2410c;
                    font-size:12px;
                    font-weight:700;
                  ">
                    ⏱ &nbsp; Expires in 10 minutes
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  background:#fff7ed;
                  border-left:4px solid #f97316;
                  border-radius:8px;
                  margin-bottom:23px;
                "
              >
                <tr>
                  <td style="padding:16px;">
                    <p style="
                      margin:0 0 7px;
                      color:#c2410c;
                      font-size:14px;
                      font-weight:700;
                    ">
                      Security Notice
                    </p>

                    <p style="
                      margin:0;
                      color:#57534e;
                      font-size:12px;
                      line-height:21px;
                    ">
                      Never share your OTP with anyone.
                      Buyzen will never ask you to disclose
                      your verification code.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="
                margin:0 0 25px;
                text-align:center;
                color:#9ca3af;
                font-size:12px;
                line-height:21px;
              ">
                If you didn't request this code, you can safely
                ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                background:#fafaf9;
                border-top:1px solid #f0f0f0;
                padding:24px 15px;
              "
            >
              <p style="
                margin:0 0 5px;
                color:#6b7280;
                font-size:12px;
              ">
                Happy Shopping!
              </p>

              <p style="
                margin:0;
                color:#111827;
                font-size:19px;
                font-weight:800;
              ">
                Buy<span style="color:#f97316;">zen</span>
              </p>

              <p style="
                margin:15px 0 0;
                color:#9ca3af;
                font-size:11px;
                line-height:19px;
              ">
                This is an automated email. Please do not reply.
                <br>
                &copy; ${new Date().getFullYear()} Buyzen.
                All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <p style="
          margin:18px 0 0;
          color:#a8a29e;
          font-size:11px;
          text-align:center;
        ">
          Secure shopping starts with Buyzen.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}
