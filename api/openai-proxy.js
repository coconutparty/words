javascript// api/openai-proxy.js
export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드입니다' });
  }

  try {
    // OpenAI API 키 (환경변수에서 가져옴)
    const apiKey = process.env.OPENAI_API_KEY;
    
    // 클라이언트에서 받은 데이터
    const data = req.body;
    
    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${apiKey}
      },
      body: JSON.stringify(data)
    });
    
    // 응답 데이터
    const responseData = await response.json();
    
    // 클라이언트에 응답 전달
    res.status(200).json(responseData);
  } catch (error) {
    console.error('오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
}
