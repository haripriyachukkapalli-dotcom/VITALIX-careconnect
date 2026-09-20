function sendOTP(){
  const phone=document.getElementById('phone').value.trim();
  if(!/^\d{10}$/.test(phone)){alert('Please enter a valid 10-digit mobile number.');return;}
  document.getElementById('otpBox').classList.remove('hidden');
}
function verifyOTP(){
  const otp=document.getElementById('otp').value.trim();
  if(otp!=='1234'){alert('For this prototype, use OTP 1234.');return;}
  window.location.href='patient-details.html';
}
function savePatient(){
  const patient={
    name:document.getElementById('name').value.trim(),
    age:document.getElementById('age').value,
    gender:document.getElementById('gender').value,
    city:document.getElementById('city').value.trim(),
    concern:document.getElementById('concern').value.trim()
  };
  if(!patient.name || !patient.age || !patient.city){alert('Please fill name, age and city/area.');return;}
  localStorage.setItem('vitalixPatient',JSON.stringify(patient));
  window.location.href='dashboard.html';
}
