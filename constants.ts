import { QuestionType, Section } from './types';

export const APP_NAME = "서비스 만족도 설문조사";

// TODO: 구글 앱스 스크립트 배포 후 발급받은 웹 앱 URL을 아래에 입력해주세요.
// 예: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCm9YgUVIKdrDlMGrkPfSNz1Mw7C2VJh2M3VeI2hjeLfhNwAHGs7AUfbYcze_0mfc6sg/exec"; 

const SATISFACTION_OPTIONS = [
  { label: "매우 만족", value: "매우 만족" },
  { label: "만족", value: "만족" },
  { label: "보통", value: "보통" },
  { label: "불만족", value: "불만족" },
  { label: "매우 불만족", value: "매우 불만족" }
];

export const SURVEY_SECTIONS: Section[] = [
  {
    id: 'dealer_info',
    title: "",
    description: "서비스를 의뢰하신 대리점에 대한 경험을 알려주세요.",
    questions: [
      {
        id: 'q1_dealer_name',
        type: QuestionType.TEXT,
        label: "1. A/S 서비스를 의뢰하신 대리점은 어디입니까?",
        description: "공식서비스센터인 하이픽셀플러스에 직접 의뢰하신 경우는 '직접 방문' 또는 4번 문항으로 넘어가주세요.",
        placeholder: "대리점명 입력 (예: 디지탈e세상, 또는 직접방문)",
        required: true
      },
      {
        id: 'q2_dealer_kindness',
        type: QuestionType.RADIO,
        label: "2. 의뢰하신 대리점의 친절도는 어떠셨습니까?",
        options: SATISFACTION_OPTIONS,
        required: true
      },
      {
        id: 'q3_dealer_expertise',
        type: QuestionType.RADIO,
        label: "3. 의뢰하신 대리점의 전문성은 어떠셨습니까?",
        options: SATISFACTION_OPTIONS,
        required: true
      }
    ]
  },
  {
    id: 'center_info',
    title: "",
    description: "하이픽셀 공식 서비스센터에 대한 경험을 평가해주세요.",
    questions: [
      {
        id: 'q4_center_kindness',
        type: QuestionType.RADIO,
        label: "4. 공식서비스센터의 친절도는 어떠셨습니까?",
        options: SATISFACTION_OPTIONS,
        required: true
      },
      {
        id: 'q5_center_expertise',
        type: QuestionType.RADIO,
        label: "5. 공식서비스센터의 전문성은 어떠셨습니까?",
        options: SATISFACTION_OPTIONS,
        required: true
      },
      {
        id: 'q6_repair_cost',
        type: QuestionType.RADIO,
        label: "6. (유상수리 고객분만) 수리비용의 만족도는 어떠셨습니까?",
        options: [...SATISFACTION_OPTIONS, { label: "해당 없음 (무상수리)", value: "무상수리" }],
        required: false
      }
    ]
  },
  {
    id: 'product_feedback',
    title: "",
    description: "제품 만족도와 귀한 의견을 들려주세요.",
    questions: [
      {
        id: 'q7_product_satisfaction',
        type: QuestionType.RADIO,
        label: "7. 서비스를 받으신 이후, 제품의 만족도는 어떠십니까?",
        options: SATISFACTION_OPTIONS,
        required: true
      },
      {
        id: 'q8_other_opinions',
        type: QuestionType.TEXTAREA,
        label: "8. 기타 다른 의견이 있으시면 말씀해 주십시오.",
        description: "고객님의 소중한 의견 반영을 위해 최선을 다하겠습니다.",
        placeholder: "서비스 과정에서 좋았던 점이나 개선할 점을 자유롭게 적어주세요.",
        required: false
      },
      {
        id: 'q9_phone_number',
        type: QuestionType.TEXT,
        label: "9. 스타벅스 커피쿠폰 발송을 위한 휴대폰 번호",
        description: "제공하신 개인정보는 커피쿠폰 발송 이외의 다른 용도로는 일절 사용되지 않습니다. (※업체 관계자는 해당 없음)",
        placeholder: "010-0000-0000",
        required: false
      }
    ]
  }
];