import React, { useState } from 'react';
import { SURVEY_SECTIONS, GOOGLE_SCRIPT_URL } from '../constants';
import { QuestionType, SurveyData } from '../types';
import { Button, Input, TextArea, SelectCard, GlassPanel } from './UI';
import { Check, Send, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { submitToGoogleSheet } from '../services/sheetService';

export const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        if (q.type === QuestionType.PRIVACY_CONTACT) {
           // 9번 항목: 체크박스(q9_opt_in)가 'true'일 때만 내부 유효성 검사 진행
           const isOptedIn = formData['q9_opt_in'] === 'true';
           
           if (!isOptedIn) {
             // 참여하지 않는 경우 유효한 것으로 간주 (넘어가기)
             continue;
           }

           // 참여 체크했는데 동의 여부를 선택 안한 경우
           if (!formData['privacy_agreement']) {
             return false;
           }
           // 동의했는데 전화번호가 없는 경우
           if (formData['privacy_agreement'] === '동의합니다' && !formData['q9_phone_number']) {
             alert('개인정보 수집에 동의하실 경우 휴대 전화번호는 필수입니다.');
             return false;
           }
           continue;
        }

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
    
    // 9번 항목의 전화번호와 이메일도 formData에 포함되어 전송됩니다.
    // (Opt-in 안한 경우 빈 값으로 전송됨)
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
            커피쿠폰은 입력하신 번호로 <br/>익월 5일경에 일괄 발송됩니다.
          </p>
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
               <h2 className="text-lg md:text-xl font-display font-bold mb-2 break-keep text-white">{section.title}</h2>
               <p className="text-gray-400 text-base md:text-lg break-keep whitespace-pre-line leading-relaxed">{section.description}</p>
             </div>
             
             <div className="space-y-12">
               {section.questions.map((q) => (
                 <div key={q.id} className="space-y-3 md:animate-fadeIn">
                    
                    {/* Special Handling for Privacy Contact Group */}
                    {q.type === QuestionType.PRIVACY_CONTACT ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-base md:text-lg font-semibold text-gray-200 break-keep mb-1">
                              {q.label}
                          </label>
                          <p className="text-sm text-gray-300 leading-relaxed opacity-90 whitespace-pre-line">{q.description}</p>
                        </div>

                        {/* Opt-in Toggle Checkbox */}
                        <div 
                          className={`
                            relative flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 cursor-pointer group
                            ${formData['q9_opt_in'] === 'true' 
                              ? 'bg-hipixel-accent/10 border-hipixel-accent shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                          `}
                          onClick={() => {
                            const currentVal = formData['q9_opt_in'] === 'true';
                            handleInputChange('q9_opt_in', currentVal ? 'false' : 'true');
                          }}
                        >
                           <div className={`
                                w-6 h-6 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0
                                ${formData['q9_opt_in'] === 'true' ? 'bg-hipixel-accent border-hipixel-accent' : 'bg-transparent border-gray-500 group-hover:border-gray-300'}
                            `}>
                                {formData['q9_opt_in'] === 'true' && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1">
                                <span className={`text-lg font-medium ${formData['q9_opt_in'] === 'true' ? 'text-white' : 'text-gray-300'}`}>
                                  커피쿠폰 이벤트 참여 및 정보 입력
                                </span>
                                <p className="text-sm text-gray-400 mt-1">
                                  선택하시면 정보 입력란이 나타납니다.
                                </p>
                            </div>
                            <div className="text-gray-400">
                                {formData['q9_opt_in'] === 'true' ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>

                        {/* Hidden Content: Only shows when opted in */}
                        {formData['q9_opt_in'] === 'true' && (
                          <div className="space-y-6 pt-4 animate-fadeIn border-t border-white/5 mt-4">
                            {/* Phone & Email Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input 
                                placeholder="휴대 전화번호 (010-0000-0000)"
                                value={formData['q9_phone_number'] || ''}
                                onChange={(e) => handleInputChange('q9_phone_number', e.target.value)}
                              />
                              <Input 
                                placeholder="이메일 주소"
                                value={formData['q9_email'] || ''}
                                onChange={(e) => handleInputChange('q9_email', e.target.value)}
                              />
                            </div>

                            {/* Privacy Agreement Text */}
                            <div className="mt-8">
                              <h4 className="text-lg font-bold text-white mb-3">[개인정보 수집 및 이용 동의]</h4>
                              <div className="bg-white/5 rounded-lg border border-white/10 p-5 text-sm text-gray-300 leading-relaxed shadow-inner">
                                <div className="space-y-4">
                                    <p className="leading-relaxed">
                                      커피쿠폰 증정 및 마케팅 활용 동의를 위해 아래와 같이 개인정보를 수집·이용하고자 합니다. 내용을 확인하신 후 동의 여부를 결정하여 주시기 바랍니다. 동의하신 경우에 한하여 커피쿠폰 증정 대상이 됩니다.
                                    </p>
                                    
                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <span className="block font-semibold text-white text-sm mb-1">수집 목적</span>
                                            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                                                <li>설문조사 응답자 대상 커피 쿠폰 발송</li>
                                                <li>이메일을 통한 마케팅 정보 제공</li>
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <span className="block font-semibold text-white text-sm mb-1">수집 항목</span>
                                            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                                                <li>휴대전화번호</li>
                                                <li>이메일 주소</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="block font-semibold text-white text-sm mb-1">이용 방법</span>
                                            <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
                                                <li>휴대전화번호는 커피 쿠폰 증정을 위한 용도로만 활용됩니다.</li>
                                                <li>이메일 주소는 마케팅 정보 제공을 위한 용도로 활용될 수 있습니다.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="block font-semibold text-white text-sm mb-1">보유 및 이용 기간</span>
                                            <p className="text-gray-400 text-xs">입력일로부터 1년간 보유 및 이용 후 파기</p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                        ※ 귀하께서는 개인정보 수집 및 이용에 대한 동의를 거부하실 권리가 있습니다. 다만, 동의를 거부하실 경우 이벤트 추첨 대상에서 제외될 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                              </div>
                            </div>

                            {/* Agreement Radio Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {['동의합니다', '동의하지 않습니다'].map((val) => (
                                  <SelectCard
                                    key={val}
                                    label={val === '동의합니다' ? '네, 동의합니다.' : '동의하지 않습니다.'}
                                    selected={formData['privacy_agreement'] === val}
                                    onClick={() => {
                                      // Toggle logic: If already selected, clear it; otherwise set it
                                      const currentVal = formData['privacy_agreement'];
                                      const newVal = currentVal === val ? '' : val;
                                      handleInputChange('privacy_agreement', newVal);
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
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
                                onClick={() => {
                                    const currentVal = formData[q.id];
                                    const newVal = currentVal === opt.value ? '' : opt.value;
                                    handleInputChange(q.id, newVal);
                                }}
                                />
                            ))}
                            </div>
                        )}

                        {q.type === QuestionType.CHECKBOX && (
                          <div className="flex flex-col gap-3">
                            {q.options?.map(opt => {
                                const isChecked = formData[q.id] === opt.value;
                                return (
                                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                    <div className={`
                                        w-6 h-6 rounded border flex items-center justify-center transition-all duration-200
                                        ${isChecked ? 'bg-hipixel-accent border-hipixel-accent' : 'bg-white/5 border-gray-600 group-hover:border-gray-400'}
                                    `}>
                                        {isChecked && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={isChecked}
                                        onChange={() => {
                                            handleInputChange(q.id, isChecked ? '' : opt.value);
                                        }}
                                    />
                                    <span className={`text-base select-none ${isChecked ? 'text-white font-medium' : 'text-gray-400'}`}>
                                        {opt.label}
                                    </span>
                                  </label>
                                )
                            })}
                          </div>
                        )}
                      </>
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
