import React, { useState } from 'react';
import { SURVEY_SECTIONS, GOOGLE_SCRIPT_URL } from '../constants';
import { QuestionType, SurveyData } from '../types';
import { Button, Input, TextArea, SelectCard, GlassPanel } from './UI';
import { Check, Send, AlertTriangle, Mail, Sparkles } from 'lucide-react';
import { submitToGoogleSheet, submitSubscription } from '../services/sheetService';

export const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email Subscription State
  const [email, setEmail] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleInputChange = (id: string, value: any) => {
    // 휴대폰 번호 포맷팅 로직
    if (id === 'q9_phone_number') {
      const number = value.replace(/[^0-9]/g, ''); // 숫자만 남김
      let formatted = '';

      if (number.length <= 11) {
        if (number.length < 4) {
          formatted = number;
        } else if (number.length < 8) {
          formatted = `${number.slice(0, 3)}-${number.slice(3)}`;
        } else {
          formatted = `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
        }
        setFormData(prev => ({ ...prev, [id]: formatted }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isFormValid = () => {
    for (const section of SURVEY_SECTIONS) {
      for (const q of section.questions) {
        if (q.required && !formData[q.id]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
       alert("모든 필수 항목을 입력해주세요.");
       return;
    }

    if (!GOOGLE_SCRIPT_URL) {
       alert("관리자 설정 필요: constants.ts 파일에 Google Apps Script URL을 설정해주세요.");
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    
    const sheetSuccess = await submitToGoogleSheet(formData);
    
    if (!sheetSuccess) {
      setErrorMsg("서버 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    
    setHasSubmitted(true);
    setIsSubmitting(false);
  };

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setIsEmailSubmitting(true);
    
    // 설문 데이터에 있는 전화번호를 가져옵니다.
    const phoneNumber = formData['q9_phone_number'] as string;

    const success = await submitSubscription(email, phoneNumber);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (success) {
      setEmailSubmitted(true);
    } else {
      alert("구독 신청 중 오류가 발생했습니다.");
    }
    setIsEmailSubmitting(false);
  };

  if (hasSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4 md:animate-fade-in-up">
        <GlassPanel className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 text-white">제출 완료</h2>
          <p className="text-gray-300 mb-10 max-w-md leading-relaxed text-lg">
            감사합니다. <br/>고객님의 소중한 의견이 안전하게 접수되었습니다. <br/> 참여해 주셔서 감사합니다.<br/>
            스타벅스 쿠폰은 입력하신 번호로 <br/>매월 1일에 일괄 발송됩니다.
          </p>

          {/* Email Subscription Section */}
          <div className="w-full pt-10 border-t border-white/10 md:animate-fade-in-up animation-delay-300">
            {!emailSubmitted ? (
              <div className="flex flex-col items-center">
                <div className="bg-indigo-500/10 p-3 rounded-full mb-4">
                   <Mail className="w-6 h-6 text-hipixel-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  최신 기술 소식 받기 <Sparkles className="w-4 h-4 text-yellow-300" />
                </h3>
                <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
                  블랙매직디자인의 최신 기술 뉴스레터와<br/>
                  자주 묻는 질문(FAQ)을 정리하여 이메일로 보내드립니다.
                </p>
                <div className="flex w-full max-w-sm gap-2">
                  <Input 
                    placeholder="이메일 주소를 입력하세요" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleEmailSubmit} 
                    isLoading={isEmailSubmitting}
                    disabled={isEmailSubmitting}
                    className="whitespace-nowrap px-6"
                  >
                    구독하기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 bg-hipixel-accent/10 rounded-xl w-full max-w-md mx-auto border border-hipixel-accent/20">
                <h3 className="text-xl font-bold text-hipixel-accent mb-2">구독 신청 완료!</h3>
                <p className="text-gray-300 text-sm">
                  앞으로 유용한 정보를 메일로 전해드리겠습니다.
                </p>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-0 pb-40">
      <GlassPanel>
        {SURVEY_SECTIONS.map((section, sIdx) => (
          <div key={section.id} className={sIdx > 0 ? "mt-16 pt-16 border-t border-white/5" : ""}>
             <div className="mb-10">
               <span className="text-hipixel-accent font-mono text-sm tracking-wider uppercase mb-2 block">Part {sIdx + 1}</span>
               <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 break-keep text-white">{section.title}</h2>
               <p className="text-gray-400 text-base md:text-lg break-keep">{section.description}</p>
             </div>
             
             <div className="space-y-12">
               {section.questions.map((q) => (
                 <div key={q.id} className="space-y-3 md:animate-fadeIn">
                    <label className="block text-base md:text-lg font-semibold text-gray-200 ml-1 break-keep">
                        {q.label} {q.required && <span className="text-hipixel-accent text-sm align-top">*</span>}
                    </label>
                    {q.description && (
                        <p className="text-sm text-gray-300 ml-1 -mt-1 mb-2 leading-relaxed opacity-90">{q.description}</p>
                    )}

                    {q.type === QuestionType.TEXT && (
                        <Input 
                        placeholder={q.placeholder}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                    )}

                    {q.type === QuestionType.TEXTAREA && (
                        <TextArea 
                        placeholder={q.placeholder}
                        value={formData[q.id] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                    )}

                    {q.type === QuestionType.SELECT && (
                        <div className="relative">
                        <select
                            className="w-full px-4 py-3 bg-[#0f0f12] border border-white/10 rounded-lg text-white focus:outline-none focus:border-hipixel-accent appearance-none"
                            value={formData[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                        >
                            <option value="" disabled>선택해주세요</option>
                            {q.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                        </div>
                    )}

                    {q.type === QuestionType.RADIO && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {q.options?.map((opt) => (
                            <SelectCard
                            key={opt.value}
                            label={opt.label}
                            selected={formData[q.id] === opt.value}
                            onClick={() => handleInputChange(q.id, opt.value)}
                            />
                        ))}
                        </div>
                    )}
                 </div>
               ))}
             </div>
          </div>
        ))}

        {errorMsg && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {errorMsg}
          </div>
        )}

      </GlassPanel>

      {/* Fixed Bottom Button - Increased z-index to 100 and fully opaque background to ensure visibility over footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0a0a0c] border-t border-white/10 z-[100] flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="w-full max-w-md">
           <Button 
             onClick={handleSubmit}
             className="w-full text-lg py-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02]"
             isLoading={isSubmitting}
             disabled={isSubmitting}
           >
             설문 제출하기 <Send className="w-5 h-5 ml-2" />
           </Button>
         </div>
      </div>
    </div>
  );
};