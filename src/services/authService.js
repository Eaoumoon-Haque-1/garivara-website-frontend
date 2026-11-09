import authApiClient from "../api/authApiClient"


export async function sendOtp(mobile_no) {
  const { data } = await authApiClient.post('/send_otp_passenger', {
    mobile_no,
  })
  console.log(data);

  return data
}

export async function verifyOtp(mobile_no, otp) {
  const { data } = await authApiClient.post('/verify_otp_passenger', {
    mobile_no,
    otp,
  })

  return data
}
