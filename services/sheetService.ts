import { SurveyData } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

const getFormattedDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

export const submitToGoogleSheet = async (data: SurveyData): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Google Script URL is missing. Please set it in constants.ts");
    return true;
  }

  // Google Apps Script expects these exact keys
  // Updated for new Question 9 Structure (Phone + Email + Agreement)
  const payload = {
    type: 'survey',
    timestamp: getFormattedDate(),
    q1_dealer_name: data.q1_dealer_name || '',
    q2_dealer_kindness: data.q2_dealer_kindness || '',
    q3_dealer_expertise: data.q3_dealer_expertise || '',
    q4_center_kindness: data.q4_center_kindness || '',
    q5_center_expertise: data.q5_center_expertise || '',
    q6_repair_cost: data.q6_repair_cost || 'na',
    q7_product_satisfaction: data.q7_product_satisfaction || '',
    q8_other_opinions: data.q8_other_opinions || '',
    // Use the keys used in SurveyForm custom renderer
    q9_phone_number: data.q9_phone_number || '', 
    q9_email: data.q9_email || '',
    q10_privacy_agreement: data.privacy_agreement || '' 
  };

  try {
    // We remove Content-Type header to prevent preflight OPTIONS request issues
    // and rely on Apps Script parsing the raw POST body.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      mode: "no-cors" 
    });
    return true;
  } catch (error) {
    console.error("Error submitting to Google Sheet:", error);
    return false;
  }
};
