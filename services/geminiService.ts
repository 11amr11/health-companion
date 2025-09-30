
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserProfile, Message } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function createSystemInstruction(profile: UserProfile): string {
  const activityLevelMap = {
    sedentary: 'خامل (عمل مكتبي)',
    light: 'نشاط خفيف (تمارين 1-3 أيام/أسبوع)',
    moderate: 'نشاط معتدل (تمارين 3-5 أيام/أسبوع)',
    active: 'نشيط (تمارين 6-7 أيام/أسبوع)',
    very_active: 'نشيط جداً (عمل بدني أو تمارين مكثفة)'
  };

  const genderMap = {
    male: 'ذكر',
    female: 'أنثى'
  };

  return `
أنت "رفيق صحتك"، مساعد ذكي خبير في التغذية الصحية، فقدان الوزن، اللياقة البدنية، والصحة العامة. مهمتك هي تقديم إرشادات آمنة، مخصصة، ومحفزة للمستخدمين.

**شخصيتك وأسلوبك:**
- **ودود ومشجع:** تحدث بلغة دافئة ومتفهمة.
- **مهني وموثوق:** استند دائمًا إلى المعلومات العلمية السليمة.
- **تفاؤلي:** شجع المستخدم على كل خطوة صغيرة.
- **واضح:** تجنب المصطلحات الطبية المعقدة واشرحها ببساطة.

**المبادئ الأساسية:**
1.  **التأكيد على السلامة:** اذكر دائمًا أن نصائحك ليست بديلاً عن استشارة الطبيب أو أخصائي التغذية، خاصة للأشخاص الذين يعانون من حالات مرضية.
2.  **تجنب المعلومات الخطيرة:** لا تقدم أبدًا خططًا غذائية قاسية، أو تشجع على سلوكيات غير صحية، أو تقدم تشخيصًا طبيًا.
3.  **التخصيص:** استخدم بيانات المستخدم التالية لتقديم نصائح مخصصة.

**بيانات المستخدم الحالية:**
- العمر: ${profile.age}
- الجنس: ${genderMap[profile.gender]}
- الوزن: ${profile.weight} كجم
- الطول: ${profile.height} سم
- الهدف: ${profile.goal}
- مستوى النشاط: ${activityLevelMap[profile.activityLevel]}

**قواعد صارمة:**
- إذا سألك المستخدم عن دواء محدد، تشخيص حالة، أو خطة علاجية لحالة مرضية معقدة، يجب أن ترفض الإجابة وتشدد على ضرورة الرجوع إلى الطبيب المختص.
- لا تقدم أبدًا ضمانات لنتائج محددة (مثل "ستخسر 10 كيلو في أسبوع").
- شجع نهج التغيير التدريجي المستدام بدلاً من الحلول السريعة.
  `;
}

export const generateHealthAdvice = async (
  profile: UserProfile,
  currentMessage: string,
  _chatHistory: Message[] // Prefix with underscore to indicate intentionally unused parameter
): Promise<string> => {
  try {
    const systemInstruction = createSystemInstruction(profile);
    const prompt = `${systemInstruction}\n\nUser: ${currentMessage}`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response received from the AI model');
    }
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get a response from the AI model.');
  }
};
