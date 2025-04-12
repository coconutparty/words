// api/openai-proxy.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드입니다' });
  }

  try {
    // API 키 하드코딩 (보안상 위험한 방식)
    const apiKey = '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'; 
    
    // 클라이언트에서 받은 데이터
    const data = req.body;
    
    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
