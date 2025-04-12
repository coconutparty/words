// api/openai-proxy.js
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONS 요청 처리 (프리플라이트 요청)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST 요청이 아닌 경우 처리
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드입니다' });
  }

  try {
    // 요청 본문 검증
    if (!req.body || !req.body.messages || !req.body.model) {
      return res.status(400).json({ 
        error: '잘못된 요청 형식입니다',
        details: '요청에 model과 messages가 포함되어야 합니다' 
      });
    }

    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: '서버 구성 오류',
        details: 'API 키가 설정되지 않았습니다' 
      });
    }

    // 요청 데이터 준비
    const requestData = {
      model: req.body.model,
      messages: req.body.messages,
      max_tokens: req.body.max_tokens || 50,
      temperature: req.body.temperature || 0.7
    };

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    });

    // OpenAI API 응답 상태 확인
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      return res.status(openaiResponse.status).json({
        error: '외부 API 오류',
        status: openaiResponse.status,
        details: errorData.error || '알 수 없는 오류가 발생했습니다'
      });
    }

    // 응답 데이터 처리
    const responseData = await openaiResponse.json();
    
    // 응답 반환
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('서버 오류:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다', 
      message: error.message || '알 수 없는 오류'
    });
  }
}
